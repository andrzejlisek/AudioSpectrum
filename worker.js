var FFT_cos_table;
var FFT_sin_table;
var FFT_FourierWindowVals;

var FFT_FourierMinThreshold = 0.001;
var FFT_FourierResolutionV = 256.0;
var FFT_FourierResolutionB = 8;

var FFT_FourierBase = 1024;
var FFT_FourierWindow = 3;
var FFT_WinFactor = 1024;


var IsPaused = false;

var AudioMode = 0;

var sampleRate;
var SampleDecimation = 1;
var SampleDecimationBuf = 0;
var SampleDecimationCounter = 0;

var SpectrumStep = 32;
var SpectrumStepCounter = 0;
var SpectrumGain = 1;
var SpectrumBase = 0;
var SpectrumMinMax = 0;
var SpectrumMinMaxX = 0;


var BufData = [];
var BufPointer = 0;
var BufLength = 10000000;


var BufPointer0 = 0;
var BufDisp = 200;
var BufDisp0 = 200;
var BufIgnited = false;
var BufCounter = 0;
var BufPerTick = 50;
var BufOffset = 0;


this.onmessage = function(e)
{
    switch(e.data.command)
    {
        case 'init':
            init(e.data.config);
            break;
        case 'record':
            record(e.data.buffer);
            break;
        case 'clear':
            clear();
            break;
        case 'pause':
            IsPaused = e.data.Pause;
            break;
        case 'fft':
            SampleDecimation = e.data.Decimation;
            AudioMode = e.data.AudioMode;
            if ((FFT_FourierBase != e.data.FFT) || (FFT_WinFactor != e.data.Win))
            {
                FFT_FourierBase = e.data.FFT;
                FFT_WinFactor = e.data.Win;
                FFT_Init();
            }
            FFT_FFT_Mode = e.data.DispMode;
            SpectrumStep = e.data.Step;
            SpectrumGain = e.data.Gain;
            SpectrumBase = e.data.Base * 1024;
            SpectrumMinMax = e.data.MinMax;
            if (SpectrumMinMax >= 0)
            {
                SpectrumMinMaxX = SpectrumMinMax;
            }
            else
            {
                SpectrumMinMaxX = 0 - SpectrumMinMax;
            }
            BufDisp = e.data.DispSize;
            BufPerTick = e.data.BufTick;
            BufIgnited = true;
            break;
    }
};


function clear()
{
    BufPointer = 0;
    for (var I = 0; I < BufLength; I++)
    {
        BufData[I] = 0;
    }
}

var FFT_Fourier_levels = 0;
var M_PI = 3.14159265358979323846;

function FFT_transform_radix2_init(n)
{
    var i;

    // Compute levels = Math.floor(Math.log2(n))
    {
        var temp = n;
        FFT_Fourier_levels = 0;
        while (temp > 1)
        {
            FFT_Fourier_levels++;
            //temp >>= 1;
            temp = temp / 2;
        }
    }

    // Trignometric tables
    for (i = 0; i < n / 2; i++)
    {
        FFT_cos_table[i] = Math.cos(2 * M_PI * i / n);
        FFT_sin_table[i] = Math.sin(2 * M_PI * i / n);
    }
}



function FFT_transform_radix2(real, imag, n)
{
    var size;
    var i;
    var x;

    // Bit-reversed addressing permutation
    for (i = 0; i < n; i++)
    {
        var k;
        var j = 0;
        x = i;
        for (k = 0; k < FFT_Fourier_levels; k++, x >>= 1)
        {
            j = (j << 1) | (x & 1);
        }

        if (j > i)
        {
            var temp = real[i];
            real[i] = real[j];
            real[j] = temp;
            temp = imag[i];
            imag[i] = imag[j];
            imag[j] = temp;
        }
    }

    // Cooley-Tukey decimation-in-time radix-2 FFT
    for (size = 2; size <= n; size *= 2)
    {
        var halfsize = size / 2;
        var tablestep = n / size;
        for (i = 0; i < n; i += size)
        {
            var j;
            var k;
            for (j = i, k = 0; j < i + halfsize; j++, k += tablestep)
            {
                var tpre =  real[j+halfsize] * FFT_cos_table[k] + imag[j+halfsize] * FFT_sin_table[k];
                var tpim = -real[j+halfsize] * FFT_sin_table[k] + imag[j+halfsize] * FFT_cos_table[k];
                real[j + halfsize] = real[j] - tpre;
                imag[j + halfsize] = imag[j] - tpim;
                real[j] += tpre;
                imag[j] += tpim;
            }
        }
        if (size == n)  // Prevent overflow in 'size *= 2'
        {
            break;
        }
    }
}

