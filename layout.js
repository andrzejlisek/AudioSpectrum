var SET_Layout_Order = DataGetDefault("SET_Layout_Order", "01234567");

var LayoutName = ["AppSpectrogram", "AppOscilloscope", "AppFilter", "AppProcess", "AppPlaylist", "AppSave", "AppSpecMarker", "AppSpecStrip"];

var SET_Layout_SizeV = [];
var SET_Layout_SizeU = [];
SET_Layout_SizeV[0] = DataGetIDefault("SET_Layout_SpectrogramSizeV", 50);
SET_Layout_SizeU[0] = DataGetIDefault("SET_Layout_SpectrogramSizeU", 1);
SET_Layout_SizeV[1] = DataGetIDefault("SET_Layout_OscilloscopeSizeV", 50);
SET_Layout_SizeU[1] = DataGetIDefault("SET_Layout_OscilloscopeSizeU", 1);
SET_Layout_SizeV[2] = DataGetIDefault("SET_Layout_FilterSizeV", 50);
SET_Layout_SizeU[2] = DataGetIDefault("SET_Layout_FilterSizeU", 1);
SET_Layout_SizeV[3] = DataGetIDefault("SET_Layout_ProcessSizeV", 50);
SET_Layout_SizeU[3] = DataGetIDefault("SET_Layout_ProcessSizeU", 1);
SET_Layout_SizeV[4] = DataGetIDefault("SET_Layout_PlaylistSizeV", 50);
SET_Layout_SizeU[4] = DataGetIDefault("SET_Layout_PlaylistSizeU", 1);
SET_Layout_SizeV[5] = DataGetIDefault("SET_Layout_SaveImageSizeV", 50);
SET_Layout_SizeU[5] = DataGetIDefault("SET_Layout_SaveImageSizeU", 1);
SET_Layout_SizeV[6] = DataGetIDefault("SET_Layout_SpecMarkerSizeV", 50);
SET_Layout_SizeU[6] = DataGetIDefault("SET_Layout_SpecMarkerSizeU", 1);
SET_Layout_SizeV[7] = DataGetIDefault("SET_Layout_SpecStripSizeV", 50);
SET_Layout_SizeU[7] = DataGetIDefault("SET_Layout_SpecStripSizeU", 1);

function SetLayoutSize(O, V, U)
{
    if (V > 0)
    {
        document.getElementById(O).style["display"] = "block";
    }
    else
    {
        document.getElementById(O).style["display"] = "none";
    }
    if (U == 0)
    {
        document.getElementById(O).style["height"] = V + "px";
    }
    if (U == 1)
    {
        document.getElementById(O).style["height"] = V + "vh";
    }
}

function LayoutSwap(node1_, node2_)
{
    var node1 = document.getElementById(node1_);
    var node2 = document.getElementById(node2_);
    const afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;
    node1.replaceWith(node2);
    parent.insertBefore(node1, afterNode2);
}

function LayoutOrder(node1_, node2_)
{
    var node1 = document.getElementById(node1_);
    var node2 = document.getElementById(node2_);
//    node2.before(node1);
    node1.after(node2);
}

function SetLayout()
{
    var LayoutNum = LayoutName.length;
    LayoutOrder_ = "";
    for (var I = 0; I < SET_Layout_Order.length; I++)
    {
        if (parseInt(SET_Layout_Order[I]) < LayoutNum)
        {
            if (LayoutOrder_.indexOf(SET_Layout_Order[I]) < 0)
            {
                LayoutOrder_ = LayoutOrder_ + SET_Layout_Order[I];
            }
        }
    }

    var LayoutOrder__ = LayoutOrder_;

    for (var I = 0; I < LayoutNum; I++)
    {
        if (LayoutOrder_.indexOf(I.toString()[0]) < 0)
        {
            LayoutOrder_ = LayoutOrder_ + I.toString()[0];
        }
    }

    for (var I = 0; I < (LayoutOrder_.length - 1); I++)
    {
        var N1 = LayoutName[parseInt(LayoutOrder_[I])];
        var N2 = LayoutName[parseInt(LayoutOrder_[I + 1])];
        LayoutOrder(N1, N2);
    }

    WORK_Spectrum = ((SET_Layout_SizeV[0] > 0) ? true : false);
    WORK_Scope = ((SET_Layout_SizeV[1] > 0) ? true : false);

    for (var I = 0; I < LayoutNum; I++)
    {
        var I_ = "" + I + "";
        if (LayoutOrder__.indexOf(I_) >= 0)
        {
            SetLayoutSize(LayoutName[I], SET_Layout_SizeV[I], SET_Layout_SizeU[I]);
        }
        else
        {
            SetLayoutSize(LayoutName[I], 0, 0);
        }
    }

    SpectrogramSetLayout();
    ScopeSetLayout();
    FilterSetLayout();
}

