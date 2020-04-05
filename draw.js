const ArrU = String.fromCharCode(708);
const ArrD = String.fromCharCode(709);
const ArrR = String.fromCharCode(707);
const ArrL = String.fromCharCode(706);
const ArrU_ = "&#708;";
const ArrD_ = "&#709;";
const ArrR_ = "&#707;";
const ArrL_ = "&#706;";


/*
Base	X	Y	XY	Flip	90clk	90anti	180
0	7	5	4	6	1	3	2
1	6	4	5	7	2	0	3
2	5	7	6	4	3	1	0
3	4	6	7	5	0	2	1
4	3	1	0	2	7	5	6
5	2	0	1	3	4	6	7
6	1	3	2	0	5	7	4
7	0	2	3	1	6	4	5
*/

var DrawOrientationTransform_ = new Array(8)
DrawOrientationTransform_[0] = [7, 5, 4, 6, 1, 3, 2];
DrawOrientationTransform_[1] = [6, 4, 5, 7, 2, 0, 3];
DrawOrientationTransform_[2] = [5, 7, 6, 4, 3, 1, 0];
DrawOrientationTransform_[3] = [4, 6, 7, 5, 0, 2, 1];
DrawOrientationTransform_[4] = [3, 1, 0, 2, 7, 5, 6];
DrawOrientationTransform_[5] = [2, 0, 1, 3, 4, 6, 7];
DrawOrientationTransform_[6] = [1, 3, 2, 0, 5, 7, 4];
DrawOrientationTransform_[7] = [0, 2, 3, 1, 6, 4, 5];

function DrawOrientationRot(N)
{
    if ((N == 1) || (N == 3) || (N == 4) || (N == 6))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function DrawOrientationTransform(N, Id)
{
    return DrawOrientationTransform_[N][Id];
}

var DrawRect = function(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
}

function DrawRect0(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasW) { W = CanvasW - X; }
    if (Y + H > CanvasH) { H = CanvasH - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        for (var XX = 0; XX < W; XX++)
        {
            var Offset = ((Y + YY) * CanvasW + (X + XX)) * 4;
            CanvasD.data[Offset + 0] = ColorR;
            CanvasD.data[Offset + 1] = ColorG;
            CanvasD.data[Offset + 2] = ColorB;
            CanvasD.data[Offset + 3] = 255;
        }
    }
}

function DrawRect1(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasH) { W = CanvasH - X; }
    if (Y + H > CanvasW) { H = CanvasW - Y; }
    for (var YY = 0; YY < W; YY++)
    {
        for (var XX = 0; XX < H; XX++)
        {
            var Offset = ((X + YY) * CanvasW + (CanvasW - H - Y + XX)) * 4;
            CanvasD.data[Offset + 0] = ColorR;
            CanvasD.data[Offset + 1] = ColorG;
            CanvasD.data[Offset + 2] = ColorB;
            CanvasD.data[Offset + 3] = 255;
        }
    }
}

function DrawRect2(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasW) { W = CanvasW - X; }
    if (Y + H > CanvasH) { H = CanvasH - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        for (var XX = 0; XX < W; XX++)
        {
            var Offset = ((CanvasH - H - Y + YY) * CanvasW + (CanvasW - W - X + XX)) * 4;
            CanvasD.data[Offset + 0] = ColorR;
            CanvasD.data[Offset + 1] = ColorG;
            CanvasD.data[Offset + 2] = ColorB;
            CanvasD.data[Offset + 3] = 255;
        }
    }
}

function DrawRect3(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasH) { W = CanvasH - X; }
    if (Y + H > CanvasW) { H = CanvasW - Y; }
    for (var YY = 0; YY < W; YY++)
    {
        for (var XX = 0; XX < H; XX++)
        {
            var Offset = ((CanvasH - W - X + YY) * CanvasW + (Y + XX)) * 4;
            CanvasD.data[Offset + 0] = ColorR;
            CanvasD.data[Offset + 1] = ColorG;
            CanvasD.data[Offset + 2] = ColorB;
            CanvasD.data[Offset + 3] = 255;
        }
    }
}

function DrawRect4(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasH) { W = CanvasH - X; }
    if (Y + H > CanvasW) { H = CanvasW - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        for (var XX = 0; XX < W; XX++)
        {
            var Offset = ((X + XX) * CanvasW + (Y + YY)) * 4;
            CanvasD.data[Offset + 0] = ColorR;
            CanvasD.data[Offset + 1] = ColorG;
            CanvasD.data[Offset + 2] = ColorB;
            CanvasD.data[Offset + 3] = 255;
        }
    }
}

