

// 0 - None
// 1 - Current only
// 2 - Current and history
var SET_SaveEnabled = DataGetIDefault("SET_SaveEnabled", 0);

// 0 - 0 flip
// 1 - 90 flip
// 2 - 180 flip
// 3 - 270 flip
// 4 - 0 flip
// 5 - 90 flip
// 6 - 180 flip
// 7 - 270 flip
var SET_SaveOrientation = DataGetIDefault("SET_SaveOrientation", 0);

var SET_SaveStripSize = DataGetIDefault("SET_SaveStripSize", 32);
var SET_SaveLength = DataGetIDefault("SET_SaveLength", 10000);
var SET_SaveZoomN = DataGetIDefault("SET_SaveZoomN", 1);
var SET_SaveZoomD = DataGetIDefault("SET_SaveZoomD", 1);
var SET_SaveStepN = DataGetIDefault("SET_SaveStepN", 1);
var SET_SaveStepD = DataGetIDefault("SET_SaveStepD", 1);
var SET_SaveStripPercent = DataGetIDefault("SET_SaveStripPercent", 5);
var SET_SaveStripMargin = DataGetIDefault("SET_SaveStripMargin", 20);


function SaveSettingsGet()
{
    document.getElementById("xSET_SaveEnabled").selectedIndex = SET_SaveEnabled;
    document.getElementById("xSET_SaveOrientation").selectedIndex = SET_SaveOrientation;
    document.getElementById("xSET_SaveStripSize").value = SET_SaveStripSize;
    document.getElementById("xSET_SaveLength").value = SET_SaveLength;
    document.getElementById("xSET_SaveZoomN").value = SET_SaveZoomN;
    document.getElementById("xSET_SaveZoomD").value = SET_SaveZoomD;
    document.getElementById("xSET_SaveStepN").value = SET_SaveStepN;
    document.getElementById("xSET_SaveStepD").value = SET_SaveStepD;

    document.getElementById("xSET_SaveStripPercent").value = SET_SaveStripPercent;
    document.getElementById("xSET_SaveStripMargin").value = SET_SaveStripMargin;
    SaveInfo();
}

function SaveSettingsSet(Mode)
{
    SET_SaveEnabled = document.getElementById("xSET_SaveEnabled").selectedIndex;
    SET_SaveOrientation = document.getElementById("xSET_SaveOrientation").selectedIndex;
    SET_SaveStripSize = Limit(document.getElementById("xSET_SaveStripSize").value, 0, 1000);
    SET_SaveLength = Limit(document.getElementById("xSET_SaveLength").value, 1, 1000000);
    SET_SaveZoomN = Limit(document.getElementById("xSET_SaveZoomN").value, 1, 1000);
    SET_SaveZoomD = Limit(document.getElementById("xSET_SaveZoomD").value, 1, 1000);
    SET_SaveStepN = Limit(document.getElementById("xSET_SaveStepN").value, 1, 1000);
    SET_SaveStepD = Limit(document.getElementById("xSET_SaveStepD").value, 1, 1000);

    SET_SaveStripPercent = Limit(document.getElementById("xSET_SaveStripPercent").value, 1, 100);
    SET_SaveStripMargin = Limit(document.getElementById("xSET_SaveStripMargin").value, 1, 1000000);

    DataSetI("SET_SaveEnabled", SET_SaveEnabled);
    DataSetI("SET_SaveOrientation", SET_SaveOrientation);
    DataSetI("SET_SaveStripSize", SET_SaveStripSize);
    DataSetI("SET_SaveLength", SET_SaveLength);
    DataSetI("SET_SaveZoomN", SET_SaveZoomN);
    DataSetI("SET_SaveZoomD", SET_SaveZoomD);
    DataSetI("SET_SaveStepN", SET_SaveStepN);
    DataSetI("SET_SaveStepD", SET_SaveStepD);
    
    if (Mode == 1)
    {
        SetFFT();
    }
    SaveInfo();
}




var SaveCanvasW = 0;
var SaveCanvasH = 0;

var SaveCanvasObject;
var SaveCanvasContext;
var SaveCanvasData;
var SaveCanvasDataR;
var SaveCanvasDataG;
var SaveCanvasDataB;

