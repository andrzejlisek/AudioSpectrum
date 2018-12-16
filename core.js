var CanvasObject;
var CanvasContext;
var CanvasData;
var CanvasDataR;
var CanvasDataG;
var CanvasDataB;
var CanvasX = 0;
var CanvasY = 0;
var CanvasW = 1;
var CanvasH = 1;
var CanvasWX = 1;
var CanvasLine = 1;
var CanvasLineNum = 0;
var CurrentSamplerate = 0;
var CallbackLag = 0;
var CanvasRawW = 1;
var CanvasRawH = 1;

var Working = true;

var SET_ImageDataMode = 0;
if (DataExists("SET_ImageDataMode")) { SET_ImageDataMode = parseInt(DataGet("SET_ImageDataMode")); }

var SET_AudioBufferLength = 12;
if (DataExists("SET_AudioBufferLength")) { SET_AudioBufferLength = parseInt(DataGet("SET_AudioBufferLength")); }

var SET_BufLength = 10000000;
if (DataExists("SET_BufLength")) { SET_BufLength = parseInt(DataGet("SET_BufLength")); }

var SET_BufTick = 50;
if (DataExists("SET_BufTick")) { SET_BufTick = parseInt(DataGet("SET_BufTick")); }

var SET_BufTickMargin = 100;
if (DataExists("SET_BufTickMargin")) { SET_BufTickMargin = parseInt(DataGet("SET_BufTickMargin")); }

var SET_DispModeLines = 2;
if (DataExists("SET_DispModeLines")) { SET_DispModeLines = parseInt(DataGet("SET_DispModeLines")); }

var SET_DispModeWaveform = 3;
if (DataExists("SET_DispModeWaveform")) { SET_DispModeWaveform = parseInt(DataGet("SET_DispModeWaveform")); }

var SET_WaveformBack = 32;
if (DataExists("SET_WaveformBack")) { SET_WaveformBack = parseInt(DataGet("SET_WaveformBack")); }

var SET_WaveformFore = 256;
if (DataExists("SET_WaveformFore")) { SET_WaveformFore = parseInt(DataGet("SET_WaveformFore")); }

var SET_AudioEchoCancellation = false;
if (DataExists("SET_AudioEchoCancellation")) { SET_AudioEchoCancellation = (parseInt(DataGet("SET_AudioEchoCancellation")) == 1); }

var SET_AudioNoiseSuppression = false;
if (DataExists("SET_AudioNoiseSuppression")) { SET_AudioNoiseSuppression = (parseInt(DataGet("SET_AudioNoiseSuppression")) == 1); }

var SET_AudioAutoGainControl_ = false;
if (DataExists("SET_AudioAutoGainControl_")) { SET_AudioAutoGainControl_ = (parseInt(DataGet("SET_AudioAutoGainControl_")) == 1); }


(function(window)
{

    var Recorder = function(source, cfg)
    {
        var bufferLen = 1 << SET_AudioBufferLength;
        this.context = source.context;
        if(!this.context.createScriptProcessor)
        {
            this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
        }
        else
        {
            this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
        }

        var worker = new Worker(URL.createObjectURL(new Blob(["("+AudioWorker.toString()+")()"], {type: 'text/javascript'})));
        // var worker = new Worker("worker.js");

        worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate,
                bufLen: SET_BufLength
            }
        });
        var recording = false;
        var currCallback;

        this.node.onaudioprocess = function(e)
        {
            if (!recording) return;
            worker.postMessage({
                command: 'record',
                buffer: [
                    e.inputBuffer.getChannelData(0),
                    e.inputBuffer.getChannelData(1)
                ]
            });
        }

        this.configure = function(cfg)
        {
            for (var prop in cfg)
            {
                if (cfg.hasOwnProperty(prop))
                {
                    config[prop] = cfg[prop];
                }
            }
        }

        this.record = function()
        {
            recording = true;
        }

        this.stop = function()
        {
            recording = false;
        }

        this.pause = function(Pause_)
        {
            worker.postMessage({ command: 'pause', Pause: Pause_ });
        }

        this.clear = function()
        {
            worker.postMessage({ command: 'clear' });
        }

        this.SetCallback = function(cb)
        {
            currCallback = cb;
        }

        this.Msg = function(X)
        {
            worker.postMessage(X);
        }

        this.setstep = function(Step_)
        {
            worker.postMessage({ command: 'step', Step: Step_ });
        }

        worker.onmessage = function(e)
        {
            var blob = e.data;
            try
            {
                currCallback(blob);
            }
            catch (err)
            {
            }
        }

        source.connect(this.node);
        this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
    };

    Recorder.setupDownload = function(blob, filename)
    {
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = document.getElementById("save");
        link.href = url;
        link.download = filename || 'output.wav';
    }

    window.Recorder = Recorder;

})(window);



window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var audioInput = null;
var inputPoint = null;
var audioRecorder = null;
var rafID = null;
var canvasWidth, canvasHeight;
var recIndex = 0;


var DrawPointer = 0;

var DrawPalette = [];
var DrawPaletteR = [];
var DrawPaletteG = [];
var DrawPaletteB = [];


var SET_CanvasScaleH = 1;
var SET_CanvasScaleV = 1;
var SET_MinimumStep = 6;
var SET_DrawGamma = 2200;
var SET_ToolbarSize = 50;
var SET_ToolbarPosition = 0;
// 0 - None
// 1,5 - Top
// 2,6 - Bottom
// 3,7 - Right
// 4,8 - Left
var SET_DrawStripSize = 8;
var SET_DrawStripColorR = 255;
var SET_DrawStripColorG = 255;
var SET_DrawStripColorB = 255;

var SET_DrawOverdriveThreshold = 30000;
var SET_DrawOverdriveColorA = 128;
var SET_DrawOverdriveColorX = 127;
var SET_DrawOverdriveColorR = 255;
var SET_DrawOverdriveColorG = 255;
var SET_DrawOverdriveColorB = 255;

var SET_SampleDecimation = 4;

var SET_ButtonFontSize = 8;

var CanvasDrawStep = 1;
var CanvasDrawStepX = 0;

var SET_DrawOrientation = 0;

var SET_AudioMode = 0;
// Mix
// Left
// Right
// Difference





function InitPalette()
{
    DrawPalette = [];
    DrawPaletteR = [];
    DrawPaletteG = [];
    DrawPaletteB = [];
    var I;
    var Gamma = SET_DrawGamma / 1000.0;
    Gamma = 1.0 / Gamma;
    for (I = 0; I <= 70000; I++)
    {
        var R = I / 65536.0;
        var G = I / 65536.0;
        var B = I / 65536.0;
        R = Math.pow(R, Gamma);
        G = Math.pow(G, Gamma);
        B = Math.pow(B, Gamma);
        R = R * 255.0;
        G = G * 255.0;
        B = B * 255.0;
        if (R < 0) { R = 0; }
        if (G < 0) { G = 0; }
        if (B < 0) { B = 0; }
        if (R > 255) { R = 255; }
        if (G > 255) { G = 255; }
        if (B > 255) { B = 255; }
        DrawPalette.push(RGB(R, G, B));
        DrawPaletteR.push(Math.round(R));
        DrawPaletteG.push(Math.round(G));
        DrawPaletteB.push(Math.round(B));
    }
}




function RGB(R, G, B)
{
    if (R < 0) { R = 0; }
    if (G < 0) { G = 0; }
    if (B < 0) { B = 0; }
    if (R > 255) { R = 255; }
    if (G > 255) { G = 255; }
    if (B > 255) { B = 255; }
    return "rgb(" + Math.round(R) + ", " + Math.round(G) + ", " + Math.round(B) + ")";
}


var DrawRect = function(X, Y, W, H)
{
}

function DrawRect0(X, Y, W, H)
{
    CanvasContext.fillRect(CanvasX + X, CanvasY + Y, W, H);
}

function DrawRect1(X, Y, W, H)
{
    CanvasContext.fillRect(CanvasH - H - CanvasY - Y, CanvasX + X, H, W);
}

function DrawRect2(X, Y, W, H)
{
    CanvasContext.fillRect(CanvasW - W - CanvasX - X, CanvasH - H - CanvasY - Y, W, H);
}

function DrawRect3(X, Y, W, H)
{
    CanvasContext.fillRect(CanvasY + Y, CanvasW - W - CanvasX - X, H, W);
}