function DrawRect5(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasW) { W = CanvasW - X; }
    if (Y + H > CanvasH) { H = CanvasH - Y; }
    for (var YY = 0; YY < W; YY++)
    {
        for (var XX = 0; XX < H; XX++)
        {
            var Offset = ((CanvasH - H - Y + XX) * CanvasW + (X + YY)) * 4;
            CanvasD.data[Offset + 0] = ColorR;
            CanvasD.data[Offset + 1] = ColorG;
            CanvasD.data[Offset + 2] = ColorB;
            CanvasD.data[Offset + 3] = 255;
        }
    }
}

function DrawRect6(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasH) { W = CanvasH - X; }
    if (Y + H > CanvasW) { H = CanvasW - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        for (var XX = 0; XX < W; XX++)
        {
            var Offset = ((CanvasH - W - X + XX) * CanvasW + (CanvasW - H - Y + YY)) * 4;
            CanvasD.data[Offset + 0] = ColorR;
            CanvasD.data[Offset + 1] = ColorG;
            CanvasD.data[Offset + 2] = ColorB;
            CanvasD.data[Offset + 3] = 255;
        }
    }
}

function DrawRect7(CanvasD, CanvasW, CanvasH, X, Y, W, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { W = W + X; X = 0; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (X + W > CanvasW) { W = CanvasW - X; }
    if (Y + H > CanvasH) { H = CanvasH - Y; }
    for (var YY = 0; YY < W; YY++)
    {
        for (var XX = 0; XX < H; XX++)
        {
            var Offset = ((Y + XX) * CanvasW + (CanvasW - W - X + YY)) * 4;
            CanvasD.data[Offset + 0] = ColorR;
            CanvasD.data[Offset + 1] = ColorG;
            CanvasD.data[Offset + 2] = ColorB;
            CanvasD.data[Offset + 3] = 255;
        }
    }
}


var DrawRectX = function(CanvasD, CanvasW, CanvasH, X, Y, W, ColorR, ColorG, ColorB)
{
}

function DrawRectX0(CanvasD, CanvasW, CanvasH, X, Y, W, ColorR, ColorG, ColorB)
{
    if (Y < 0) { return; }
    if (Y + 1 > CanvasH) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasW) { W = CanvasW - X; }
    for (var XX = 0; XX < W; XX++)
    {
        var Offset = ((Y) * CanvasW + (X + XX)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectX1(CanvasD, CanvasW, CanvasH, X, Y, W, ColorR, ColorG, ColorB)
{
    if (Y < 0) { return; }
    if (Y + 1 > CanvasW) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasH) { W = CanvasH - X; }
    for (var YY = 0; YY < W; YY++)
    {
        var Offset = ((X + YY) * CanvasW + (CanvasW - 1 - Y)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectX2(CanvasD, CanvasW, CanvasH, X, Y, W, ColorR, ColorG, ColorB)
{
    if (Y < 0) { return; }
    if (Y + 1 > CanvasH) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasW) { W = CanvasW - X; }
    for (var XX = 0; XX < W; XX++)
    {
        var Offset = ((CanvasH - 1 - Y) * CanvasW + (CanvasW - W - X + XX)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectX3(CanvasD, CanvasW, CanvasH, X, Y, W, ColorR, ColorG, ColorB)
{
    if (Y < 0) { return; }
    if (Y + 1 > CanvasW) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasH) { W = CanvasH - X; }
    for (var YY = 0; YY < W; YY++)
    {
        var Offset = ((CanvasH - W - X + YY) * CanvasW + (Y)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectX4(CanvasD, CanvasW, CanvasH, X, Y, W, ColorR, ColorG, ColorB)
{
    if (Y < 0) { return; }
    if (Y + 1 > CanvasW) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasH) { W = CanvasH - X; }
    for (var XX = 0; XX < W; XX++)
    {
        var Offset = ((X + XX) * CanvasW + (Y)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectX5(CanvasD, CanvasW, CanvasH, X, Y, W, ColorR, ColorG, ColorB)
{
    if (Y < 0) { return; }
    if (Y + 1 > CanvasH) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasW) { W = CanvasW - X; }
    for (var YY = 0; YY < W; YY++)
    {
        var Offset = ((CanvasH - 1 - Y) * CanvasW + (X + YY)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectX6(CanvasD, CanvasW, CanvasH, X, Y, W, ColorR, ColorG, ColorB)
{
    if (Y < 0) { return; }
    if (Y + 1 > CanvasW) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasH) { W = CanvasH - X; }
    for (var XX = 0; XX < W; XX++)
    {
        var Offset = ((CanvasH - W - X + XX) * CanvasW + (CanvasW - 1 - Y)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectX7(CanvasD, CanvasW, CanvasH, X, Y, W, ColorR, ColorG, ColorB)
{
    if (Y < 0) { return; }
    if (Y + 1 > CanvasH) { return; }
    if (X < 0) { W = W + X; X = 0; }
    if (X + W > CanvasW) { W = CanvasW - X; }
    for (var YY = 0; YY < W; YY++)
    {
        var Offset = ((Y) * CanvasW + (CanvasW - W - X + YY)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

var DrawRectY = function(CanvasD, CanvasW, CanvasH, X, Y, H, ColorR, ColorG, ColorB)
{
}

function DrawRectY0(CanvasD, CanvasW, CanvasH, X, Y, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (X + 1 > CanvasW) { return; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (Y + H > CanvasH) { H = CanvasH - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        var Offset = ((Y + YY) * CanvasW + (X)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectY1(CanvasD, CanvasW, CanvasH, X, Y, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (X + 1 > CanvasH) { return; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (Y + H > CanvasW) { H = CanvasW - Y; }
    for (var XX = 0; XX < H; XX++)
    {
        var Offset = ((X) * CanvasW + (CanvasW - H - Y + XX)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectY2(CanvasD, CanvasW, CanvasH, X, Y, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (X + 1 > CanvasW) { return; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (Y + H > CanvasH) { H = CanvasH - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        var Offset = ((CanvasH - H - Y + YY) * CanvasW + (CanvasW - 1 - X)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectY3(CanvasD, CanvasW, CanvasH, X, Y, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (X + 1 > CanvasH) { return; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (Y + H > CanvasW) { H = CanvasW - Y; }
    for (var XX = 0; XX < H; XX++)
    {
        var Offset = ((CanvasH - 1 - X) * CanvasW + (Y + XX)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectY4(CanvasD, CanvasW, CanvasH, X, Y, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (X + 1 > CanvasH) { return; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (Y + H > CanvasW) { H = CanvasW - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        var Offset = ((X) * CanvasW + (Y + YY)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectY5(CanvasD, CanvasW, CanvasH, X, Y, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (X + 1 > CanvasW) { return; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (Y + H > CanvasH) { H = CanvasH - Y; }
    for (var XX = 0; XX < H; XX++)
    {
        var Offset = ((CanvasH - H - Y + XX) * CanvasW + (X)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectY6(CanvasD, CanvasW, CanvasH, X, Y, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (X + 1 > CanvasH) { return; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (Y + H > CanvasW) { H = CanvasW - Y; }
    for (var YY = 0; YY < H; YY++)
    {
        var Offset = ((CanvasH - 1 - X) * CanvasW + (CanvasW - H - Y + YY)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

function DrawRectY7(CanvasD, CanvasW, CanvasH, X, Y, H, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (X + 1 > CanvasW) { return; }
    if (Y < 0) { H = H + Y; Y = 0; }
    if (Y + H > CanvasH) { H = CanvasH - Y; }
    for (var XX = 0; XX < H; XX++)
    {
        var Offset = ((Y + XX) * CanvasW + (CanvasW - 1 - X)) * 4;
        CanvasD.data[Offset + 0] = ColorR;
        CanvasD.data[Offset + 1] = ColorG;
        CanvasD.data[Offset + 2] = ColorB;
        CanvasD.data[Offset + 3] = 255;
    }
}

var DrawPxl = function(CanvasD, CanvasW, CanvasH, X, Y, ColorR, ColorG, ColorB)
{
}

function DrawPxl0(CanvasD, CanvasW, CanvasH, X, Y, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (Y < 0) { return; }
    if (X + 1 > CanvasW) { return; }
    if (Y + 1 > CanvasH) { return; }
    var Offset = ((Y) * CanvasW + (X)) * 4;
    CanvasD.data[Offset + 0] = ColorR;
    CanvasD.data[Offset + 1] = ColorG;
    CanvasD.data[Offset + 2] = ColorB;
    CanvasD.data[Offset + 3] = 255;
}

function DrawPxl1(CanvasD, CanvasW, CanvasH, X, Y, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (Y < 0) { return; }
    if (X + 1 > CanvasH) { return; }
    if (Y + 1 > CanvasW) { return; }
    var Offset = ((X) * CanvasW + (CanvasW - 1 - Y)) * 4;
    CanvasD.data[Offset + 0] = ColorR;
    CanvasD.data[Offset + 1] = ColorG;
    CanvasD.data[Offset + 2] = ColorB;
    CanvasD.data[Offset + 3] = 255;
}

function DrawPxl2(CanvasD, CanvasW, CanvasH, X, Y, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (Y < 0) { return; }
    if (X + 1 > CanvasW) { return; }
    if (Y + 1 > CanvasH) { return; }
    var Offset = ((CanvasH - 1 - Y) * CanvasW + (CanvasW - 1 - X)) * 4;
    CanvasD.data[Offset + 0] = ColorR;
    CanvasD.data[Offset + 1] = ColorG;
    CanvasD.data[Offset + 2] = ColorB;
    CanvasD.data[Offset + 3] = 255;
}

function DrawPxl3(CanvasD, CanvasW, CanvasH, X, Y, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (Y < 0) { return; }
    if (X + 1 > CanvasH) { return; }
    if (Y + 1 > CanvasW) { return; }
    var Offset = ((CanvasH - 1 - X) * CanvasW + (Y)) * 4;
    CanvasD.data[Offset + 0] = ColorR;
    CanvasD.data[Offset + 1] = ColorG;
    CanvasD.data[Offset + 2] = ColorB;
    CanvasD.data[Offset + 3] = 255;
}

function DrawPxl4(CanvasD, CanvasW, CanvasH, X, Y, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (Y < 0) { return; }
    if (X + 1 > CanvasH) { return; }
    if (Y + 1 > CanvasW) { return; }
    var Offset = ((X) * CanvasW + (Y)) * 4;
    CanvasD.data[Offset + 0] = ColorR;
    CanvasD.data[Offset + 1] = ColorG;
    CanvasD.data[Offset + 2] = ColorB;
    CanvasD.data[Offset + 3] = 255;
}

function DrawPxl5(CanvasD, CanvasW, CanvasH, X, Y, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (Y < 0) { return; }
    if (X + 1 > CanvasW) { return; }
    if (Y + 1 > CanvasH) { return; }
    var Offset = ((CanvasH - 1 - Y) * CanvasW + (X)) * 4;
    CanvasD.data[Offset + 0] = ColorR;
    CanvasD.data[Offset + 1] = ColorG;
    CanvasD.data[Offset + 2] = ColorB;
    CanvasD.data[Offset + 3] = 255;
}

function DrawPxl6(CanvasD, CanvasW, CanvasH, X, Y, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (Y < 0) { return; }
    if (X + 1 > CanvasH) { return; }
    if (Y + 1 > CanvasW) { return; }
    var Offset = ((CanvasH - 1 - X) * CanvasW + (CanvasW - 1 - Y)) * 4;
    CanvasD.data[Offset + 0] = ColorR;
    CanvasD.data[Offset + 1] = ColorG;
    CanvasD.data[Offset + 2] = ColorB;
    CanvasD.data[Offset + 3] = 255;
}

function DrawPxl7(CanvasD, CanvasW, CanvasH, X, Y, ColorR, ColorG, ColorB)
{
    if (X < 0) { return; }
    if (Y < 0) { return; }
    if (X + 1 > CanvasW) { return; }
    if (Y + 1 > CanvasH) { return; }
    var Offset = ((Y) * CanvasW + (CanvasW - 1 - X)) * 4;
    CanvasD.data[Offset + 0] = ColorR;
    CanvasD.data[Offset + 1] = ColorG;
    CanvasD.data[Offset + 2] = ColorB;
    CanvasD.data[Offset + 3] = 255;
}

function DrawRefresh(CanvasC, CanvasD)
{
    CanvasC.putImageData(CanvasD, 0, 0);
}

function DrawSet(N)
{
    switch (N)
    {
        case 0: DrawRect = DrawRect0; DrawRectX = DrawRectX0; DrawRectY = DrawRectY0; DrawPxl = DrawPxl0; return false;
        case 1: DrawRect = DrawRect1; DrawRectX = DrawRectX1; DrawRectY = DrawRectY1; DrawPxl = DrawPxl1; return true;
        case 2: DrawRect = DrawRect2; DrawRectX = DrawRectX2; DrawRectY = DrawRectY2; DrawPxl = DrawPxl2; return false;
        case 3: DrawRect = DrawRect3; DrawRectX = DrawRectX3; DrawRectY = DrawRectY3; DrawPxl = DrawPxl3; return true;
        case 4: DrawRect = DrawRect4; DrawRectX = DrawRectX4; DrawRectY = DrawRectY4; DrawPxl = DrawPxl4; return true;
        case 5: DrawRect = DrawRect5; DrawRectX = DrawRectX5; DrawRectY = DrawRectY5; DrawPxl = DrawPxl5; return false;
        case 6: DrawRect = DrawRect6; DrawRectX = DrawRectX6; DrawRectY = DrawRectY6; DrawPxl = DrawPxl6; return true;
        case 7: DrawRect = DrawRect7; DrawRectX = DrawRectX7; DrawRectY = DrawRectY7; DrawPxl = DrawPxl7; return false;
    }
}