var SavePointer;

var SaveDrawRect = function(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
};

var SaveDrawRectBlend = function(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB, Blend)
{
};


var SavePaintRowC = 100;

function SaveInfo()
{
    if ((SaveCanvasW == 0) || (SaveCanvasH == 0))
    {
        document.getElementById("SaveInfo").innerHTML = "none";
    }
    else
    {
        var OutW = Math.round(SaveCanvasW * SET_SaveStepN / SET_SaveStepD);
        var OutH = Math.round(SaveCanvasH * SET_SaveZoomN / SET_SaveZoomD);
        
        var RealSampleRate = CurrentSamplerate / SET_SampleDecimation;
        var RealStep = Math.pow(2, DISP_Step);
        RealSampleRate = RealSampleRate / RealStep;
        
        SavePaintRowC = Math.ceil(RealSampleRate / 2);
        
        var LenSec = Math.floor(SET_SaveLength / RealSampleRate);
        var LenMin = Math.floor(LenSec / 60);
        LenSec = LenSec % 60;
        
        if (LenSec < 10)
        {
            LenSec = "0" + LenSec;
        }
        
        document.getElementById("SaveInfo").innerHTML = OutW + "x" + OutH + "; " + LenMin + ":" + LenSec;
    }
}


var SaveDownloadOutW;
var SaveDownloadOutH;
var SaveDownloadMode;
var SaveDownloadDimChanged;