function DrawRect0_(X, Y, W, H)
{
    var CR = CanvasDataR;
    var CG = CanvasDataG;
    var CB = CanvasDataB;
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasRawW) { W = CanvasRawW - X; }
    if (Y + H > CanvasRawH) { H = CanvasRawH - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        for (var XX = 0; XX < W; XX++)
        {
            var Offset = ((CanvasY + Y + YY) * CanvasRawW + (CanvasX + X + XX)) * 4;
            CanvasData.data[Offset + 0] = CR;
            CanvasData.data[Offset + 1] = CG;
            CanvasData.data[Offset + 2] = CB;
            CanvasData.data[Offset + 3] = 255;
        }
    }
}

function DrawRect1_(X, Y, W, H)
{
    var CR = CanvasDataR;
    var CG = CanvasDataG;
    var CB = CanvasDataB;
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasRawH) { W = CanvasRawH - X; }
    if (Y + H > CanvasRawW) { H = CanvasRawW - Y; }
    for (var YY = 0; YY < W; YY++)
    {
        for (var XX = 0; XX < H; XX++)
        {
            var Offset = ((CanvasX + X + YY) * CanvasRawW + (CanvasH - H - CanvasY - Y + XX)) * 4;
            CanvasData.data[Offset + 0] = CR;
            CanvasData.data[Offset + 1] = CG;
            CanvasData.data[Offset + 2] = CB;
            CanvasData.data[Offset + 3] = 255;
        }
    }
}

function DrawRect2_(X, Y, W, H)
{
    var CR = CanvasDataR;
    var CG = CanvasDataG;
    var CB = CanvasDataB;
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasRawW) { W = CanvasRawW - X; }
    if (Y + H > CanvasRawH) { H = CanvasRawH - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        for (var XX = 0; XX < W; XX++)
        {
            var Offset = ((CanvasH - H - CanvasY - Y + YY) * CanvasRawW + (CanvasW - W - CanvasX - X + XX)) * 4;
            CanvasData.data[Offset + 0] = CR;
            CanvasData.data[Offset + 1] = CG;
            CanvasData.data[Offset + 2] = CB;
            CanvasData.data[Offset + 3] = 255;
        }
    }
}

function DrawRect3_(X, Y, W, H)
{
    var CR = CanvasDataR;
    var CG = CanvasDataG;
    var CB = CanvasDataB;
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasRawH) { W = CanvasRawH - X; }
    if (Y + H > CanvasRawW) { H = CanvasRawW - Y; }
    for (var YY = 0; YY < W; YY++)
    {
        for (var XX = 0; XX < H; XX++)
        {
            var Offset = ((CanvasW - W - CanvasX - X + YY) * CanvasRawW + (CanvasY + Y + XX)) * 4;
            CanvasData.data[Offset + 0] = CR;
            CanvasData.data[Offset + 1] = CG;
            CanvasData.data[Offset + 2] = CB;
            CanvasData.data[Offset + 3] = 255;
        }
    }
}


var DrawRectX = function(X, Y, W)
{
}

function DrawRectX0(X, Y, W)
{
    CanvasContext.fillRect(CanvasX + X, CanvasY + Y, W, 1);
}

function DrawRectX1(X, Y, W)
{
    CanvasContext.fillRect(CanvasH - 1 - CanvasY - Y, CanvasX + X, 1, W);
}

function DrawRectX2(X, Y, W)
{
    CanvasContext.fillRect(CanvasW - W - CanvasX - X, CanvasH - 1 - CanvasY - Y, W, 1);
}

function DrawRectX3(X, Y, W)
{
    CanvasContext.fillRect(CanvasY + Y, CanvasW - W - CanvasX - X, 1, W);
}

function DrawRectX0_(X, Y, W)
{
    var CR = CanvasDataR;
    var CG = CanvasDataG;
    var CB = CanvasDataB;
    if (Y < 0) { return; }
    if (Y + 1 > CanvasRawH) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasRawW) { W = CanvasRawW - X; }
    for (var XX = 0; XX < W; XX++)
    {
        var Offset = ((CanvasY + Y) * CanvasRawW + (CanvasX + X + XX)) * 4;
        CanvasData.data[Offset + 0] = CR;
        CanvasData.data[Offset + 1] = CG;
        CanvasData.data[Offset + 2] = CB;
        CanvasData.data[Offset + 3] = 255;
    }
}

function DrawRectX1_(X, Y, W)
{
    var CR = CanvasDataR;
    var CG = CanvasDataG;
    var CB = CanvasDataB;
    if (Y < 0) { return; }
    if (Y + 1 > CanvasRawW) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasRawH) { W = CanvasRawH - X; }
    for (var YY = 0; YY < W; YY++)
    {
        var Offset = ((CanvasX + X + YY) * CanvasRawW + (CanvasH - 1 - CanvasY - Y)) * 4;
        CanvasData.data[Offset + 0] = CR;
        CanvasData.data[Offset + 1] = CG;
        CanvasData.data[Offset + 2] = CB;
        CanvasData.data[Offset + 3] = 255;
    }
}

function DrawRectX2_(X, Y, W)
{
    var CR = CanvasDataR;
    var CG = CanvasDataG;
    var CB = CanvasDataB;
    if (Y < 0) { return; }
    if (Y + 1 > CanvasRawH) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasRawW) { W = CanvasRawW - X; }
    for (var XX = 0; XX < W; XX++)
    {
        var Offset = ((CanvasH - 1 - CanvasY - Y) * CanvasRawW + (CanvasW - W - CanvasX - X + XX)) * 4;
        CanvasData.data[Offset + 0] = CR;
        CanvasData.data[Offset + 1] = CG;
        CanvasData.data[Offset + 2] = CB;
        CanvasData.data[Offset + 3] = 255;
    }
}

function DrawRectX3_(X, Y, W)
{
    var CR = CanvasDataR;
    var CG = CanvasDataG;
    var CB = CanvasDataB;
    if (Y < 0) { return; }
    if (Y + 1 > CanvasRawW) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasRawH) { W = CanvasRawH - X; }
    for (var YY = 0; YY < W; YY++)
    {
        var Offset = ((CanvasW - W - CanvasX - X + YY) * CanvasRawW + (CanvasY + Y)) * 4;
        CanvasData.data[Offset + 0] = CR;
        CanvasData.data[Offset + 1] = CG;
        CanvasData.data[Offset + 2] = CB;
        CanvasData.data[Offset + 3] = 255;
    }
}

function AudioCallbackDummy()
{
    var buffers = [];
    buffers.push(0);
    buffers.push(0);
    buffers.push(0);
    AudioCallback(buffers);
}