var FFT_FFT_Mode = 0;

function FFT_FFT(raw, rawoffset, SampleValue)
{
    switch(FFT_FFT_Mode)
    {
        case 0: return FFT_FFT0(raw, rawoffset, SampleValue);
        case 1: return FFT_FFT1(raw, rawoffset, SampleValue);
        case 2: return FFT_FFT1(raw, rawoffset, SampleValue);
    }
}

function FFT_FFT1(raw, rawoffset, SampleValue)
{
    var SerieSize = SpectrumMinMaxX * SpectrumStep;
    if (SerieSize <= 0)
    {
        SerieSize = SpectrumStep;
    }
    SampleValue[0] = 0;
    SampleValue[1] = 0;
    rawoffset = rawoffset + FFT_FourierBase - 1;
    if (rawoffset >= BufLength)
    {
        rawoffset = rawoffset - BufLength;
    }
    var T = (FFT_FFT_Mode == 1) ? (raw[rawoffset] + 32768) : (Math.abs(raw[rawoffset]) * 2);
    var ValMin = (FFT_FFT_Mode == 1) ? T : 0;
    var ValMax = T;
    for (I = 0; I < SerieSize; I++)
    {
        T = raw[rawoffset];
        if (SampleValue[0] < T)
        {
            SampleValue[0] = T;
        }
        if (SampleValue[1] > T)
        {
            SampleValue[1] = T;
        }
        T = (FFT_FFT_Mode == 1) ? (T + 32768) : (Math.abs(T) * 2);
        if (ValMin > T) { ValMin = T; }
        if (ValMax < T) { ValMax = T; }
        rawoffset--;
        if (rawoffset < 0)
        {
            rawoffset = rawoffset + BufLength;
        }
    }

    var raw0 = new Float32Array(FFT_FourierBase);

    ValMin = (ValMin * FFT_FourierBase) / 131072.0;
    ValMax = (ValMax * FFT_FourierBase) / 131072.0;
    for (I = 0; I < FFT_FourierBase; I++)
    {
        if ((I >= ValMin) && (I <= ValMax))
        {
            T = 65536;
        }
        else
        {
            T = 8192;
        }

        T = T / 256;
        T = T * SpectrumGain
        T = T - SpectrumBase;
        if (T > 70000)
        {
            T = 70000;
        }
        else
        {
            if (T < 0)
            {
                T = 0;
            }
        }

        raw0[I] = T;
    }
    return raw0;
}

function FFT_FFT2(raw, rawoffset, SampleValue)
{
    var raw0 = new Float32Array(FFT_FourierBase);
    return raw0;
}