function SaveDownload(Mode)
{
    SaveDownloadMode = Mode;
    if ((SaveCanvasW <= 0 || (SaveCanvasH <= 0)))
    {
        return;
    }
    var TempObj = document.getElementById("savedisplay1");
    var TempSObj = document.getElementById("savedisplay2");
    var SaveStripSize = 0;
    if (SaveDownloadMode == 1)
    {
        SaveDownloadOutW = Math.round(SaveCanvasW * SET_SaveStepN / SET_SaveStepD) + SET_SaveStripSize + SET_SaveStripSize;
        SaveStripSize = SET_SaveStripSize;
    }
    if (SaveDownloadMode == 2)
    {
        SaveDownloadOutW = Math.round(SaveCanvasW * SET_SaveStepN / SET_SaveStepD);
    }
    SaveDownloadOutH = Math.round(SaveCanvasH * SET_SaveZoomN / SET_SaveZoomD);
    SaveDownloadDimChanged = false;
    
    if ((SET_SaveOrientation == 1) || (SET_SaveOrientation == 3) || (SET_SaveOrientation == 4) || (SET_SaveOrientation == 6))
    {
        if (SaveDownloadMode == 1)
        {
            SaveDownloadOutH = Math.round(SaveCanvasW * SET_SaveStepN / SET_SaveStepD) + SET_SaveStripSize + SET_SaveStripSize;
        }
        if (SaveDownloadMode == 2)
        {
            SaveDownloadOutH = Math.round(SaveCanvasW * SET_SaveStepN / SET_SaveStepD);
        }
        SaveDownloadOutW = Math.round(SaveCanvasH * SET_SaveZoomN / SET_SaveZoomD);
        SaveDownloadDimChanged = true;
    }
    
    TempObj.width = SaveDownloadOutW;
    TempObj.height = SaveDownloadOutH;


    if (SaveDownloadDimChanged)
    {
        ScaleCalcStrip(SaveDownloadOutW, SaveDownloadOutW, 0);
        TempSObj.width = SaveDownloadOutW;
        TempSObj.height = 1;
    }
    else
    {
        ScaleCalcStrip(SaveDownloadOutH, SaveDownloadOutH, 0);
        TempSObj.width = 1;
        TempSObj.height = SaveDownloadOutH;
    }
    var TempSCtx = TempSObj.getContext('2d');
    var TempSData = TempSCtx.getImageData(0, 0, TempSObj.width, TempSObj.height);
    DrawClear(TempSData, TempSObj.width, TempSObj.height);

    
    switch (SET_SaveOrientation)
    {
        case 0: SaveDrawRect = DrawRect0; SaveDrawRectBlend = DrawRectBlend0; break;
        case 1: SaveDrawRect = DrawRect1; SaveDrawRectBlend = DrawRectBlend1; break;
        case 2: SaveDrawRect = DrawRect2; SaveDrawRectBlend = DrawRectBlend2; break;
        case 3: SaveDrawRect = DrawRect3; SaveDrawRectBlend = DrawRectBlend3; break;
        case 4: SaveDrawRect = DrawRect4; SaveDrawRectBlend = DrawRectBlend4; break;
        case 5: SaveDrawRect = DrawRect5; SaveDrawRectBlend = DrawRectBlend5; break;
        case 6: SaveDrawRect = DrawRect6; SaveDrawRectBlend = DrawRectBlend6; break;
        case 7: SaveDrawRect = DrawRect7; SaveDrawRectBlend = DrawRectBlend7; break;
    }

    var TempCtx = TempObj.getContext('2d');
    var TempData = TempCtx.getImageData(0, 0, TempObj.width, TempObj.height);
    DrawClear(TempData, TempObj.width, TempObj.height);
    DrawRefresh(SaveCanvasContext, SaveCanvasData);
    
    var Offset = 0;
    var SaveCanvasH_ = Math.round(SaveCanvasH / SET_SaveZoomD);
    var SaveCanvasW_ = Math.round(SaveCanvasW / SET_SaveStepD);



    var StripVals = [];
    for (var i = 0; i < ScaleStripColor.length; i++)
    {
        var Y__ = ScaleStripColor[i][0];

        var H__ = ScaleStripColor[i][1];

        if ((SaveDownloadMode == 1) && (SET_SaveStripSize > 0))
        {
            SaveDrawRect(TempData, SaveDownloadOutW, SaveDownloadOutH, 0, Y__, SET_SaveStripSize, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
            if (SaveDownloadDimChanged)
            {
                SaveDrawRect(TempData, SaveDownloadOutW, SaveDownloadOutH, SaveDownloadOutH - SET_SaveStripSize, Y__, SET_SaveStripSize, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
            }
            else
            {
                SaveDrawRect(TempData, SaveDownloadOutW, SaveDownloadOutH, SaveDownloadOutW - SET_SaveStripSize, Y__, SET_SaveStripSize, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
            }
        }
        if (SaveDownloadDimChanged)
        {
            SaveDrawRect(TempSData, SaveDownloadOutW, 1, 0, Y__, 1, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
        }
        else
        {
            SaveDrawRect(TempSData, 1, SaveDownloadOutH, 0, Y__, 1, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
        }
        for (var ii = 0; ii < H__; ii++)
        {
            StripVals[Y__ + ii + 1] = [ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]];
        }
    }
    StripVals[0] = [StripVals[1][0], StripVals[1][1], StripVals[1][2]];
    if (StripVals.length > (SaveCanvasH_ * SET_SaveZoomN + 1))
    {
        StripVals[SaveCanvasH_ * SET_SaveZoomN + 1] = [StripVals[SaveCanvasH_ * SET_SaveZoomN][0], StripVals[SaveCanvasH_ * SET_SaveZoomN][1], StripVals[SaveCanvasH_ * SET_SaveZoomN][2]];
    }

    for (var Y = 0; Y < SaveCanvasH_; Y++)
    {
        var X0 = 0;
        for (var X = 0; X < SaveCanvasW; X += SET_SaveStepD)
        {
            if (X >= (SaveCanvasW - SavePointer))
            {
                Offset = (Y * SaveCanvasW * SET_SaveZoomD + X - SaveCanvasW + SavePointer) << 2;
            }
            else
            {
                Offset = (Y * SaveCanvasW * SET_SaveZoomD + X + SavePointer) << 2;
            }
            
            for (var II = 0; II < SET_SaveZoomD; II++)
            {
                var TempR = 0;
                var TempG = 0;
                var TempB = 0;

                for (var I = 0; I < SET_SaveStepD; I++)
                {
                    TempR += SaveCanvasData.data[Offset + 0];
                    TempG += SaveCanvasData.data[Offset + 1];
                    TempB += SaveCanvasData.data[Offset + 2];
                    Offset += 4;
                }
                Offset -= (SET_SaveStepD * 4);
                Offset += (SaveCanvasW * 4);

                TempR = TempR / SET_SaveStepD;
                TempG = TempG / SET_SaveStepD;
                TempB = TempB / SET_SaveStepD;

                for (var I = 0; I < SET_SaveZoomN; I++)
                {
                    var StripPos = Y * SET_SaveZoomN + I + 1;
                    var TempR0 = Math.round(TempR);
                    var TempG0 = Math.round(TempG);
                    var TempB0 = Math.round(TempB);
                    SaveDrawRect(TempData, SaveDownloadOutW, SaveDownloadOutH, X0 * SET_SaveStepN + SaveStripSize, Y * SET_SaveZoomN + I, SET_SaveStepN, 1, TempR0, TempG0, TempB0);
                }
            }
            X0++;
        }
    }
    
    
    for (var i = 0; i < ScaleStripColor.length; i++)
    {
        var Y__ = ScaleStripColor[i][0];

        var H__ = ScaleStripColor[i][1];

        var BlendMode = ScaleStripColor[i][5];
        var BlendValue = ScaleStripColor[i][6];
        switch (BlendMode)
        {
            case 0:
            {
                SaveDrawRectBlend(TempData, SaveDownloadOutW, SaveDownloadOutH, 0, Y__, SaveDownloadOutW, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4], BlendValue);
                break;
            }
            case 1:
            {
                if (BlendValue > H__)
                {
                    BlendValue = H__;
                }
                SaveDrawRect(TempData, SaveDownloadOutW, SaveDownloadOutH, 0, Y__, SaveDownloadOutW, BlendValue, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                SaveDrawRect(TempData, SaveDownloadOutW, SaveDownloadOutH, 0, Y__ + H__ - BlendValue, SaveDownloadOutW, BlendValue, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                break;
            }
            case 2:
            {
                if (BlendValue > H__)
                {
                    BlendValue = H__;
                }
                var BlendPos = Math.floor((H__ - BlendValue) / 2);
                SaveDrawRect(TempData, SaveDownloadOutW, SaveDownloadOutH, 0, Y__ + BlendPos, SaveDownloadOutW, BlendValue, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                break;
            }
        }
    }
    
    
    DrawRefresh(TempCtx, TempData);
    DrawRefresh(TempSCtx, TempSData);

    if (SaveDownloadMode == 1)
    {
        TempObj.toBlob(SaveDownloadCallback, "image/png", 0);
    }
    if (SaveDownloadMode == 2)
    {
        TempObj.toBlob(SaveDownloadCallback, "image/png", 0);
    }
}

function SaveDownloadStrip()
{
    var TempSObj = document.getElementById("savedisplay2");
    TempSObj.toBlob(SaveDownloadCallbackX, "image/png", 0);
}


var SaveDownloadUrl;
var SaveDownloadUrlX;

function SaveDownloadCallback(Temp)
{
    if (SaveDownloadMode == 1)
    {
        SaveDownloadUrl = URL.createObjectURL(Temp);
        var link = document.getElementById("savelink");
        link.href = SaveDownloadUrl;
        link.download = 'image.png';
        link.click();
    }
    if (SaveDownloadMode == 2)
    {
        SaveDownloadUrl = URL.createObjectURL(Temp);
        SaveDownloadStrip();
        return;
    }
}
function SaveDownloadCallbackX(Temp)
{
    SaveDownloadUrlX = URL.createObjectURL(Temp);
    {
        var win = window.open("", "");
        if (!win)
        {
            return;
        }
        var SpectrumViewer = "";
        SpectrumViewer += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
        SpectrumViewer += "<meta charset=\"utf-8\">";
        SpectrumViewer += "<title>Spectrogram</title>";
        win.document.head.innerHTML = SpectrumViewer;

        SpectrumViewer = "";
        SpectrumViewer += "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">";

        SpectrumViewer += "<div style=\"background-color:#000000\">";

        
        SpectrumViewer += "<div class=\"divTable\">";

        if (SaveDownloadDimChanged)
        {
            if (SET_SaveStripPercent > 0)
            {
                SpectrumViewer += "<div class=\"divTableRow\" style=\"height:" + SET_SaveStripPercent + "%\">";
                SpectrumViewer += "<div class=\"divTableCell\" style=\"width:100%\">";
                SpectrumViewer += "<div style=\"background-color:#000000;overflow:hidden;white-space:nowrap;height:100%;width:" + (SaveDownloadOutW + SET_SaveStripMargin) + "px\">";
                SpectrumViewer += "<img style=\"height:100px;width:" + SaveDownloadOutW + "px\" src=\"" + SaveDownloadUrlX + "\">";
                SpectrumViewer += "</div>";
                SpectrumViewer += "</div>";
                SpectrumViewer += "</div>";
            }

            SpectrumViewer += "<div class=\"divTableRow\" style=\"width:100%;height:" + (100 - SET_SaveStripPercent - SET_SaveStripPercent) + "%\">";
            SpectrumViewer += "<div class=\"divTableCell\" style=\"width:100%\">";
            SpectrumViewer += "<div style=\"background-color:#000000;overflow-y:scroll;white-space:nowrap;height:100%;width:" + (SaveDownloadOutW + SET_SaveStripMargin) + "px\">";
            SpectrumViewer += "<img src=\"" + SaveDownloadUrl + "\">";
            SpectrumViewer += "</div>";
            SpectrumViewer += "</div>";
            SpectrumViewer += "</div>";

            if (SET_SaveStripPercent > 0)
            {
                SpectrumViewer += "<div class=\"divTableRow\" style=\"height:" + SET_SaveStripPercent + "%\">";
                SpectrumViewer += "<div class=\"divTableCell\" style=\"width:100%\">";
                SpectrumViewer += "<div style=\"background-color:#000000;overflow:hidden;white-space:nowrap;height:100%;width:" + (SaveDownloadOutW + SET_SaveStripMargin) + "px\">";
                SpectrumViewer += "<img style=\"height:100px;width:" + SaveDownloadOutW + "px\" src=\"" + SaveDownloadUrlX + "\">";
                SpectrumViewer += "</div>";
                SpectrumViewer += "</div>";
                SpectrumViewer += "</div>";
            }
        }
        else
        {
            SpectrumViewer += "<div class=\"divTableRow\" style=\"height:100%\">";

            if (SET_SaveStripPercent > 0)
            {
                SpectrumViewer += "<div class=\"divTableCell\" style=\"width:" + SET_SaveStripPercent + "%\">";
                SpectrumViewer += "<div style=\"background-color:#000000;overflow:hidden;white-space:nowrap;width:100%;height:" + (SaveDownloadOutH + SET_SaveStripMargin) + "px\">";
                SpectrumViewer += "<img style=\"width:100%;height:" + SaveDownloadOutH + "px\" src=\"" + SaveDownloadUrlX + "\">";
                SpectrumViewer += "</div>";
                SpectrumViewer += "</div>";
            }

            SpectrumViewer += "<div class=\"divTableCell\" style=\"width:" + (100 - SET_SaveStripPercent - SET_SaveStripPercent) + "%\">";
            SpectrumViewer += "<div style=\"background-color:#000000;overflow-x:scroll;white-space:nowrap;width:100%;height:" + (SaveDownloadOutH + SET_SaveStripMargin) + "px\">";
            SpectrumViewer += "<img src=\"" + SaveDownloadUrl + "\">";
            SpectrumViewer += "</div>";
            SpectrumViewer += "</div>";

            if (SET_SaveStripPercent > 0)
            {
                SpectrumViewer += "<div class=\"divTableCell\" style=\"width:" + SET_SaveStripPercent + "%\">";
                SpectrumViewer += "<div style=\"background-color:#000000;overflow:hidden;white-space:nowrap;width:100%;height:" + (SaveDownloadOutH + SET_SaveStripMargin) + "px\">";
                SpectrumViewer += "<img style=\"width:100%;height:" + SaveDownloadOutH + "px\" src=\"" + SaveDownloadUrlX + "\">";
                SpectrumViewer += "</div>";
                SpectrumViewer += "</div>";
            }

            SpectrumViewer += "</div>";
        }

        SpectrumViewer += "</div>";

        SpectrumViewer += "</div>";


        win.document.body.innerHTML = SpectrumViewer;

        win.document.write(SpectrumViewer);
        win.focus();
    }
}






function SaveInit()
{
    SaveSettingsGet();
    SaveCanvasObject = document.getElementById("savedisplay");
    SavePointer = 0;
}

function SavePrepare(NewSize)
{
    if ((SaveCanvasH == NewSize) && (SaveCanvasW == SET_SaveLength))
    {
        return;
    }
    SaveCanvasH = NewSize;
    SaveCanvasW = SET_SaveLength;
    SaveCanvasObject.width = SaveCanvasW;
    SaveCanvasObject.height = SaveCanvasH;
    SaveCanvasContext = SaveCanvasObject.getContext('2d');
    SaveCanvasData = SaveCanvasContext.createImageData(SaveCanvasW, SaveCanvasH);
    DrawClear(SaveCanvasData, SaveCanvasW, SaveCanvasH);
    SaveInfo();
}

var SavePxlBufR = [];
var SavePxlBufG = [];
var SavePxlBufB = [];

function SavePaintPxl(I, R, G, B)
{
    SavePxlBufR[I] = R;
    SavePxlBufG[I] = G;
    SavePxlBufB[I] = B;
}


var SavePaintRowI = 0;
var SavePaintRowI_ = 0;



function SavePaintRowBtn()
{
    if (SavePaintRowI_ != (SavePaintRowI > 0))
    {
        SavePaintRowI_ = (SavePaintRowI > 0);
        if (SavePaintRowI_)
        {
            document.getElementById("SaveDownloadBtn1").value = "Please wait";
            document.getElementById("SaveDownloadBtn2").value = "Please wait";
        }
        else
        {
            document.getElementById("SaveDownloadBtn1").value = "Save spectrogram";
            document.getElementById("SaveDownloadBtn2").value = "Show spectrogram";
        }
    }
}

function SavePaintRowPause()
{
    if (SavePaintRowI > 5)
    {
        SavePaintRowI = 5;
    }
    if (SavePaintRowI > 0)
    {
        SavePaintRowI--;
    }
    SavePaintRowBtn();
}

function SavePaintRow(Place, DrawLength, DrawStep)
{
    SavePrepare(DrawLength);

    if (Place >= SaveCanvasW)
    {
        return;
    }
    
    var SavePointer_ = SavePointer - Place;
    if (SavePointer_ < 0)
    {
        SavePointer_ = SavePointer_ + SaveCanvasW;
    }

    var DrawStep_ = DrawStep;
    while (DrawStep_ > 0)
    {
        for (var I = 0; I < SaveCanvasH; I++)
        {
            SaveDrawPxl(SavePointer_, SaveCanvasH - 1 - I, SavePxlBufR[I], SavePxlBufG[I], SavePxlBufB[I]);
        }
        SavePointer_++;
        if (SavePointer_ >= SaveCanvasW)
        {
            SavePointer_ = 0;
        }
        DrawStep_--;
    }

    if (Place == 0)
    {
        var DrawStep_ = DrawStep;
        while (DrawStep_ > 0)
        {
            SavePointer++;
            if (SavePointer >= SaveCanvasW)
            {
                SavePointer = 0;
            }
            if (SavePaintRowI > SavePaintRowC)
            {
                SavePaintRowI = SavePaintRowC;
            }
            if (SavePaintRowI > 0)
            {
                SavePaintRowI--;
            }
            DrawStep_--;
        }
    }
    else
    {
        SavePaintRowI = SavePaintRowC;
    }
    SavePaintRowBtn();
}

function SaveDrawPxl(X, Y, ColorR, ColorG, ColorB)
{
    var Offset = (Y * SaveCanvasW + X) << 2;
    SaveCanvasData.data[Offset + 0] = ColorR;
    SaveCanvasData.data[Offset + 1] = ColorG;
    SaveCanvasData.data[Offset + 2] = ColorB;
}