function AudioCallback(raw)
{
    /*if (performance.now() - raw[2] > SET_MaxCallbackLag)
    {
        return;
    }*/

    if ((CanvasWX <= 0) || (CanvasH <= 0))
    {
        return;
    }
    var datacount = raw[1];
    var CanvasLineY = CanvasLine * CanvasLineNum * (DISP_Mode + 1);
    var DrawPointerX = 0;

    var CanvasHalf = Math.floor(CanvasWX / 2);
    var CanvasHalfY = 0;

    var Zoom_ = Math.pow(2, DISP_Zoom + 9)
    var Overdrive;
    var Position = 0;
    var DrawPointer0;
    var CanvasLineY0;
    var DISP_ModeX = DISP_Mode + 1;

    var data;
    var Len;
    var LenO;
    var Zoom1;
    var Zoom2;
    var I_;
    var IsOverdrive;
    var datum;

    for (var ii = 0; ii < datacount; ii++)
    {
        Overdrive = raw[4 + ii * 3];
        Position = raw[5 + ii * 3];
        DrawPointer0 = DrawPointer - Position;

        CanvasLineY0 = CanvasLineY;
        if (Position > 0)
        {
            while (DrawPointer0 < 0)
            {
                DrawPointer0 += CanvasWX + 1;
                CanvasLineY0 -= CanvasLine * DISP_ModeX;
                if (CanvasLineY0 < 0)
                {
                    CanvasLineY0 += CanvasLine * DISP_Line * DISP_ModeX;
                }
            }
        }

        if (DISP_Mode == 1)
        {
            DrawPointerX = DrawPointer0 - CanvasHalf;
            CanvasHalfY = CanvasLine;
            if (DrawPointerX < 0)
            {
                DrawPointerX = DrawPointerX + CanvasWX;
                if (((CanvasLineY0 + CanvasHalfY) >= 0) && (CanvasLineY0 > 0))
                {
                    CanvasHalfY = 0 - CanvasLine;
                }
                else
                {
                    CanvasHalfY = ((DISP_Line * 2) - 1) * CanvasLine;
                }
            }
        }

        data = raw[3 + ii * 3];
        Len = Math.floor(data.length / 2);
        LenO = DISP_Offs * (Len / 64);
        Zoom1 = Math.floor(Zoom_ / Len);
        Zoom2 = Math.floor(Len / Zoom_);
        IsOverdrive = (Overdrive > SET_DrawOverdriveThreshold);
        if (Zoom1 < 1)
        {
            Zoom1 = 1;
        }
        if (Zoom2 < 1)
        {
            Zoom2 = 1;
        }
        for(var i = 0; i < CanvasLine; i++)
        {
            I_ = Math.floor(((i * Zoom2) / Zoom1) + LenO);
            datum = 0;
            if ((I_ >= 0) && (I_ < Len))
            {
                datum = Math.floor(data[I_]);
            }
            else
            {
                IsOverdrive = false;
            }
            if (SET_ImageDataMode == 1)
            {
                if (IsOverdrive)
                {
                    CanvasContext.fillStyle = RGB(((SET_DrawOverdriveColorR * SET_DrawOverdriveColorA) + (DrawPaletteR[datum] * SET_DrawOverdriveColorX)) / 255, ((SET_DrawOverdriveColorG * SET_DrawOverdriveColorA) + (DrawPaletteG[datum] * SET_DrawOverdriveColorX)) / 255, ((SET_DrawOverdriveColorB * SET_DrawOverdriveColorA) + (DrawPaletteB[datum] * SET_DrawOverdriveColorX)) / 255);
                }
                else
                {
                    CanvasContext.fillStyle = DrawPalette[datum];
                }
            }
            else
            {
                if (IsOverdrive)
                {
                    CanvasDataR = ((SET_DrawOverdriveColorR * SET_DrawOverdriveColorA) + (DrawPaletteR[datum] * SET_DrawOverdriveColorX)) / 255;
                    CanvasDataG = ((SET_DrawOverdriveColorG * SET_DrawOverdriveColorA) + (DrawPaletteG[datum] * SET_DrawOverdriveColorX)) / 255;
                    CanvasDataB = ((SET_DrawOverdriveColorB * SET_DrawOverdriveColorA) + (DrawPaletteB[datum] * SET_DrawOverdriveColorX)) / 255;
                }
                else
                {
                    CanvasDataR = DrawPaletteR[datum];
                    CanvasDataG = DrawPaletteG[datum];
                    CanvasDataB = DrawPaletteB[datum];
                }
            }
            DrawRectX(DrawPointer0 << CanvasDrawStepX, CanvasLineY0 + CanvasLine - i - 1, CanvasDrawStep);
            if (DISP_Mode == 1)
            {
                DrawRectX(DrawPointerX << CanvasDrawStepX, CanvasLineY0 + CanvasLine + CanvasHalfY - i - 1, CanvasDrawStep);
            }
        }

        if (Position == 0)
        {
            DrawPointer++;
            if (DrawPointer > (CanvasWX))
            {
                DrawPointer = 0;
                CanvasLineNum++;
                if (CanvasLineNum >= DISP_Line)
                {
                    CanvasLineNum = 0;
                }
                CanvasLineY = CanvasLine * CanvasLineNum * (DISP_Mode + 1);
            }


            if (DISP_Mode == 1)
            {
                DrawPointerX = DrawPointer - CanvasHalf;
                CanvasHalfY = CanvasLine;
                if (DrawPointerX < 0)
                {
                    DrawPointerX = DrawPointerX + CanvasWX;
                    if (CanvasLineNum > 0)
                    {
                        CanvasHalfY = 0 - CanvasLine;
                    }
                    else
                    {
                        CanvasHalfY = ((DISP_Line * 2) - 1) * CanvasLine;
                    }
                }
            }
        }
    }
    if (datacount == 0)
    {
        if (DISP_Mode == 1)
        {
            DrawPointerX = DrawPointer - CanvasHalf;
            CanvasHalfY = CanvasLine;
            if (DrawPointerX < 0)
            {
                DrawPointerX = DrawPointerX + CanvasWX;
                if (CanvasLineNum > 0)
                {
                    CanvasHalfY = 0 - CanvasLine;
                }
                else
                {
                    CanvasHalfY = ((DISP_Line * 2) - 1) * CanvasLine;
                }
            }
        }
    }

    if ((SET_DrawStripSize > 0) && (Position == 0))
    {
        var CanvasLineY0 = CanvasLineY;
        var CanvasLineH0 = CanvasLine;
        if (SET_ImageDataMode == 1)
        {
            CanvasContext.fillStyle = DrawPalette[0];
        }
        else
        {
            CanvasDataR = DrawPaletteR[0];
            CanvasDataG = DrawPaletteG[0];
            CanvasDataB = DrawPaletteB[0];
        }
        DrawRect(DrawPointer << CanvasDrawStepX, CanvasLineY0, SET_DrawStripSize, CanvasLineH0);
        if (DISP_Mode == 1)
        {
            DrawRect(DrawPointerX << CanvasDrawStepX, CanvasLineY0 + CanvasHalfY, SET_DrawStripSize, CanvasLineH0);
        }
        var OffsetX = Zoom_ - (Zoom_ * DISP_Offs / 64);
        if (CanvasLine > OffsetX)
        {
            CanvasLineH0 = (Zoom_ > OffsetX) ? OffsetX : Zoom_;
            CanvasLineY0 = CanvasLineY + CanvasLine - OffsetX;
        }
        else
        {
            if (DISP_Offs < 0)
            {
                CanvasLineH0 = CanvasLine - (OffsetX - Zoom_);
            }
        }
        if (SET_ImageDataMode == 1)
        {
            CanvasContext.fillStyle = RGB(SET_DrawStripColorR, SET_DrawStripColorG, SET_DrawStripColorB);
        }
        else
        {
            CanvasDataR = SET_DrawStripColorR;
            CanvasDataG = SET_DrawStripColorG;
            CanvasDataB = SET_DrawStripColorB;
        }
        DrawRect(DrawPointer << CanvasDrawStepX, CanvasLineY0, SET_DrawStripSize, CanvasLineH0);
        if (DISP_Mode == 1)
        {
            DrawRect(DrawPointerX << CanvasDrawStepX, CanvasLineY0 + CanvasHalfY, SET_DrawStripSize, CanvasLineH0);
        }
    }

    if (SET_ImageDataMode == 0)
    {
        CanvasContext.putImageData(CanvasData, 0, 0);
    }
}

var IsRecording = false;
var IsPaused = false;

function Pause()
{
    if (IsRecording)
    {
        if (IsPaused)
        {
            IsPaused = false;
        }
        else
        {
            IsPaused = true;
        }
        audioRecorder.pause(IsPaused);
    }
    else
    {
        ToggleRecording();
    }
}

function ToggleRecording()
{
    if (IsRecording)
    {
        IsRecording = false;
        audioRecorder.stop();
        audioInput.disconnect(inputPoint);
        Stream_.getTracks().forEach(track => track.stop());
    }
    else
    {
        if (!audioContext)
        {
            audioContext = new AudioContext();
        }
        IsPaused = false;
        AudioStarted = false;
        if (!navigator.getUserMedia)
        {
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        }
        if (!navigator.cancelAnimationFrame)
        {
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        }
        if (!navigator.requestAnimationFrame)
        {
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
        }

        navigator.mediaDevices.getUserMedia(
        {
            "audio": {
                "echoCancellation": SET_AudioEchoCancellation,
                "noiseSuppression": SET_AudioNoiseSuppression,
                "autoGainControl": SET_AudioAutoGainControl_
            },
            "video": false
        }).then(gotStream).catch(function(e) {
            alert("Error getting audio");
            console.log(e);
        });
    }
}

var Stream_;

function gotStream(stream)
{
    Stream_ = stream;

    inputPoint = audioContext.createGain();
    // Create an AudioNode from the stream.
    audioInput = audioContext.createMediaStreamSource(stream);
    audioInput.connect(inputPoint);

    audioRecorder = new Recorder(inputPoint);
    audioRecorder.SetCallback(AudioCallback);
    CurrentSamplerate = audioContext.sampleRate;
    InitPalette();
    SetFFT();

    IsRecording = true;
    Working = true;
    audioRecorder.clear();
    audioRecorder.record();
}