function FFT_FFT0(raw, rawoffset, SampleValue)
{
    var real = new Float32Array(FFT_FourierBase);
    var imag = new Float32Array(FFT_FourierBase);
    var raw0 = new Float32Array(FFT_FourierBase);

    var I;
    var T;
    SampleValue[0] = 0;
    SampleValue[1] = 0;
    for (I = 0; I < FFT_FourierBase; I++)
    {
        T = raw[I + rawoffset];
        if (SampleValue[0] < T)
        {
            SampleValue[0] = T;
        }
        if (SampleValue[1] > T)
        {
            SampleValue[1] = T;
        }
        real[I] = (T * FFT_FourierWindowVals[I]);
        imag[I] = 0;
    }
    FFT_transform_radix2(real, imag, FFT_FourierBase);
    for (I = 0; I < FFT_FourierBase; I++)
    {
        real[I] = real[I] / FFT_FourierBase;
        imag[I] = imag[I] / FFT_FourierBase;
        T = Math.sqrt((real[I] * real[I]) + (imag[I] * imag[I])) * SpectrumGain;
        T = T - SpectrumBase;
        if (T > 70000)
        {
            T = 70000;
        }
        else
        {
            if (T < 0)
            {
                T = 0;
            }
        }
        raw0[I] = T;
    }

    if (SpectrumMinMax != 0)
    {
        var rawX = new Float32Array(FFT_FourierBase);
        var S = (FFT_FourierBase >> 1) - 1;

        var I_, I0, II_, II0;
        if (SpectrumMinMax > 0)
        {
            I0 = S - SpectrumMinMaxX + 1;
            for (I_ = (SpectrumMinMaxX - 1); I_ >= 0; I_--)
            {
                rawX[I_] = 0;
                rawX[I0] = 0;
                II0 = S;
                for (II_ = (I_ + SpectrumMinMaxX); II_ >= 0; II_--)
                {
                    if (rawX[I_] < raw0[II_]) { rawX[I_] = raw0[II_]; }
                    if (rawX[I0] < raw0[II0]) { rawX[I0] = raw0[II0]; }
                    II0--;
                }
                I0++;
            }
            for (I_ = (S - SpectrumMinMaxX); I_ >= SpectrumMinMaxX; I_--)
            {
                rawX[I_] = 0;
                for (II_ = (I_ - SpectrumMinMaxX); II_ <= (I_ + SpectrumMinMaxX); II_++)
                {
                    if (rawX[I_] < raw0[II_]) { rawX[I_] = raw0[II_]; }
                }
            }
        }
        else
        {
            I0 = S - SpectrumMinMaxX + 1;
            for (I_ = (SpectrumMinMaxX - 1); I_ >= 0; I_--)
            {
                rawX[I_] = 70000;
                rawX[I0] = 70000;
                II0 = S;
                for (II_ = (I_ + SpectrumMinMaxX); II_ >= 0; II_--)
                {
                    if (rawX[I_] > raw0[II_]) { rawX[I_] = raw0[II_]; }
                    if (rawX[I0] > raw0[II0]) { rawX[I0] = raw0[II0]; }
                    II0--;
                }
                I0++;
            }
            for (I_ = (S - SpectrumMinMaxX); I_ >= SpectrumMinMaxX; I_--)
            {
                rawX[I_] = 70000;
                for (II_ = (I_ - SpectrumMinMaxX); II_ <= (I_ + SpectrumMinMaxX); II_++)
                {
                    if (rawX[I_] > raw0[II_]) { rawX[I_] = raw0[II_]; }
                }
            }
        }
        return rawX;
    }
    else
    {
        return raw0;
    }
}


function FFT_Init()
{
    FFT_transform_radix2_init(FFT_FourierBase);
    var FourierBaseX = FFT_FourierBase / 2;
    var WinT = Math.round((FourierBaseX * (1024.0 - FFT_WinFactor)) / 1024.0);
    var I;
    for (I = 0; I < FFT_FourierBase; I++)
    {
        FFT_FourierWindowVals[I] = 0;
    }
    if (FFT_FourierWindow == 0)
    {
        // Rectangle
        for (I = WinT; I < (FFT_FourierBase - WinT); I++)
        {
            FFT_FourierWindowVals[I] = 1;
        }
    }
    if (FFT_FourierWindow == 1)
    {
        // Triangle
        for (I = WinT; I < (FFT_FourierBase - WinT); I++)
        {
            var T1 = (I - WinT) * 2;
            var T2 = FFT_FourierBase - WinT - WinT;
            var T3 = (T1 - T2) / T2;
            if (T3 >= 0)
            {
                FFT_FourierWindowVals[I] = 1.0 - T3;
            }
            else
            {
                FFT_FourierWindowVals[I] = 1.0 + T3;
            }
        }
    }
    if (FFT_FourierWindow == 2)
    {
        // Hanning
        for (I = WinT; I < (FFT_FourierBase - WinT); I++)
        {
            var T1 = I - WinT;
            var T2 = FFT_FourierBase - WinT - WinT - 1;
            FFT_FourierWindowVals[I] = (0.5 - 0.5 * Math.cos(2 * M_PI * (T1 / T2)));
        }
    }
    if (FFT_FourierWindow == 3)
    {
        // Blackman
        for (I = WinT; I < (FFT_FourierBase - WinT); I++)
        {
            var T1 = I - WinT;
            var T2 = FFT_FourierBase - WinT - WinT - 1;
            FFT_FourierWindowVals[I] = ((0.42 - 0.5 * Math.cos(2 * M_PI * (T1 / T2))) + (0.08 * Math.cos(4 * M_PI * (T1 / T2))));
        }
    }
    if (FFT_FourierWindow == 4)
    {
        // Hamming
        for (I = WinT; I < (FFT_FourierBase - WinT); I++)
        {
            var T1 = I - WinT;
            var T2 = FFT_FourierBase - WinT - WinT - 1;
            FFT_FourierWindowVals[I] = (0.54 - 0.46 * Math.cos(2 * M_PI * (T1 / T2)));
        }
    }
}


