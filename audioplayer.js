var AudioPlayerBufSize = 0;
var AudioPlayerContext = null;
var AudioPlayerSampleRate = 0;
var AudioPlayerBuf;
var AudioPlayerBufTime = 0;
var AudioPlayerL;
var AudioPlayerR;

var AudioPlayerTimePointer = 0;

var SET_AudioPlayerTimeStartMin = DataGetIDefault("SET_AudioPlayerTimeStartMin", 50);
var SET_AudioPlayerTimeStartMax = DataGetIDefault("SET_AudioPlayerTimeStartMax", 150);
var SET_AudioPlayerEnabled = DataGetIDefault("SET_AudioPlayerEnabled", 0);
var SET_AudioPlayerDrawBuf = DataGetIDefault("SET_AudioPlayerDrawBuf", 0);
var SET_AudioPlayerMute = DataGetIDefault("SET_AudioPlayerMute", 0);

var AudioPlayerTimeStartMin;
var AudioPlayerTimeStartMax;
var AudioPlayerTimeStartT = 0;
var AudioPlayerMute = false;

function AudioPlayerMuteSet()
{
    switch (SET_AudioPlayerMute)
    {
        case 0: AudioPlayerMute = false; break;
        case 1:
            if (PlaylistEnabled)
            {
                AudioPlayerMute = false;
            }
            else
            {
                AudioPlayerMute = true;
            }
            break;
        case 2:
            if (PlaylistEnabled)
            {
                AudioPlayerMute = true;
            }
            else
            {
                AudioPlayerMute = false;
            }
            break;
        case 3: AudioPlayerMute = true; break;
    }
}

function AudioPlayerInit()
{
    AudioPlayerMuteSet();
    if (!AudioPlayerContext)
    {
        AudioPlayerContext = new (window.AudioContext || window.webkitAudioContext)();
        AudioPlayerSampleRate = AudioPlayerContext.sampleRate;
    }
    AudioPlayerBufSize = 1 << SET_AudioBufferLength;

    //AudioPlayerBufSize = 44100;

    AudioPlayerBufTime = AudioPlayerBufSize / AudioPlayerSampleRate;

    AudioPlayerTimeStartMin = Math.round(SET_AudioPlayerTimeStartMin * AudioPlayerSampleRate / 1000);
    AudioPlayerTimeStartMax = Math.round(SET_AudioPlayerTimeStartMax * AudioPlayerSampleRate / 1000);

    AudioPlayerTimePointer = 0;
    AudioPlayerMuteSet();
}

function AudioPlayerPlay(AudioPlayerBufLen, BufL, BufR)
{
    if ((AudioPlayerBufSize < AudioPlayerBufLen) || (AudioPlayerBufLen < 1))
    {
        return;
    }

    AudioPlayerBuf = AudioPlayerContext.createBuffer(2, AudioPlayerBufSize, AudioPlayerSampleRate);
    AudioPlayerL = AudioPlayerBuf.getChannelData(0);
    AudioPlayerR = AudioPlayerBuf.getChannelData(1);

    if (AudioPlayerMute)
    {
        for (var I = 0; I < AudioPlayerBufLen; I++)
        {
            AudioPlayerL[I] = 0;
            AudioPlayerR[I] = 0;
        }
    }
    else
    {
        for (var I = 0; I < AudioPlayerBufLen; I++)
        {
            AudioPlayerL[I] = BufL[I];
            AudioPlayerR[I] = BufR[I];
        }
    }
    var AudioPlayerSource = AudioPlayerContext.createBufferSource();

    AudioPlayerSource.buffer = AudioPlayerBuf;
    AudioPlayerSource.connect(AudioPlayerContext.destination);

    var T = Math.round(AudioPlayerContext.currentTime * AudioPlayerSampleRate);
    if ((AudioPlayerTimePointer < (T + AudioPlayerTimeStartMin)) || (AudioPlayerTimePointer > (T + AudioPlayerTimeStartMax)))
    {
        AudioPlayerTimePointer = (T + AudioPlayerTimeStartMin + Math.round((AudioPlayerTimeStartMax - AudioPlayerTimeStartMin) / 2));
    }
    AudioPlayerTimeStartT = AudioPlayerTimePointer - T;
    var Ptr = AudioPlayerTimePointer / AudioPlayerSampleRate;

    AudioPlayerSource.start(Ptr, 0, AudioPlayerBufTime);
    AudioPlayerTimePointer = AudioPlayerTimePointer + AudioPlayerBufSize;
}

function AudioPlayerDrawBuffer(X, Y1, Y2, W)
{
    if ((SET_AudioPlayerEnabled) && (AudioPlayerTimeStartMax > AudioPlayerTimeStartMin) && (Y2 < Y1))
    {
        var Pos = (AudioPlayerTimeStartT - AudioPlayerTimeStartMin) / (AudioPlayerTimeStartMax - AudioPlayerTimeStartMin);
        if (Pos < 0) { Pos = 0; }
        if (Pos > 1) { Pos = 1; }
        DrawRectX(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, X, Math.round(Y1 + (Y2 - Y1) * Pos), W, 255, 255, 255);
    }
}