function ToggleFullScreen()
{
    var VideoElement = document.getElementById("app");
    if (!document.mozFullScreen && !document.webkitIsFullScreen && !document.fullscreen)
    {
        if (VideoElement.mozRequestFullScreen)
        {
            VideoElement.mozRequestFullScreen();
        }
        else
        {
            if (VideoElement.webkitRequestFullScreen)
            {
                VideoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            else
            {
                if (VideoElement.requestFullscreen)
                {
                    VideoElement.requestFullscreen();
                }
            }
        }
    }
    else
    {
        if (document.mozCancelFullScreen)
        {
            document.mozCancelFullScreen();
        }
        else
        {
            if (document.webkitCancelFullScreen)
            {
                document.webkitCancelFullScreen();
            }
            else
            {
                if (document.exitFullscreen)
                {
                    document.exitFullscreen();
                }
            }
        }
    }
}

function KeyPress(e)
{
    switch(e.keyCode)
    {
        case 81: // Q
            BtnAction(11);
            break;
        case 65: // A
            BtnAction(10);
            break;
        case 87: // W
            BtnAction(13);
            break;
        case 83: // S
            BtnAction(12);
            break;
        case 69: // E
            BtnAction(15);
            break;
        case 68: // D
            BtnAction(14);
            break;
        case 82: // R
            BtnAction(17);
            break;
        case 70: // F
            BtnAction(16);
            break;
        case 84: // T
            BtnAction(19);
            break;
        case 71: // G
            BtnAction(18);
            break;
        case 89: // Y
            BtnAction(21);
            break;
        case 72: // H
            BtnAction(20);
            break;
        case 85: // U
            BtnAction(23);
            break;
        case 74: // J
            BtnAction(22);
            break;
        case 73: // I
            BtnAction(25);
            break;
        case 75: // K
            BtnAction(24);
            break;
        case 79: // O
            BtnAction(27);
            break;
        case 76: // L
            BtnAction(26);
            break;
        case 88: // X
            BtnAction(29);
            break;
        case 90: // Z
            BtnAction(28);
            break;
        case 13: // Enter
            ToggleFullScreen();
            break;
    }
}



function SetLayout()
{
    switch (SET_DrawOrientation)
    {
        case 0:
            DrawRect = (SET_ImageDataMode == 1) ? DrawRect0 : DrawRect0_;
            DrawRectX = (SET_ImageDataMode == 1) ? DrawRectX0 : DrawRectX0_;
            break;
        case 1:
            DrawRect = (SET_ImageDataMode == 1) ? DrawRect1 : DrawRect1_;
            DrawRectX = (SET_ImageDataMode == 1) ? DrawRectX1 : DrawRectX1_;
            break;
        case 2:
            DrawRect = (SET_ImageDataMode == 1) ? DrawRect2 : DrawRect2_;
            DrawRectX = (SET_ImageDataMode == 1) ? DrawRectX2 : DrawRectX2_;
            break;
        case 3:
            DrawRect = (SET_ImageDataMode == 1) ? DrawRect3 : DrawRect3_;
            DrawRectX = (SET_ImageDataMode == 1) ? DrawRectX3 : DrawRectX3_;
            break;
    }

    var Tools = document.getElementsByClassName('tool');
    for(var i=0; i<Tools.length; i++)
    {
        Tools[i].style["font-size"] = SET_ButtonFontSize + "pt";
    }

    CanvasObject = document.getElementById("wavedisplay");
    CanvasContext = CanvasObject.getContext('2d');

    CanvasRawW = Math.floor(window.innerWidth / SET_CanvasScaleH);
    CanvasRawH = Math.floor(window.innerHeight / SET_CanvasScaleV);
    CanvasObject.width = CanvasRawW;
    CanvasObject.height = CanvasRawH;

    CanvasObject.style["width"] = Math.floor(CanvasRawW * SET_CanvasScaleH) + "px";
    CanvasObject.style["height"] = Math.floor(CanvasRawH * SET_CanvasScaleV) + "px";
    CanvasData = CanvasContext.createImageData(CanvasRawW, CanvasRawH);

    var ToolbarH1 = document.getElementById("ToolbarH1");
    var ToolbarV1 = document.getElementById("ToolbarV1");
    var ToolbarH2 = document.getElementById("ToolbarH2");
    var ToolbarV2 = document.getElementById("ToolbarV2");
    var ToolbarH;
    var ToolbarV;

    var SET_ToolbarPositionX = 0;
    var ToolbarSize = 1;
    if ((SET_ToolbarPosition >= 1) && (SET_ToolbarPosition <= 4))
    {
        SET_ToolbarPositionX = SET_ToolbarPosition;
        ToolbarH2.style["display"] = "none";
        ToolbarV2.style["display"] = "none";
        ToolbarH = ToolbarH1;
        ToolbarV = ToolbarV1;
        ToolbarSize = SET_ToolbarSize * 2;
    }
    if ((SET_ToolbarPosition >= 5) && (SET_ToolbarPosition <= 8))
    {
        SET_ToolbarPositionX = SET_ToolbarPosition - 4;
        ToolbarH1.style["display"] = "none";
        ToolbarV1.style["display"] = "none";
        ToolbarH = ToolbarH2;
        ToolbarV = ToolbarV2;
        ToolbarSize = SET_ToolbarSize * 4;
    }

    switch (SET_ToolbarPositionX)
    {
        case 1: // Top
            ToolbarSize = Math.ceil(ToolbarSize / SET_CanvasScaleV);
            ToolbarV.style["display"] = "none";
            ToolbarH.style["display"] = "block";
            ToolbarH.style["top"] = "0px";
            ToolbarH.style["bottom"] = "";
            ToolbarH.style["height"] = Math.floor(ToolbarSize * SET_CanvasScaleV) + "px";
            CanvasX = 0;
            CanvasY = ToolbarSize;
            CanvasW = CanvasRawW;
            CanvasH = CanvasRawH - ToolbarSize;
            break;
        case 2: // Bottom
            ToolbarSize = Math.ceil(ToolbarSize / SET_CanvasScaleV);
            ToolbarV.style["display"] = "none";
            ToolbarH.style["display"] = "block";
            ToolbarH.style["top"] = "";
            ToolbarH.style["bottom"] = "0px";
            ToolbarH.style["height"] = Math.floor(ToolbarSize * SET_CanvasScaleV) + "px";
            CanvasX = 0;
            CanvasY = 0;
            CanvasW = CanvasRawW;
            CanvasH = CanvasRawH - ToolbarSize;
            break;
        case 3: // Right
            ToolbarSize = Math.ceil(ToolbarSize / SET_CanvasScaleH);
            ToolbarH.style["display"] = "none";
            ToolbarV.style["display"] = "block";
            ToolbarV.style["left"] = "";
            ToolbarV.style["right"] = "0px";
            ToolbarV.style["width"] = Math.floor(ToolbarSize * SET_CanvasScaleH) + "px";
            CanvasX = 0;
            CanvasY = 0;
            CanvasW = CanvasRawW - ToolbarSize;
            CanvasH = CanvasRawH;
            break;
        case 4: // Left
            ToolbarSize = Math.ceil(ToolbarSize / SET_CanvasScaleH);
            ToolbarH.style["display"] = "none";
            ToolbarV.style["display"] = "block";
            ToolbarV.style["left"] = "0px";
            ToolbarV.style["right"] = "";
            ToolbarV.style["width"] = Math.floor(ToolbarSize * SET_CanvasScaleH) + "px";
            CanvasX = ToolbarSize;
            CanvasY = 0;
            CanvasW = CanvasRawW - ToolbarSize;
            CanvasH = CanvasRawH;
            break;
        default:
            ToolbarH1.style["display"] = "none";
            ToolbarV1.style["display"] = "none";
            ToolbarH2.style["display"] = "none";
            ToolbarV2.style["display"] = "none";
            CanvasX = 0;
            CanvasY = 0;
            CanvasW = CanvasRawW;
            CanvasH = CanvasRawH;
            break;
    }

    if (SET_DrawOrientation == 2)
    {
        CanvasY = 0 - CanvasY;
        CanvasX = 0 - CanvasX;
    }
    if (SET_DrawOrientation == 1)
    {
        CanvasX = 0 - CanvasX;
    }
    if (SET_DrawOrientation == 3)
    {
        CanvasY = 0 - CanvasY;
    }
    if ((SET_DrawOrientation == 1) || (SET_DrawOrientation == 3))
    {
        CanvasLine = CanvasX;
        CanvasX = CanvasY;
        CanvasY = CanvasLine;

        CanvasLine = CanvasW;
        CanvasW = CanvasH;
        CanvasH = CanvasLine;
    }
    if ((CanvasW % 2) != 0) { CanvasW++; }
    if ((CanvasH % 2) != 0) { CanvasH--; }

    if (DISP_Mode == 0)
    {
        CanvasLine = Math.floor(CanvasH / DISP_Line);
    }
    if (DISP_Mode == 1)
    {
        CanvasLine = Math.floor(CanvasH / (DISP_Line * 2));
    }

    if (audioRecorder)
    {
        SetFFT();
    }

    DispLayout();
    SetLabels();

    if ((CanvasW <= 0) || (CanvasH <= 0))
    {
        SettingsShow();
    }
}


function Limit(Val, ValMin, ValMax)
{
    if (isNaN(Val))
    {
        Val = 0;
    }
    if (Val < ValMin) { return ValMin; }
    if (Val > ValMax) { return ValMax; }
    return Math.floor(Val);
}

var DISP_Gain = 7;
var DISP_Reso = 4;
var DISP_Wind = 40;
var DISP_Zoom = 0;
var DISP_Offs = 0;
var DISP_Step = 7;
var DISP_Base = 0;
var DISP_MiMa = 0;
var DISP_Line = 1;
var DISP_Mode = 0;

function SetLabels()
{
    var DISP_Gain_ = Math.pow(2, DISP_Gain);
    var DISP_Reso_ = Math.pow(2, DISP_Reso + 5);
    var DISP_Wind_ = "";
    switch (DISP_Wind)
    {
        case 16: DISP_Wind_ = "100/6400"; break;
        case 17: DISP_Wind_ = "100/5382"; break;
        case 18: DISP_Wind_ = "100/4525"; break;
        case 19: DISP_Wind_ = "100/3805"; break;
        case 20: DISP_Wind_ = "100/3200"; break;
        case 21: DISP_Wind_ = "100/2691"; break;
        case 22: DISP_Wind_ = "100/2263"; break;
        case 23: DISP_Wind_ = "100/1903"; break;
        case 24: DISP_Wind_ = "100/1600"; break;
        case 25: DISP_Wind_ = "100/1345"; break;
        case 26: DISP_Wind_ = "100/1131"; break;
        case 27: DISP_Wind_ = "100/951"; break;
        case 28: DISP_Wind_ = "100/800"; break;
        case 29: DISP_Wind_ = "100/673"; break;
        case 30: DISP_Wind_ = "100/566"; break;
        case 31: DISP_Wind_ = "100/476"; break;
        case 32: DISP_Wind_ = "100/400"; break;
        case 33: DISP_Wind_ = "100/336"; break;
        case 34: DISP_Wind_ = "100/283"; break;
        case 35: DISP_Wind_ = "100/238"; break;
        case 36: DISP_Wind_ = "100/200"; break;
        case 37: DISP_Wind_ = "100/168"; break;
        case 38: DISP_Wind_ = "100/141"; break;
        case 39: DISP_Wind_ = "100/119"; break;
        case 40: DISP_Wind_ = "100/100"; break;
    }
    var DISP_Zoom_ = Math.pow(2, DISP_Zoom + 9);
    var DISP_Offs_ = DISP_Offs + "/64";
    var DISP_Step_ = Math.pow(2, DISP_Step);
    var DISP_Base_ = DISP_Base + "/64";
    var DISP_MiMa_ = DISP_MiMa;
    var DISP_Line_ = DISP_Line;

    document.getElementById("BtnH1GainUp").innerText = "G+\n" + DISP_Gain_;
    document.getElementById("BtnV1GainUp").innerText = "G+\n" + DISP_Gain_;
    document.getElementById("BtnH2GainUp").innerText = "G+\n" + DISP_Gain_;
    document.getElementById("BtnV2GainUp").innerText = "G+\n" + DISP_Gain_;

    document.getElementById("BtnH1GainDn").innerText = "G-\n" + DISP_Gain_;
    document.getElementById("BtnV1GainDn").innerText = "G-\n" + DISP_Gain_;
    document.getElementById("BtnH2GainDn").innerText = "G-\n" + DISP_Gain_;
    document.getElementById("BtnV2GainDn").innerText = "G-\n" + DISP_Gain_;

    document.getElementById("BtnH1ResoUp").innerText = "R+\n" + DISP_Reso_;
    document.getElementById("BtnV1ResoUp").innerText = "R+\n" + DISP_Reso_;
    document.getElementById("BtnH2ResoUp").innerText = "R+\n" + DISP_Reso_;
    document.getElementById("BtnV2ResoUp").innerText = "R+\n" + DISP_Reso_;

    document.getElementById("BtnH1ResoDn").innerText = "R-\n" + DISP_Reso_;
    document.getElementById("BtnV1ResoDn").innerText = "R-\n" + DISP_Reso_;
    document.getElementById("BtnH2ResoDn").innerText = "R-\n" + DISP_Reso_;
    document.getElementById("BtnV2ResoDn").innerText = "R-\n" + DISP_Reso_;

    document.getElementById("BtnH1WindUp").innerText = "W+\n" + DISP_Wind_;
    document.getElementById("BtnV1WindUp").innerText = "W+\n" + DISP_Wind_;
    document.getElementById("BtnH2WindUp").innerText = "W+\n" + DISP_Wind_;
    document.getElementById("BtnV2WindUp").innerText = "W+\n" + DISP_Wind_;

    document.getElementById("BtnH1WindDn").innerText = "W-\n" + DISP_Wind_;
    document.getElementById("BtnV1WindDn").innerText = "W-\n" + DISP_Wind_;
    document.getElementById("BtnH2WindDn").innerText = "W-\n" + DISP_Wind_;
    document.getElementById("BtnV2WindDn").innerText = "W-\n" + DISP_Wind_;

    document.getElementById("BtnH1ZoomUp").innerText = "Z+\n" + DISP_Zoom_;
    document.getElementById("BtnV1ZoomUp").innerText = "Z+\n" + DISP_Zoom_;
    document.getElementById("BtnH2ZoomUp").innerText = "Z+\n" + DISP_Zoom_;
    document.getElementById("BtnV2ZoomUp").innerText = "Z+\n" + DISP_Zoom_;

    document.getElementById("BtnH1ZoomDn").innerText = "Z-\n" + DISP_Zoom_;
    document.getElementById("BtnV1ZoomDn").innerText = "Z-\n" + DISP_Zoom_;
    document.getElementById("BtnH2ZoomDn").innerText = "Z-\n" + DISP_Zoom_;
    document.getElementById("BtnV2ZoomDn").innerText = "Z-\n" + DISP_Zoom_;

    document.getElementById("BtnH1OffsUp").innerText = "O+\n" + DISP_Offs_;
    document.getElementById("BtnV1OffsUp").innerText = "O+\n" + DISP_Offs_;
    document.getElementById("BtnH2OffsUp").innerText = "O+\n" + DISP_Offs_;
    document.getElementById("BtnV2OffsUp").innerText = "O+\n" + DISP_Offs_;

    document.getElementById("BtnH1OffsDn").innerText = "O-\n" + DISP_Offs_;
    document.getElementById("BtnV1OffsDn").innerText = "O-\n" + DISP_Offs_;
    document.getElementById("BtnH2OffsDn").innerText = "O-\n" + DISP_Offs_;
    document.getElementById("BtnV2OffsDn").innerText = "O-\n" + DISP_Offs_;

    document.getElementById("BtnH1StepUp").innerText = "S+\n" + DISP_Step_;
    document.getElementById("BtnV1StepUp").innerText = "S+\n" + DISP_Step_;
    document.getElementById("BtnH2StepUp").innerText = "S+\n" + DISP_Step_;
    document.getElementById("BtnV2StepUp").innerText = "S+\n" + DISP_Step_;

    document.getElementById("BtnH1StepDn").innerText = "S-\n" + DISP_Step_;
    document.getElementById("BtnV1StepDn").innerText = "S-\n" + DISP_Step_;
    document.getElementById("BtnH2StepDn").innerText = "S-\n" + DISP_Step_;
    document.getElementById("BtnV2StepDn").innerText = "S-\n" + DISP_Step_;

    document.getElementById("BtnH1BaseUp").innerText = "B+\n" + DISP_Base_;
    document.getElementById("BtnV1BaseUp").innerText = "B+\n" + DISP_Base_;
    document.getElementById("BtnH2BaseUp").innerText = "B+\n" + DISP_Base_;
    document.getElementById("BtnV2BaseUp").innerText = "B+\n" + DISP_Base_;

    document.getElementById("BtnH1BaseDn").innerText = "B-\n" + DISP_Base_;
    document.getElementById("BtnV1BaseDn").innerText = "B-\n" + DISP_Base_;
    document.getElementById("BtnH2BaseDn").innerText = "B-\n" + DISP_Base_;
    document.getElementById("BtnV2BaseDn").innerText = "B-\n" + DISP_Base_;

    document.getElementById("BtnH1MiMaUp").innerText = "M+\n" + DISP_MiMa_;
    document.getElementById("BtnV1MiMaUp").innerText = "M+\n" + DISP_MiMa_;
    document.getElementById("BtnH2MiMaUp").innerText = "M+\n" + DISP_MiMa_;
    document.getElementById("BtnV2MiMaUp").innerText = "M+\n" + DISP_MiMa_;

    document.getElementById("BtnH1MiMaDn").innerText = "M-\n" + DISP_MiMa_;
    document.getElementById("BtnV1MiMaDn").innerText = "M-\n" + DISP_MiMa_;
    document.getElementById("BtnH2MiMaDn").innerText = "M-\n" + DISP_MiMa_;
    document.getElementById("BtnV2MiMaDn").innerText = "M-\n" + DISP_MiMa_;

    document.getElementById("BtnH1LineUp").innerText = "L+\n" + DISP_Line_;
    document.getElementById("BtnV1LineUp").innerText = "L+\n" + DISP_Line_;
    document.getElementById("BtnH2LineUp").innerText = "L+\n" + DISP_Line_;
    document.getElementById("BtnV2LineUp").innerText = "L+\n" + DISP_Line_;

    document.getElementById("BtnH1LineDn").innerText = "L-\n" + DISP_Line_;
    document.getElementById("BtnV1LineDn").innerText = "L-\n" + DISP_Line_;
    document.getElementById("BtnH2LineDn").innerText = "L-\n" + DISP_Line_;
    document.getElementById("BtnV2LineDn").innerText = "L-\n" + DISP_Line_;
}

function FFTWindow(X)
{
    switch (X)
    {
        case 16: return 16;
        case 17: return 19;
        case 18: return 23;
        case 19: return 27;
        case 20: return 32;
        case 21: return 38;
        case 22: return 45;
        case 23: return 54;
        case 24: return 64;
        case 25: return 76;
        case 26: return 91;
        case 27: return 108;
        case 28: return 128;
        case 29: return 152;
        case 30: return 181;
        case 31: return 215;
        case 32: return 256;
        case 33: return 304;
        case 34: return 362;
        case 35: return 431;
        case 36: return 512;
        case 37: return 609;
        case 38: return 724;
        case 39: return 861;
        case 40: return 1024;
        default: return 1024;
    }
}

function SetFFT()
{
    var Gain_ = Math.pow(2, DISP_Gain);
    var MinMax_ = DISP_MiMa;
    var FFT_ = Math.pow(2, DISP_Reso + 6);
    var Win_ = FFTWindow(DISP_Wind);
    var Step_ = Math.pow(2, Math.max(DISP_Step, SET_MinimumStep));
    var Base_ = DISP_Base;
    var CanvasDrawStepX_ = CanvasDrawStepX;

    if (DISP_Step >= SET_MinimumStep)
    {
        CanvasDrawStep = 1;
        CanvasDrawStepX = 0;
    }
    else
    {
        CanvasDrawStep = Math.pow(2, SET_MinimumStep - DISP_Step);
        CanvasDrawStepX = SET_MinimumStep - DISP_Step;
    }
    
    if (CanvasDrawStepX_ < CanvasDrawStepX)
    {
        DrawPointer = Math.floor(DrawPointer >> (CanvasDrawStepX - CanvasDrawStepX_));
    }
    if (CanvasDrawStepX_ > CanvasDrawStepX)
    {
        DrawPointer = Math.floor(DrawPointer << (CanvasDrawStepX_ - CanvasDrawStepX));
    }

    CanvasWX = Math.ceil((CanvasW >> CanvasDrawStepX));

    if (IsPaused)
    {
        AudioCallbackDummy();
    }
    audioRecorder.Msg({ command: 'fft', DispMode: DISP_VU__, FFT: FFT_, Win: Win_, MinMax: MinMax_, Gain: Gain_, Step: Step_, Base: Base_, Decimation: SET_SampleDecimation, AudioMode: SET_AudioMode, DispSize: (DISP_Line * CanvasWX) - SET_BufTickMargin, BufTick: SET_BufTick, WFBack: SET_WaveformBack, WFFore: SET_WaveformFore });
}

function BtnAction(Btn)
{
    var Temp;
    switch (Btn)
    {
        case 0:
            SettingsShow();
            break;
        case 10:
            DISP_Gain = Limit(DISP_Gain - 1, 0, 20);
            SetFFT();
            break;
        case 11:
            DISP_Gain = Limit(DISP_Gain + 1, 0, 20);
            SetFFT();
            break;
        case 12:
            DISP_Reso = Limit(DISP_Reso - 1, 0, 8);
            SetFFT();
            break;
        case 13:
            DISP_Reso = Limit(DISP_Reso + 1, 0, 8);
            SetFFT();
            break;
        case 14:
            DISP_Wind = Limit(DISP_Wind - 1, 16, 40);
            SetFFT();
            break;
        case 15:
            DISP_Wind = Limit(DISP_Wind + 1, 16, 40);
            SetFFT();
            break;
        case 16:
            DISP_Zoom = Limit(DISP_Zoom - 1, -4, 4);
            SetFFT();
            break;
        case 17:
            DISP_Zoom = Limit(DISP_Zoom + 1, -4, 4);
            SetFFT();
            break;
        case 18:
            DISP_Offs = Limit(DISP_Offs - 1, -128, 64);
            SetFFT();
            break;
        case 19:
            DISP_Offs = Limit(DISP_Offs + 1, -128, 64);
            SetFFT();
            break;
        case 20:
            DISP_Step = Limit(DISP_Step - 1, 3, 12);
            SetFFT();
            break;
        case 21:
            DISP_Step = Limit(DISP_Step + 1, 3, 12);
            SetFFT();
            break;
        case 22:
            DISP_Base = Limit(DISP_Base - 1, -64, 64);
            SetFFT();
            break;
        case 23:
            DISP_Base = Limit(DISP_Base + 1, -64, 64);
            SetFFT();
            break;
        case 24:
            DISP_MiMa = Limit(DISP_MiMa - 1, -32, 32);
            SetFFT();
            break;
        case 25:
            DISP_MiMa = Limit(DISP_MiMa + 1, -32, 32);
            SetFFT();
            break;
        case 26:
            DISP_Line = Limit(DISP_Line - 1, 1, 32);
            CanvasLineNum = 0;
            SetLayout();
            break;
        case 27:
            DISP_Line = Limit(DISP_Line + 1, 1, 32);
            CanvasLineNum = 0;
            SetLayout();
            break;
        case 28:
            Temp = false;
            switch (SET_DispModeLines)
            {
                case 0: DISP_Mode = 0; Temp = true; break;
                case 1: DISP_Mode = 1; Temp = true; break;
                case 2:
                    if (DISP_Mode == 0)
                    {
                        DISP_Mode = 1;
                    }
                    else
                    {
                        DISP_Mode = 0;
                        Temp = true;
                    }
                break;
            }
            if (Temp)
            {
                DISP_VU__++;
                if ((SET_DispModeWaveform == 0))
                {
                    DISP_VU__ = 0;
                }
                if ((SET_DispModeWaveform == 1) && (DISP_VU__ == 2))
                {
                    DISP_VU__++;
                }
                if ((SET_DispModeWaveform == 2) && (DISP_VU__ == 1))
                {
                    DISP_VU__++;
                }
                if (DISP_VU__ == 3)
                {
                    DISP_VU__ = 0;
                }
            }
            SetFFT();
            SetLayout();
            break;
        case 29:
            Pause();
            break;
    }
    DataSet("DISP_Gain", DISP_Gain);
    DataSet("DISP_Reso", DISP_Reso);
    DataSet("DISP_Wind", DISP_Wind);
    DataSet("DISP_Zoom", DISP_Zoom);
    DataSet("DISP_Offs", DISP_Offs);
    DataSet("DISP_Step", DISP_Step);
    DataSet("DISP_Base", DISP_Base);
    DataSet("DISP_MiMa", DISP_MiMa);
    DataSet("DISP_Line", DISP_Line);
    DataSet("DISP_Mode", DISP_Mode);
    DataSet("DISP_VU__", DISP_VU__);
    SetLabels();
}





var DISP_Gain = 7;
var DISP_Reso = 4;
var DISP_Wind = 40;
var DISP_Zoom = 0;
var DISP_Offs = 0;
var DISP_Step = 7;
var DISP_Base = 0;
var DISP_MiMa = 0;
var DISP_Line = 1;
var DISP_Mode = 0;
var DISP_VU__ = 0;

if (DataExists("DISP_Gain")) { DISP_Gain = parseInt(DataGet("DISP_Gain")); }
if (DataExists("DISP_Reso")) { DISP_Reso = parseInt(DataGet("DISP_Reso")); }
if (DataExists("DISP_Wind")) { DISP_Wind = parseInt(DataGet("DISP_Wind")); }
if (DataExists("DISP_Zoom")) { DISP_Zoom = parseInt(DataGet("DISP_Zoom")); }
if (DataExists("DISP_Offs")) { DISP_Offs = parseInt(DataGet("DISP_Offs")); }
if (DataExists("DISP_Step")) { DISP_Step = parseInt(DataGet("DISP_Step")); }
if (DataExists("DISP_Base")) { DISP_Base = parseInt(DataGet("DISP_Base")); }
if (DataExists("DISP_MiMa")) { DISP_MiMa = parseInt(DataGet("DISP_MiMa")); }
if (DataExists("DISP_Line")) { DISP_Line = parseInt(DataGet("DISP_Line")); }
if (DataExists("DISP_Mode")) { DISP_Mode = parseInt(DataGet("DISP_Mode")); }
if (DataExists("DISP_VU__")) { DISP_VU__ = parseInt(DataGet("DISP_VU__")); }

if (DataExists("SET_CanvasScaleH")) { SET_CanvasScaleH = parseInt(DataGet("SET_CanvasScaleH")); }
if (DataExists("SET_CanvasScaleV")) { SET_CanvasScaleV = parseInt(DataGet("SET_CanvasScaleV")); }
if (DataExists("SET_DrawGamma")) { SET_DrawGamma = parseInt(DataGet("SET_DrawGamma")); }
if (DataExists("SET_ToolbarSize")) { SET_ToolbarSize = parseInt(DataGet("SET_ToolbarSize")); }
if (DataExists("SET_ToolbarPosition")) { SET_ToolbarPosition = parseInt(DataGet("SET_ToolbarPosition")); }
if (DataExists("SET_MinimumStep")) { SET_MinimumStep = parseInt(DataGet("SET_MinimumStep")); }
if (DataExists("SET_DrawStripSize")) { SET_DrawStripSize = parseInt(DataGet("SET_DrawStripSize")); }
if (DataExists("SET_DrawStripColorR")) { SET_DrawStripColorR = parseInt(DataGet("SET_DrawStripColorR")); }
if (DataExists("SET_DrawStripColorG")) { SET_DrawStripColorG = parseInt(DataGet("SET_DrawStripColorG")); }
if (DataExists("SET_DrawStripColorB")) { SET_DrawStripColorB = parseInt(DataGet("SET_DrawStripColorB")); }
if (DataExists("SET_DrawOverdriveThreshold")) { SET_DrawOverdriveThreshold = parseInt(DataGet("SET_DrawOverdriveThreshold")); }
if (DataExists("SET_DrawOverdriveColorR")) { SET_DrawOverdriveColorR = parseInt(DataGet("SET_DrawOverdriveColorR")); }
if (DataExists("SET_DrawOverdriveColorG")) { SET_DrawOverdriveColorG = parseInt(DataGet("SET_DrawOverdriveColorG")); }
if (DataExists("SET_DrawOverdriveColorB")) { SET_DrawOverdriveColorB = parseInt(DataGet("SET_DrawOverdriveColorB")); }
if (DataExists("SET_DrawOverdriveColorA")) { SET_DrawOverdriveColorA = parseInt(DataGet("SET_DrawOverdriveColorA")); }
if (DataExists("SET_SampleDecimation")) { SET_SampleDecimation = parseInt(DataGet("SET_SampleDecimation")); }

if (DataExists("SET_ButtonFontSize")) { SET_ButtonFontSize = parseInt(DataGet("SET_ButtonFontSize")); }
if (DataExists("SET_DrawOrientation")) { SET_DrawOrientation = parseInt(DataGet("SET_DrawOrientation")); }

if (DataExists("SET_AudioMode")) { SET_AudioMode = parseInt(DataGet("SET_AudioMode")); }

SET_DrawOverdriveColorX = 255 - SET_DrawOverdriveColorA;

function DispLayout()
{
    document.getElementById("xScreenSize").innerHTML = window.innerWidth + "x" + window.innerHeight;
    document.getElementById("xCanvasSize").innerHTML = CanvasW + "x" + CanvasH;

    AudioCallbackDummy();
}

function SettingsShow()
{
    DispLayout();

    document.getElementById("xSET_SampleDecimation").value = SET_SampleDecimation;

    document.getElementById("xSET_DrawOrientation").selectedIndex = SET_DrawOrientation;
    document.getElementById("xSET_ToolbarPosition").selectedIndex = SET_ToolbarPosition;
    document.getElementById("xSET_ToolbarSize").value = SET_ToolbarSize;
    document.getElementById("xSET_MinimumStep").selectedIndex = SET_MinimumStep - 3;
    document.getElementById("xSET_CanvasScaleH").value = SET_CanvasScaleH;
    document.getElementById("xSET_CanvasScaleV").value = SET_CanvasScaleV;
    document.getElementById("xSET_DrawGamma").value = SET_DrawGamma;
    document.getElementById("xSET_BufLength").value = SET_BufLength;
    document.getElementById("xSET_BufTick").value = SET_BufTick;
    document.getElementById("xSET_BufTickMargin").value = SET_BufTickMargin;

    document.getElementById("xSET_DrawStripSize").value = SET_DrawStripSize;
    document.getElementById("xSET_DrawStripColorR").value = SET_DrawStripColorR;
    document.getElementById("xSET_DrawStripColorG").value = SET_DrawStripColorG;
    document.getElementById("xSET_DrawStripColorB").value = SET_DrawStripColorB;

    document.getElementById("xSET_DrawOverdriveThreshold").value = SET_DrawOverdriveThreshold;
    document.getElementById("xSET_DrawOverdriveColorR").value = SET_DrawOverdriveColorR;
    document.getElementById("xSET_DrawOverdriveColorG").value = SET_DrawOverdriveColorG;
    document.getElementById("xSET_DrawOverdriveColorB").value = SET_DrawOverdriveColorB;
    document.getElementById("xSET_DrawOverdriveColorA").value = SET_DrawOverdriveColorA;

    document.getElementById("xSET_DispModeLines").selectedIndex = SET_DispModeLines;
    document.getElementById("xSET_DispModeWaveform").selectedIndex = SET_DispModeWaveform;
    document.getElementById("xSET_WaveformBack").value = SET_WaveformBack;
    document.getElementById("xSET_WaveformFore").value = SET_WaveformFore;
    document.getElementById("xSET_ButtonFontSize").value = SET_ButtonFontSize;
    document.getElementById("xSET_AudioEchoCancellation").checked = SET_AudioEchoCancellation;
    document.getElementById("xSET_AudioNoiseSuppression").checked = SET_AudioNoiseSuppression;
    document.getElementById("xSET_AudioAutoGainControl_").checked = SET_AudioAutoGainControl_;

    document.getElementById("xCurrentSamplerate").innerHTML = CurrentSamplerate;
    document.getElementById("xCurrentSamplerateX").innerHTML = CurrentSamplerate / SET_SampleDecimation;

    document.getElementById("xSET_AudioBufferLength").selectedIndex = SET_AudioBufferLength - 8;
    document.getElementById("xSET_AudioMode").selectedIndex = SET_AudioMode;
    document.getElementById("xSET_ImageDataMode").selectedIndex = SET_ImageDataMode;

    document.getElementById("Settings").style.display = "block";
}

function SettingBtn(Cmd)
{
    switch(Cmd)
    {
        case 0:
            document.getElementById("Settings").style.display = "none";
            break;
        case 1:
            ToggleRecording();
            break;
        case 2:
            ToggleFullScreen();
            break;
        case 3:
            SET_DrawOrientation = document.getElementById("xSET_DrawOrientation").selectedIndex;
            SET_ToolbarPosition = document.getElementById("xSET_ToolbarPosition").selectedIndex;
            SET_ToolbarSize = Limit(document.getElementById("xSET_ToolbarSize").value, 1, 1000);
            SET_CanvasScaleH = Limit(document.getElementById("xSET_CanvasScaleH").value, 1, 100);
            SET_CanvasScaleV = Limit(document.getElementById("xSET_CanvasScaleV").value, 1, 100);
            SET_ButtonFontSize = Limit(document.getElementById("xSET_ButtonFontSize").value, 1, 100);

            DataSet("SET_DrawOrientation", SET_DrawOrientation);
            DataSet("SET_ToolbarPosition", SET_ToolbarPosition);
            DataSet("SET_ToolbarSize", SET_ToolbarSize);
            DataSet("SET_CanvasScaleH", SET_CanvasScaleH);
            DataSet("SET_CanvasScaleV", SET_CanvasScaleV);
            DataSet("SET_ButtonFontSize", SET_ButtonFontSize);

            document.getElementById("xSET_ToolbarSize").value = SET_ToolbarSize;
            document.getElementById("xSET_CanvasScaleH").value = SET_CanvasScaleH;
            document.getElementById("xSET_CanvasScaleV").value = SET_CanvasScaleV;
            document.getElementById("xSET_ButtonFontSize").value = SET_ButtonFontSize;

            SetLayout();
            break;
        case 4:
            SET_SampleDecimation = Limit(document.getElementById("xSET_SampleDecimation").value, 1, 1000);
            SET_MinimumStep = document.getElementById("xSET_MinimumStep").selectedIndex + 3;
            SET_AudioMode = document.getElementById("xSET_AudioMode").selectedIndex;
            SET_BufLength = Limit(document.getElementById("xSET_BufLength").value, 0, 1000000000);
            SET_BufTick = Limit(document.getElementById("xSET_BufTick").value, 0, 1000);
            SET_BufTickMargin = Limit(document.getElementById("xSET_BufTickMargin").value, 0, 1000);
            SET_WaveformBack = Limit(document.getElementById("xSET_WaveformBack").value, 0, 65536);
            SET_WaveformFore = Limit(document.getElementById("xSET_WaveformFore").value, 0, 65536);

            DataSet("SET_SampleDecimation", SET_SampleDecimation);
            DataSet("SET_MinimumStep", SET_MinimumStep);
            DataSet("SET_AudioMode", SET_AudioMode);
            DataSet("SET_BufLength", SET_BufLength);
            DataSet("SET_BufTick", SET_BufTick);
            DataSet("SET_BufTickMargin", SET_BufTickMargin);

            document.getElementById("xSET_SampleDecimation").value = SET_SampleDecimation;
            document.getElementById("xSET_BufLength").value = SET_BufLength;
            document.getElementById("xSET_BufTick").value = SET_BufTick;
            document.getElementById("xSET_BufTickMargin").value = SET_BufTickMargin;
            document.getElementById("xSET_WaveformBack").value = SET_WaveformBack;
            document.getElementById("xSET_WaveformFore").value = SET_WaveformFore;

            document.getElementById("xCurrentSamplerate").innerHTML = CurrentSamplerate;
            document.getElementById("xCurrentSamplerateX").innerHTML = CurrentSamplerate / SET_SampleDecimation;

            SetFFT();
            break;
        case 5:
            break;
        case 6:
            SET_DrawGamma = Limit(document.getElementById("xSET_DrawGamma").value, 0, 1000000000);
            DataSet("SET_DrawGamma", SET_DrawGamma);
            document.getElementById("xSET_DrawGamma").value = SET_DrawGamma;
            InitPalette();
            break;
        case 7:
            SET_AudioBufferLength = document.getElementById("xSET_AudioBufferLength").selectedIndex + 8;
            SET_DrawStripSize = Limit(document.getElementById("xSET_DrawStripSize").value, 0, 1000000000);
            SET_DrawStripColorR = Limit(document.getElementById("xSET_DrawStripColorR").value, 0, 255);
            SET_DrawStripColorG = Limit(document.getElementById("xSET_DrawStripColorG").value, 0, 255);
            SET_DrawStripColorB = Limit(document.getElementById("xSET_DrawStripColorB").value, 0, 255);
            SET_DrawOverdriveThreshold = Limit(document.getElementById("xSET_DrawOverdriveThreshold").value, 0, 1000000000);
            SET_DrawOverdriveColorR = Limit(document.getElementById("xSET_DrawOverdriveColorR").value, 0, 255);
            SET_DrawOverdriveColorG = Limit(document.getElementById("xSET_DrawOverdriveColorG").value, 0, 255);
            SET_DrawOverdriveColorB = Limit(document.getElementById("xSET_DrawOverdriveColorB").value, 0, 255);
            SET_DrawOverdriveColorA = Limit(document.getElementById("xSET_DrawOverdriveColorA").value, 0, 255);
            SET_ImageDataMode = document.getElementById("xSET_ImageDataMode").selectedIndex;
            SET_DrawOverdriveColorX = 255 - SET_DrawOverdriveColorA;
            SET_DispModeLines = document.getElementById("xSET_DispModeLines").selectedIndex;
            SET_DispModeWaveform = document.getElementById("xSET_DispModeWaveform").selectedIndex;
            SET_AudioEchoCancellation = document.getElementById("xSET_AudioEchoCancellation").checked;
            SET_AudioNoiseSuppression = document.getElementById("xSET_AudioNoiseSuppression").checked;
            SET_AudioAutoGainControl_ = document.getElementById("xSET_AudioAutoGainControl_").checked;

            DataSet("SET_AudioBufferLength", SET_AudioBufferLength);
            DataSet("SET_DrawStripSize", SET_DrawStripSize);
            DataSet("SET_DrawStripColorR", SET_DrawStripColorR);
            DataSet("SET_DrawStripColorG", SET_DrawStripColorG);
            DataSet("SET_DrawStripColorB", SET_DrawStripColorB);
            DataSet("SET_DrawOverdriveThreshold", SET_DrawOverdriveThreshold);
            DataSet("SET_DrawOverdriveColorR", SET_DrawOverdriveColorR);
            DataSet("SET_DrawOverdriveColorG", SET_DrawOverdriveColorG);
            DataSet("SET_DrawOverdriveColorB", SET_DrawOverdriveColorB);
            DataSet("SET_DrawOverdriveColorA", SET_DrawOverdriveColorA);
            DataSet("SET_ImageDataMode", SET_ImageDataMode);
            DataSet("SET_DispModeLines", SET_DispModeLines);
            DataSet("SET_DispModeWaveform", SET_DispModeWaveform);
            DataSet("SET_AudioEchoCancellation", SET_AudioEchoCancellation ? "1" : "0");
            DataSet("SET_AudioNoiseSuppression", SET_AudioNoiseSuppression ? "1" : "0");
            DataSet("SET_AudioAutoGainControl_", SET_AudioAutoGainControl_ ? "1" : "0");

            document.getElementById("xSET_DrawStripSize").value = SET_DrawStripSize;
            document.getElementById("xSET_DrawStripColorR").value = SET_DrawStripColorR;
            document.getElementById("xSET_DrawStripColorG").value = SET_DrawStripColorG;
            document.getElementById("xSET_DrawStripColorB").value = SET_DrawStripColorB;
            document.getElementById("xSET_DrawOverdriveThreshold").value = SET_DrawOverdriveThreshold;
            document.getElementById("xSET_DrawOverdriveColorR").value = SET_DrawOverdriveColorR;
            document.getElementById("xSET_DrawOverdriveColorG").value = SET_DrawOverdriveColorG;
            document.getElementById("xSET_DrawOverdriveColorB").value = SET_DrawOverdriveColorB;
            document.getElementById("xSET_DrawOverdriveColorA").value = SET_DrawOverdriveColorA;

            break;
        case 8:
            DataClear();
            break;
        case 9:
            Pause();
            break;
    }
}


document.addEventListener("keydown", KeyPress, false);
window.addEventListener("resize", SetLayout, false);