function init(config)
{
    sampleRate = config.sampleRate;
    BufLength = config.bufLen;

    FFT_cos_table = new Float32Array(4000000);
    FFT_sin_table = new Float32Array(4000000);
    FFT_FourierWindowVals = new Float32Array(8000000);

    FFT_Init();

    BufData = new Float32Array(BufLength + BufLength);
    BufPointer = 0;
}

var SpecTemp = [];

function record(inputBuffer)
{
    var buffers = [];
    var FFTSize = FFT_FourierBase;
    buffers.push(FFTSize);
    buffers.push(0);
    buffers.push(0);

    var BufL = inputBuffer[0].length;
    var BufCount = 0;
    var FFTOffset;
    var SampleValue = [0, 0];




    if (BufIgnited)
    {
        BufCounter = 1;
        BufIgnited = false;
        BufPointer0 = BufPointer;
        BufOffset = 0;
        BufDisp0 = BufDisp;
    }

    if (BufCounter > 0)
    {
        FFTOffset = BufPointer0 - FFTSize - (BufCounter * SpectrumStep);
        FFTOffset = FFTOffset + (SpectrumStep - SpectrumStepCounter);
        if (FFTOffset < 0)
        {
            FFTOffset = FFTOffset + BufLength;
        }
        else
        {
            if (FFTOffset >= BufLength)
            {
                FFTOffset = FFTOffset - BufLength;
            }
        }

        for (var ii = 0; ii < BufPerTick; ii++)
        {
            BufCount++;
            buffers.push(FFT_FFT(BufData, FFTOffset, SampleValue));
            buffers.push(Math.max(SampleValue[0], 0 - SampleValue[1]));
            buffers.push(BufCounter + BufOffset);
            BufCounter++;
            FFTOffset -= SpectrumStep;
            if (FFTOffset < 0)
            {
                FFTOffset = FFTOffset + BufLength;
            }
        }
        if (BufCounter >= BufDisp0)
        {
            BufCounter = 0;
        }
    }

    var BufCountX = BufCount;

    if (!IsPaused)
    {
        switch (AudioMode)
        {
            case 0:
                {
                    for (var i = 0; i < BufL; i++)
                    {
                        SampleDecimationBuf += ((inputBuffer[0][i] + inputBuffer[1][i]) / 2.0);
                        SampleDecimationCounter++;
                        if (SampleDecimationCounter >= SampleDecimation)
                        {
                            SampleDecimationCounter = 0;
                            BufData[BufPointer] = SampleDecimationBuf / SampleDecimation;
                            SampleDecimationBuf = 0;
                            BufData[BufPointer] = BufData[BufPointer] * 32768.0;
                            BufData[BufPointer + BufLength] = BufData[BufPointer];
                            BufPointer++;
                            if (BufPointer >= BufLength)
                            {
                                BufPointer = 0;
                            }
                            SpectrumStepCounter++;
                            if (SpectrumStepCounter >= SpectrumStep)
                            {
                                SpectrumStepCounter = 0;
                                BufCount = BufCount + 1;
                                FFTOffset = BufPointer - FFTSize;
                                if (FFTOffset < 0)
                                {
                                    FFTOffset = FFTOffset + BufLength;
                                }
                                buffers.push(FFT_FFT(BufData, FFTOffset, SampleValue));
                                buffers.push(Math.max(SampleValue[0], 0 - SampleValue[1]));
                                buffers.push(0);
                            }
                        }
                    }
                }
                break;
            case 1:
                {
                    for (var i = 0; i < BufL; i++)
                    {
                        SampleDecimationBuf += inputBuffer[0][i];
                        SampleDecimationCounter++;
                        if (SampleDecimationCounter >= SampleDecimation)
                        {
                            SampleDecimationCounter = 0;
                            BufData[BufPointer] = SampleDecimationBuf / SampleDecimation;
                            SampleDecimationBuf = 0;
                            BufData[BufPointer] = BufData[BufPointer] * 32768.0;
                            BufData[BufPointer + BufLength] = BufData[BufPointer];
                            BufPointer++;
                            if (BufPointer >= BufLength)
                            {
                                BufPointer = 0;
                            }
                            SpectrumStepCounter++;
                            if (SpectrumStepCounter >= SpectrumStep)
                            {
                                SpectrumStepCounter = 0;
                                BufCount = BufCount + 1;
                                FFTOffset = BufPointer - FFTSize;
                                if (FFTOffset < 0)
                                {
                                    FFTOffset = FFTOffset + BufLength;
                                }
                                buffers.push(FFT_FFT(BufData, FFTOffset, SampleValue));
                                buffers.push(Math.max(SampleValue[0], 0 - SampleValue[1]));
                                buffers.push(0);
                            }
                        }
                    }
                }
                break;
            case 2:
                {
                    for (var i = 0; i < BufL; i++)
                    {
                        SampleDecimationBuf += inputBuffer[1][i];
                        SampleDecimationCounter++;
                        if (SampleDecimationCounter >= SampleDecimation)
                        {
                            SampleDecimationCounter = 0;
                            BufData[BufPointer] = SampleDecimationBuf / SampleDecimation;
                            SampleDecimationBuf = 0;
                            BufData[BufPointer] = BufData[BufPointer] * 32768.0;
                            BufData[BufPointer + BufLength] = BufData[BufPointer];
                            BufPointer++;
                            if (BufPointer >= BufLength)
                            {
                                BufPointer = 0;
                            }
                            SpectrumStepCounter++;
                            if (SpectrumStepCounter >= SpectrumStep)
                            {
                                SpectrumStepCounter = 0;
                                BufCount = BufCount + 1;
                                FFTOffset = BufPointer - FFTSize;
                                if (FFTOffset < 0)
                                {
                                    FFTOffset = FFTOffset + BufLength;
                                }
                                buffers.push(FFT_FFT(BufData, FFTOffset, SampleValue));
                                buffers.push(Math.max(SampleValue[0], 0 - SampleValue[1]));
                                buffers.push(0);
                            }
                        }
                    }
                }
                break;
            case 3:
                {
                    for (var i = 0; i < BufL; i++)
                    {
                        SampleDecimationBuf += ((inputBuffer[0][i] - inputBuffer[1][i]) / 2.0);
                        SampleDecimationCounter++;
                        if (SampleDecimationCounter >= SampleDecimation)
                        {
                            SampleDecimationCounter = 0;
                            BufData[BufPointer] = SampleDecimationBuf / SampleDecimation;
                            SampleDecimationBuf = 0;
                            BufData[BufPointer] = BufData[BufPointer] * 32768.0;
                            BufData[BufPointer + BufLength] = BufData[BufPointer];
                            BufPointer++;
                            if (BufPointer >= BufLength)
                            {
                                BufPointer = 0;
                            }
                            SpectrumStepCounter++;
                            if (SpectrumStepCounter >= SpectrumStep)
                            {
                                SpectrumStepCounter = 0;
                                BufCount = BufCount + 1;
                                FFTOffset = BufPointer - FFTSize;
                                if (FFTOffset < 0)
                                {
                                    FFTOffset = FFTOffset + BufLength;
                                }
                                buffers.push(FFT_FFT(BufData, FFTOffset, SampleValue));
                                buffers.push(Math.max(SampleValue[0], 0 - SampleValue[1]));
                                buffers.push(0);
                            }
                        }
                    }
                }
                break;
        }
    }

    if (BufCount > 0)
    {
        BufOffset += (BufCount - BufCountX);
        BufDisp0 -= (BufCount - BufCountX);
        buffers[1] = BufCount;
        buffers[2] = performance.now();
        this.postMessage(buffers);
    }
}
