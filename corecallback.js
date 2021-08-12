function AudioCallback(raw)
{
    /*if (performance.now() - raw[2] > SET_MaxCallbackLag)
    {
        return;
    }*/

    const OneIndex = 11;

    if (WORK_Spectrum && (WaveDisplayCanvasWX > 0) && (WaveDisplayCanvasH > 0))
    {
        var DISP_Mode_ = (DISP_Mode < 2) ? DISP_Mode : 0;
    
        var datacount = raw[1];
        var CanvasLineY = CanvasLine * CanvasLineNum * (DISP_Mode_ + 1);
        var DrawPointerX = 0;

        var CanvasHalf = Math.floor(WaveDisplayCanvasWX / 2);
        var CanvasHalfY = 0;

        var Zoom_ = Math.pow(2, DISP_Zoom + 9);
        var OverdriveI;
        var OverdriveO;
        var Position = 0;
        var DrawPointer0;
        var CanvasLineY0;
        var CanvasLineH00;
        var CanvasLineY00;
        var DISP_ModeX = DISP_Mode_ + 1;

        var DataR;
        var DataG;
        var DataB;
        var Len;
        var Len_;
        var LenO;
        var Zoom1;
        var Zoom2;
        var I_;
        var I_M;
        var I_M_Start;
        var IsOverdrive_;
        var IsOverdrive;
        var DatumR;
        var DatumG;
        var DatumB;

        var MemFreeIdx = 1;
        var ScaleDataI;
        var ScaleDataT;
        var ScaleDataL_;
        var DisplayMaxPos_ = DisplayMaxPos();
        var DrawPointerScroll = 0;
        DrawPointerScroll = WaveDisplayCanvasW - CanvasDrawStep - SET_DrawStripSize;
        DrawPointerScroll = (DrawPointerScroll >> CanvasDrawStepX);

        for (var ii = 0; ii < datacount; ii++)
        {
            OverdriveI = raw[ii * OneIndex + 12][0] * 1000;
            OverdriveO = raw[ii * OneIndex + 12][1] * 1000;

            Position = raw[ii * OneIndex + 13];
            DrawPointer0 = DrawPointer - Position;
            if (Position > 0)
            {
                if (DISP_Mode == 2)
                {
                    DrawPointer0 += 1;
                }
            }

            CanvasLineY0 = CanvasLineY;
            if (Position > 0)
            {
                if (DISP_Mode < 2)
                {
                    while (DrawPointer0 < 0)
                    {
                        DrawPointer0 += WaveDisplayCanvasWX + 1;
                        CanvasLineY0 -= CanvasLine * DISP_ModeX;
                        if (CanvasLineY0 < 0)
                        {
                            CanvasLineY0 += CanvasLine * DISP_Line * DISP_ModeX;
                        }
                    }
                }
                else
                {
                    while (DrawPointer0 < 0)
                    {
                        DrawPointer0 += DrawPointerScroll;
                        CanvasLineY0 -= CanvasLine * DISP_ModeX;
                    }
                }
            }

            if (DISP_Mode == 1)
            {
                DrawPointerX = DrawPointer0 - CanvasHalf;
                CanvasHalfY = CanvasLine;
                if (DrawPointerX < 0)
                {
                    DrawPointerX = DrawPointerX + WaveDisplayCanvasWX + 1;
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

            DataR = raw[ii * OneIndex + 3 + SET_AudioModeR];
            DataG = raw[ii * OneIndex + 3 + SET_AudioModeG];
            DataB = raw[ii * OneIndex + 3 + SET_AudioModeB];
            Len_ = DataR.length - 1;
            Len = Math.floor(Len_ / 2);
            ScaleCalc(Len);

            // Calculating color blending and strip
            {
                CanvasLineY00 = CanvasLineY;
                CanvasLineH00 = CanvasLine;
                var CanvasLineOffset = 0;


                var OffsetX;

                if (SET_FlipBand)
                {
                    OffsetX = CanvasLine + (Zoom_ * DISP_Offs / 64);
                }
                else
                {
                    OffsetX = Zoom_ - (Zoom_ * DISP_Offs / 64);
                }


                if (CanvasLine > OffsetX)
                {
                    if (Zoom_ > OffsetX)
                    {
                        CanvasLineH00 = OffsetX;
                    }
                    else
                    {
                        CanvasLineH00 = Zoom_;
                    }
                    CanvasLineY00 = CanvasLineY + CanvasLine - OffsetX;
                }
                else
                {
                    CanvasLineOffset = OffsetX - CanvasLine;
                    if (SET_FlipBand)
                    {
                        if (OffsetX > Zoom_)
                        {
                            CanvasLineH00 = CanvasLine - (OffsetX - Zoom_);
                        }
                    }
                    else
                    {
                        if (DISP_Offs < 0)
                        {
                            CanvasLineH00 = CanvasLine - (OffsetX - Zoom_);
                        }
                    }
                }

                ScaleCalcStrip(Zoom_, CanvasLineH00, CanvasLineOffset);
            }


            Zoom1 = Math.floor(Zoom_ / Len);
            Zoom2 = Math.floor(Len / Zoom_);
            IsOverdrive_ = ((OverdriveI > SET_DrawOverdriveThresholdI) || (OverdriveO > SET_DrawOverdriveThresholdO));
            if (Zoom1 < 1)
            {
                Zoom1 = 1;
            }
            if (Zoom2 < 1)
            {
                Zoom2 = 1;
            }

            LenO = DISP_Offs * Len / 64;
            if (SET_FlipBand)
            {
                I_M_Start = MarkerCountS - 1;
            }
            else
            {
                I_M_Start = 0;
            }

            // Drawing spectrogram to save
            if (((SET_SaveEnabled == 1) && (Position == 0)) || (SET_SaveEnabled == 2))
            {
                for (I_ = 0; I_ < Len; I_++)
                {
                    DatumR = 0;
                    DatumG = 0;
                    DatumB = 0;
                    if (ScaleDataL[I_] > 0)
                    {
                        ScaleDataL_ = ScaleDataL[I_];
                        ScaleDataT = ScaleData[I_];
                        for (ScaleDataI = ScaleDataL_ - 1; ScaleDataI >= 0; ScaleDataI--)
                        {
                            DatumR += (DataR[ScaleDataT[ScaleDataI]] * AudioGainR);
                            DatumG += (DataG[ScaleDataT[ScaleDataI]] * AudioGainG);
                            DatumB += (DataB[ScaleDataT[ScaleDataI]] * AudioGainB);
                        }
                        DatumR = Math.round(DatumR / ScaleDataL_);
                        DatumG = Math.round(DatumG / ScaleDataL_);
                        DatumB = Math.round(DatumB / ScaleDataL_);
                    }
                    IsOverdrive = IsOverdrive_;
                    if (IsOverdrive)
                    {
                        WaveDisplayCanvasDataR = ((SET_DrawOverdriveColorR * SET_DrawOverdriveColorA) + (DrawPaletteR[DatumR] * SET_DrawOverdriveColorX)) / 255;
                        WaveDisplayCanvasDataG = ((SET_DrawOverdriveColorG * SET_DrawOverdriveColorA) + (DrawPaletteG[DatumG] * SET_DrawOverdriveColorX)) / 255;
                        WaveDisplayCanvasDataB = ((SET_DrawOverdriveColorB * SET_DrawOverdriveColorA) + (DrawPaletteB[DatumB] * SET_DrawOverdriveColorX)) / 255;
                    }
                    else
                    {
                        WaveDisplayCanvasDataR = DrawPaletteR[DatumR];
                        WaveDisplayCanvasDataG = DrawPaletteG[DatumG];
                        WaveDisplayCanvasDataB = DrawPaletteB[DatumB];
                    }
                    if (DISP_VU__ == 0)
                    {
                        for (I_M = I_M_Start; I_M < MarkerCountS; I_M++)
                        {
                            if (I_ == MarkerFreqS[I_M])
                            {
                                WaveDisplayCanvasDataR = MarkerColorRS[I_M];
                                WaveDisplayCanvasDataG = MarkerColorGS[I_M];
                                WaveDisplayCanvasDataB = MarkerColorBS[I_M];
                                I_M_Start = I_M;
                                break;
                            }
                        }
                    }

                    SavePaintPxl(I_, WaveDisplayCanvasDataR, WaveDisplayCanvasDataG, WaveDisplayCanvasDataB);
                }
                
                SavePaintRow(Position, Len, CanvasDrawStep);
                
                if (SET_FlipBand)
                {
                    I_M_Start = MarkerCountS - 1;
                }
                else

                {
                    I_M_Start = 0;
                }
            }
            

            // Drawing spectrogram to display
            if (Position <= DisplayMaxPos_)
            {
                // Moving scrolling spectrogram
                if ((Position == 0) && (DISP_Mode == 2))
                {
                    CanvasLineNum = DISP_Line - 1;
                    var CanW = (WaveDisplayCanvasW >> CanvasDrawStepX);
                    
                    DrawPointer = DrawPointerScroll;

                    
                    DrawCopy(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, CanvasDrawStep, 0, 0, 0, DrawPointer << CanvasDrawStepX, WaveDisplayCanvasH);
                    if (CanvasDrawStep > 1)
                    {
                        DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, CanW << CanvasDrawStepX, 0, CanvasDrawStep, WaveDisplayCanvasH, 0, 0, 0);
                    }

                    if (CanvasLineNum > 0)
                    {
                        var DrawPos = DrawPointer << CanvasDrawStepX;
                        DrawCopy(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, 0, CanvasLine, DrawPos, 0, CanvasDrawStep, CanvasLine * CanvasLineNum);
                        DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPos + CanvasDrawStep, 0, WaveDisplayCanvasW - DrawPos - CanvasDrawStep, CanvasLine * CanvasLineNum, 0, 0, 0);
                    }
                }

                if (CanvasLineY0 >= 0)
                {
                    for (var i = 0; i < CanvasLine; i++)
                    {
                        if (SET_FlipBand)
                        {
                            I_ = Math.floor((((CanvasLine - i - 1) * Zoom2) / Zoom1) + LenO);
                        }
                        else
                        {
                            I_ = Math.floor(((i * Zoom2) / Zoom1) + LenO);
                        }
                        DatumR = 0;
                        DatumG = 0;
                        DatumB = 0;
                        if ((I_ >= 0) && (I_ < Len))
                        {
                            if (ScaleDataL[I_] > 0)
                            {
                                ScaleDataL_ = ScaleDataL[I_];
                                ScaleDataT = ScaleData[I_];
                                for (ScaleDataI = ScaleDataL_ - 1; ScaleDataI >= 0; ScaleDataI--)
                                {
                                    DatumR += (DataR[ScaleDataT[ScaleDataI]] * AudioGainR);
                                    DatumG += (DataG[ScaleDataT[ScaleDataI]] * AudioGainG);
                                    DatumB += (DataB[ScaleDataT[ScaleDataI]] * AudioGainB);
                                }
                                DatumR = Math.round(DatumR / ScaleDataL_);
                                DatumG = Math.round(DatumG / ScaleDataL_);
                                DatumB = Math.round(DatumB / ScaleDataL_);
                            }
                            IsOverdrive = IsOverdrive_;
                        }
                        else
                        {
                            IsOverdrive = false;
                        }

                        if (IsOverdrive)
                        {
                            WaveDisplayCanvasDataR = ((SET_DrawOverdriveColorR * SET_DrawOverdriveColorA) + (DrawPaletteR[DatumR] * SET_DrawOverdriveColorX)) / 255;
                            WaveDisplayCanvasDataG = ((SET_DrawOverdriveColorG * SET_DrawOverdriveColorA) + (DrawPaletteG[DatumG] * SET_DrawOverdriveColorX)) / 255;
                            WaveDisplayCanvasDataB = ((SET_DrawOverdriveColorB * SET_DrawOverdriveColorA) + (DrawPaletteB[DatumB] * SET_DrawOverdriveColorX)) / 255;
                        }
                        else
                        {
                            WaveDisplayCanvasDataR = DrawPaletteR[DatumR];
                            WaveDisplayCanvasDataG = DrawPaletteG[DatumG];
                            WaveDisplayCanvasDataB = DrawPaletteB[DatumB];
                        }
                        if (DISP_VU__ == 0)
                        {
                            if (SET_FlipBand)
                            {
                                for (I_M = I_M_Start; I_M >= 0; I_M--)
                                {
                                    if (I_ == MarkerFreqS[I_M])
                                    {
                                        WaveDisplayCanvasDataR = MarkerColorRS[I_M];
                                        WaveDisplayCanvasDataG = MarkerColorGS[I_M];
                                        WaveDisplayCanvasDataB = MarkerColorBS[I_M];
                                        I_M_Start = I_M;
                                        break;
                                    }
                                }
                            }
                            else
                            {
                                for (I_M = I_M_Start; I_M < MarkerCountS; I_M++)
                                {
                                    if (I_ == MarkerFreqS[I_M])
                                    {
                                        WaveDisplayCanvasDataR = MarkerColorRS[I_M];
                                        WaveDisplayCanvasDataG = MarkerColorGS[I_M];
                                        WaveDisplayCanvasDataB = MarkerColorBS[I_M];
                                        I_M_Start = I_M;
                                        break;
                                    }
                                }
                            }
                        }

                        DrawRectX(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointer0 << CanvasDrawStepX, CanvasLineY0 + CanvasLine - i - 1, CanvasDrawStep, WaveDisplayCanvasDataR, WaveDisplayCanvasDataG, WaveDisplayCanvasDataB);
                        if (DISP_Mode == 1)
                        {
                            DrawRectX(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointerX << CanvasDrawStepX, CanvasLineY0 + CanvasLine + CanvasHalfY - i - 1, CanvasDrawStep, WaveDisplayCanvasDataR, WaveDisplayCanvasDataG, WaveDisplayCanvasDataB);
                        }
                    }

                    // Blending with strip
                    if (DISP_VU__ == 0)
                    {
                        for (var i = 0; i < ScaleStripColor.length; i++)
                        {
                            var Y__ = CanvasLineY00 + ScaleStripColor[i][0];
                            var H__ = ScaleStripColor[i][1];

                            var BlendMode = ScaleStripColor[i][5];
                            var BlendValue = ScaleStripColor[i][6];
                            switch (BlendMode)
                            {
                                case 0:
                                {
                                    DrawRectBlend(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointer0 << CanvasDrawStepX, Y__, CanvasDrawStep, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4], BlendValue);
                                    if (DISP_Mode == 1)
                                    {
                                        DrawRectBlend(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointerX << CanvasDrawStepX, Y__ + CanvasHalfY, CanvasDrawStep, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4], BlendValue);
                                    }
                                    break;
                                }
                                case 1:
                                {
                                    if (BlendValue > H__)
                                    {
                                        BlendValue = H__;
                                    }
                                    DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointer0 << CanvasDrawStepX, Y__, CanvasDrawStep, BlendValue, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                                    DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointer0 << CanvasDrawStepX, Y__ + H__ - BlendValue, CanvasDrawStep, BlendValue, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                                    if (DISP_Mode == 1)
                                    {
                                        DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointerX << CanvasDrawStepX, Y__ + CanvasHalfY, CanvasDrawStep, BlendValue, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                                        DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointerX << CanvasDrawStepX, Y__ + H__ - BlendValue + CanvasHalfY, CanvasDrawStep, BlendValue, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                                    }
                                    break;
                                }
                                case 2:
                                {
                                    if (BlendValue > H__)
                                    {
                                        BlendValue = H__;
                                    }
                                    var BlendPos = Math.floor((H__ - BlendValue) / 2);
                                    DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointer0 << CanvasDrawStepX, Y__ + BlendPos, CanvasDrawStep, BlendValue, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                                    if (DISP_Mode == 1)
                                    {
                                        DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointerX << CanvasDrawStepX, Y__ + BlendPos + CanvasHalfY, CanvasDrawStep, BlendValue, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                if (SET_AudioPlayerDrawBuf)
                {
                    if (Position == 0)
                    {
                        AudioPlayerDrawBuffer(DrawPointer0 << CanvasDrawStepX, CanvasLineY0 + CanvasLine - 1, CanvasLineY0, CanvasDrawStep);
                        if (DISP_Mode == 1)
                        {
                            AudioPlayerDrawBuffer(DrawPointerX << CanvasDrawStepX, CanvasLineY0 + CanvasHalfY + CanvasLine - 1, CanvasLineY0 + CanvasHalfY, CanvasDrawStep);
                        }
                    }
                }


                DatumR = DataR[Len_];
                DatumG = DataG[Len_];
                DatumB = DataB[Len_];
                if (DatumR >= 0)
                {
                    MemFreeIndex[MemFreeIdx] = DatumR;
                    MemFreeIdx++
                }
                if ((DatumG >= 0) && (DatumR != DatumG))
                {
                    MemFreeIndex[MemFreeIdx] = DatumG;
                    MemFreeIdx++
                }
                if ((DatumB >= 0) && ((DatumR != DatumB) || (DatumG != DatumB)))
                {
                    MemFreeIndex[MemFreeIdx] = DatumB;
                    MemFreeIdx++
                }


                if (DISP_Mode == 2)
                {
                    CanvasLineNum = DISP_Line - 1;
                    CanvasLineY = CanvasLine * CanvasLineNum;
                }

                if (Position == 0)
                {
                    if (DISP_Mode < 2)
                    {
                        DrawPointer++;
                        if (DrawPointer > (WaveDisplayCanvasWX))
                        {
                            DrawPointer = 0;
                            CanvasLineNum++;
                            if (CanvasLineNum >= DISP_Line)
                            {
                                CanvasLineNum = 0;
                            }
                            CanvasLineY = CanvasLine * CanvasLineNum * (DISP_Mode_ + 1);
                        }
                    }

                    if (DISP_Mode == 1)
                    {
                        DrawPointerX = DrawPointer - CanvasHalf;
                        CanvasHalfY = CanvasLine;
                        if (DrawPointerX < 0)
                        {
                            DrawPointerX = DrawPointerX + WaveDisplayCanvasWX + 1;
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
        }

        if (datacount > 0)
        {
            MemFreeIndex[0] = MemFreeIdx;
            audioRecorder.datafree();
        }
        else
        {
            SavePaintRowPause();
            if (DISP_Mode == 1)
            {
                DrawPointerX = DrawPointer - CanvasHalf;
                CanvasHalfY = CanvasLine;
                if (DrawPointerX < 0)
                {
                    DrawPointerX = DrawPointerX + WaveDisplayCanvasWX + 1;
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

        // Drawing display spectrogram strip
        if ((Position == 0) && (SET_DrawStripSize > 0))
        {
            var CanvasLineOffset = 0;
            WaveDisplayCanvasDataR = DrawPaletteR[0];
            WaveDisplayCanvasDataG = DrawPaletteG[0];
            WaveDisplayCanvasDataB = DrawPaletteB[0];
            
            var DrawStripSize_ = SET_DrawStripSize;
            
            if (DISP_Mode == 2)
            {
                DrawStripSize_ = (CanW << CanvasDrawStepX) - (DrawPointer << CanvasDrawStepX);
            }
            
            var DrawPointer_ = DrawPointer + 1;
            var DrawPointerX_ = DrawPointerX + 1;
                        
            if (DrawPointer > 0)
            {
                DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointer_ << CanvasDrawStepX, CanvasLineY0, DrawStripSize_, CanvasLine, WaveDisplayCanvasDataR, WaveDisplayCanvasDataG, WaveDisplayCanvasDataB);
                if (DISP_Mode == 1)
                {
                    DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointerX_ << CanvasDrawStepX, CanvasLineY0 + CanvasHalfY, DrawStripSize_, CanvasLine, WaveDisplayCanvasDataR, WaveDisplayCanvasDataG, WaveDisplayCanvasDataB);
                }
            }
            var OffsetX;

            if (SET_FlipBand)
            {
                OffsetX = CanvasLine + (Zoom_ * DISP_Offs / 64);
            }
            else
            {
                OffsetX = Zoom_ - (Zoom_ * DISP_Offs / 64);
            }


            if (CanvasLine <= OffsetX)
            {
                CanvasLineOffset = OffsetX - CanvasLine;
            }
            
            ScaleCalcStrip(Zoom_, CanvasLineH00, CanvasLineOffset);
            if (DrawPointer > 0)
            {
                for (var i = 0; i < ScaleStripColor.length; i++)
                {
                    var Y__ = CanvasLineY00 + ScaleStripColor[i][0];
                    var H__ = ScaleStripColor[i][1];

                    DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointer_ << CanvasDrawStepX, Y__, DrawStripSize_, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                    if (DISP_Mode == 1)
                    {
                        DrawRect(WaveDisplayCanvasData, WaveDisplayCanvasW_, WaveDisplayCanvasH_, DrawPointerX_ << CanvasDrawStepX, Y__ + CanvasHalfY, DrawStripSize_, H__, ScaleStripColor[i][2], ScaleStripColor[i][3], ScaleStripColor[i][4]);
                    }

                }
            }
        }

        DrawRefresh(WaveDisplayCanvasContext, WaveDisplayCanvasData);
    }

    if (WORK_Scope)
    {
        var ScopeArrayWH = raw[raw[1] * OneIndex + 3];
        if ((ScopeArrayWH[0] == SET_ScopeW_) && (ScopeArrayWH[1] == SET_ScopeH_))
        {
            var ScopeArrayI = raw[raw[1] * OneIndex + 4];
            var ScopeArrayO = raw[raw[1] * OneIndex + 5];
            for (var X = 0; X < SET_ScopeW_; X++)
            {
                for (var Y = 0; Y < SET_ScopeH_; Y++)
                {
                    var V = [0, ScopeArrayI[X][Y], ScopeArrayO[X][Y]];
                    ScopeDrawPxl(X, Y, DrawPaletteR[V[SET_ScopeAudioR]], DrawPaletteG[V[SET_ScopeAudioG]], DrawPaletteB[V[SET_ScopeAudioB]]);
                }
            }
            ScopeDrawRefresh();
        }
    }
}