function LayoutSettingsGet()
{
    document.getElementById("xSET_Layout_Order").value = SET_Layout_Order;
    document.getElementById("xSET_Layout_SpectrogramSizeV").value = SET_Layout_SizeV[0];
    document.getElementById("xSET_Layout_SpectrogramSizeU").selectedIndex = SET_Layout_SizeU[0];
    document.getElementById("xSET_Layout_OscilloscopeSizeV").value = SET_Layout_SizeV[1];
    document.getElementById("xSET_Layout_OscilloscopeSizeU").selectedIndex = SET_Layout_SizeU[1];
    document.getElementById("xSET_Layout_FilterSizeV").value = SET_Layout_SizeV[2];
    document.getElementById("xSET_Layout_FilterSizeU").selectedIndex = SET_Layout_SizeU[2];
    document.getElementById("xSET_Layout_ProcessSizeV").value = SET_Layout_SizeV[3];
    document.getElementById("xSET_Layout_ProcessSizeU").selectedIndex = SET_Layout_SizeU[3];
    document.getElementById("xSET_Layout_PlaylistSizeV").value = SET_Layout_SizeV[4];
    document.getElementById("xSET_Layout_PlaylistSizeU").selectedIndex = SET_Layout_SizeU[4];
    document.getElementById("xSET_Layout_SaveImageSizeV").value = SET_Layout_SizeV[5];
    document.getElementById("xSET_Layout_SaveImageSizeU").selectedIndex = SET_Layout_SizeU[5];
    document.getElementById("xSET_Layout_SpecMarkerSizeV").value = SET_Layout_SizeV[6];
    document.getElementById("xSET_Layout_SpecMarkerSizeU").selectedIndex = SET_Layout_SizeU[6];
    document.getElementById("xSET_Layout_SpecStripSizeV").value = SET_Layout_SizeV[7];
    document.getElementById("xSET_Layout_SpecStripSizeU").selectedIndex = SET_Layout_SizeU[7];
}

function LayoutSettingsSet()
{
    SET_Layout_Order = document.getElementById("xSET_Layout_Order").value;
    SET_Layout_SizeV[0] = Limit(document.getElementById("xSET_Layout_SpectrogramSizeV").value, 0, 1000000);
    SET_Layout_SizeU[0] = document.getElementById("xSET_Layout_SpectrogramSizeU").selectedIndex;
    SET_Layout_SizeV[1] = Limit(document.getElementById("xSET_Layout_OscilloscopeSizeV").value, 0, 1000000);
    SET_Layout_SizeU[1] = document.getElementById("xSET_Layout_OscilloscopeSizeU").selectedIndex;
    SET_Layout_SizeV[2] = Limit(document.getElementById("xSET_Layout_FilterSizeV").value, 0, 1000000);
    SET_Layout_SizeU[2] = document.getElementById("xSET_Layout_FilterSizeU").selectedIndex;
    SET_Layout_SizeV[3] = Limit(document.getElementById("xSET_Layout_ProcessSizeV").value, 0, 1000000);
    SET_Layout_SizeU[3] = document.getElementById("xSET_Layout_ProcessSizeU").selectedIndex;
    SET_Layout_SizeV[4] = Limit(document.getElementById("xSET_Layout_PlaylistSizeV").value, 0, 1000000);
    SET_Layout_SizeU[4] = document.getElementById("xSET_Layout_PlaylistSizeU").selectedIndex;
    SET_Layout_SizeV[5] = Limit(document.getElementById("xSET_Layout_SaveImageSizeV").value, 0, 1000000);
    SET_Layout_SizeU[5] = document.getElementById("xSET_Layout_SaveImageSizeU").selectedIndex;
    SET_Layout_SizeV[6] = Limit(document.getElementById("xSET_Layout_SpecMarkerSizeV").value, 0, 1000000);
    SET_Layout_SizeU[6] = document.getElementById("xSET_Layout_SpecMarkerSizeU").selectedIndex;
    SET_Layout_SizeV[7] = Limit(document.getElementById("xSET_Layout_SpecStripSizeV").value, 0, 1000000);
    SET_Layout_SizeU[7] = document.getElementById("xSET_Layout_SpecStripSizeU").selectedIndex;

    DataSetI("SET_Layout_Order", SET_Layout_Order);
    DataSetI("SET_Layout_SpectrogramSizeV", SET_Layout_SizeV[0]);
    DataSetI("SET_Layout_SpectrogramSizeU", SET_Layout_SizeU[0]);
    DataSetI("SET_Layout_OscilloscopeSizeV", SET_Layout_SizeV[1]);
    DataSetI("SET_Layout_OscilloscopeSizeU", SET_Layout_SizeU[1]);
    DataSetI("SET_Layout_FilterSizeV", SET_Layout_SizeV[2]);
    DataSetI("SET_Layout_FilterSizeU", SET_Layout_SizeU[2]);
    DataSetI("SET_Layout_ProcessSizeV", SET_Layout_SizeV[3]);
    DataSetI("SET_Layout_ProcessSizeU", SET_Layout_SizeU[3]);
    DataSetI("SET_Layout_PlaylistSizeV", SET_Layout_SizeV[4]);
    DataSetI("SET_Layout_PlaylistSizeU", SET_Layout_SizeU[4]);
    DataSetI("SET_Layout_SaveImageSizeV", SET_Layout_SizeV[5]);
    DataSetI("SET_Layout_SaveImageSizeU", SET_Layout_SizeU[5]);
    DataSetI("SET_Layout_SpecMarkerSizeV", SET_Layout_SizeV[6]);
    DataSetI("SET_Layout_SpecMarkerSizeU", SET_Layout_SizeU[6]);
    DataSetI("SET_Layout_SpecStripSizeV", SET_Layout_SizeV[7]);
    DataSetI("SET_Layout_SpecStripSizeU", SET_Layout_SizeU[7]);

    SetLayout();
}

