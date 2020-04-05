# Overview and requirements

## Overview

AudioSpectrum is audio viewer and processor, which work in web browser\. It consists of the following modules:


* **Spectrogram** \- display sound spectrogram\.
* **Stereo scope** \- display side\-mid or left\-right in X\-Y mode\.
* **Filter** \- create finited\-impulse\-response brick\-wall frequency filter\.
* **Process control** \- set filter processing including brick\-wall filter, adding noise and volume control\.
* **Playlist** \- play audio from file instead of live audio recording\.

Example AudioSpectrum pusposes:


* Display audio spectrogram\.
* Check if audio is stereophonic or monaural\.
* Check stereo balance\.
* Redirect audio from recording device to playing device\.
* Apply lowpass/highpass/bandass filter\.
* Change stereo base size\.

## Requirement and compatibility

AudioSpectrum requires a web browser compatible with HTML5 WebAudio and LocalStorage, so it is compatible with current version of Mozilla Firefox and Google Chrome for Windows and for Android\. This application will probably work with other PC and mobile web browsers, but working in browsers other than mentioned is not tested and not guaranteed\.

## Settings screen

The settings screen can be achieved by clicking on the graphic screen in **Spectrogram**, **Stereo scope** and **Filter** modules or by clicking the Settings button in the remaining modules\.

This screen, on the top and bottom contains the followin buttons:


* **Close** \- Close settings screen\.
* **Pause** \- Pause and resume drawing on spectrogram and stereo scope, the audio will be processed in background\.
* **Fullscreen** \- Switch the web browser to fullscreen mode\.
* **Start/Stop** \- Start and stop audio capturing and processing\.

All number values are integer values\. Some parameters has value with fraction part, even can have only fraction value \(for example value from **0\.000** do **1\.000**\)\. Such parameters are indicated as **x1000**, which means, that value in the field is a result of multiplication of 1000 and real value\.

## Module layout settings

Application modules are enumerated from 0 to 5\. The module layout can be changed in **LAYOUT** section\. The **Module \(0\-5\) order** field provides visibility and order configuration\. The inputted numbers representes modules, which are visible\. The numer order determines module display order\. The other characters than digits from **0** to **5** are ignored, also the second and further instances of the same number are ignored\.

Every module width matches screen wide, but the height can be drfined either by percent of screen height or by size in pixels\. Each module has two fields to define size\. The first field is the size value, the second field is the size unit \(pixels or percent\)\.

## General settings

The informations and settings in **GENERAL** section are not related to specified module and will affect all application working\.

The information values are:


* **Input sample rate** \- Audio input sample rate, it depends on web browser implementation\.\.
* **Output sample rate** \- Audio output sample rate, it depends on web browser implementation\.\.
* **Screen resolution** \- Whole browser screen size, including toolbar, margins, etc\.

This section also contains the following settings:


* **Drawing gamma x1000** \- Gamma values used to spectrogram and stereo scope level display\.
* **Spectrum window type** \- Window type used to calculate Fourier transform used in spectrum\.
* **Audio buffer size \[samples\]** \- Audio recording buffer size, it must be choosen experimentally\.
* **Audio echo cancellation** \- Echo cancellation using WebAudio parameter \(may not work in some web browsers\)\.
* **Audio noise suppression** \- Noise suppression using WebAudio parameter \(may not work in some web browsers\)\.
* **Audio auto gain control** \- Auto gain control using WebAudio parameter \(may not work in some web browsers\)\.
* **Auto start** \- Auto audio start directly after application loaded\. The **Enabled** option may not work in some web browsers\. The **Screen** option causes, that the first click on screen will start audio instead of action assigned to clicked object\. This option is usable when **Enabled** does not work\.
* **Auto fullscreen** \- Auto switching to fullscreen mode, work the same way as **Auto start**\.
* **Button font size \[points\]** \- Button font size in **Spectrogram**, **Stereo scope** and **Filter** modules\.
* **Color picker** \- Enable or disable color picker in setting fields, which are color parameter\. In some web browsers, which supports color\-type fields, color choosing is limited and there is not possible to input arbitrary color channel values\. When disabled, instead of color button there will be displayed text field and color value is represented in **\#RRGGBB** pattern, where RR, GG, and BB are hexadecimal channel values\.

Some settings, either general settings, or settings related with any module, requires restart autio capture \(by **Start/Stop** click\) or restart application \(by page refresh\)\.

## Spectrogram, stereo scope, playback and filters settings

All these settings are detailed in module descriptions\.

## Reset settings and clear storage

At the bottom of settings screen, there are several button, which allows to restore default settings and clear saved data\. There buttons are:


* **Reset layout settings**
* **Reset general settings**
* **Reset playback settings**
* **Reset spectrogram settings**
* **Reset stereo scope settings**
* **Reset filter settings**
* **Clear filter slots**
* **Clear process slots**

Every buttons resets the settings as labeled\. After clicking any of these button, you have to restart AudioSpectrum by page refresh to take effect\.

# Spectrogram

## Purpose

This module shows audio spectrogram \(spectrum in time\)\. It can be used to visualize many sounds, also it shows audio balance using colors\. This module can also be used to check, if input device is ocerloaded or check audio frequency characteristics\.

## Functions in toolbar

Spectrogram has following parameters, which value can be changed using the following buttons in toolbar:


* **Gain \(G\-, G\+\)** \- Sound gain, it should be set according to input sound volume to get signals enough perceptible \(not too dark and not too bright\)\.
* **Resolution \(R\-, R\+\)** \- Frequency spectrum resolution, lower frequency resolution will result in higher time resolution, lower performance requirement and vice versa\.
* **Window \(W\-, W\+\)** \- Part of window used to calculate spectrum without changing resolution, changing result is similar to changing resolution, but spectrum will be smoother and this setting not affects in performance requirement\.
* **Zoom \(Z\-, Z\+\)** \- Vertical spectrum size\.
* **Offset \(O\-, O\+\)** \- Vertical spectrum position\.
* **Step \(S\-, S\+\)** \- Number of samples per one pixel, the lower step will result in higher speed in drawing, so the more details will be perceptible\.
* **Base \(B\-, B\+\)** \- Brightness of zero value, used to highlight weak signals or hide uniform noise without gain changing\.
* **Min/Max \(M\-, M\+\)** \- Number of values used to display minimum \(negative\) or maximum \(positive\) value, it can highlight weak signals in some cases\.
* **Lines \(L\-, L\+\)** \- Number of lines \(tracks\) displayed once\.

On the both buttons in evry pair above, the number represents the current parameter value\. The toolbar has also the following functions:


* **Disp** \- Switch between spectrum and waveform or switch half offset between on and off \(maximum six display states, depending on settings\)\.
* **Pause** \- Pause or resume spectrum drawing without turning off audio input, if audio input is not turned on, it will be turned on\.

## Waveform display

Using **Disp** button, you can display waveform to check, if audio device is correctly drived, so if audio signal is present, not too low and not clipped\. In waveform mode, display controls other than **Resolution**,** Window** and **Min/Max** works in the same way, as in spectrum mode\. The **Resolution** and **Window** control not affects in waveform display\. The **Min/Max** changes number of steps to display maximum value to get maximum sample values more perceptible The negative and positive value will give the same result, the **0** value is treated as **1** in waveform mode\.

## Settings

The informations and settings related to spectrogram module are in the **SPECTROGRAM** section:


* **Canvas resolution** \- Real spectrogram canvas resolution after pixel scaling\.
* **Decimated sample rate** \- Spectrogram audio sample rate after decimation\.
* **Sample decimation** \- Samplerate divider to get lower audio sample, which requires lower performance, the value of input samples are averaged\.
* **Spectrum window type** \- Window type used to calculate Fourier transform used in spectrum\.
* **Canvas orientation** \- Whole canvas clockwise rotation with flipping or without flipping, usable especially on some mobile devices with locked screen automatic rotation\. The flipping means swapping graphics drawing axes\.
* **Spectrum band flip** \- Spectrogram band flipping to change frequency and offset increasing direction\.
* **Spectrum log base** \- Spectrogram logarithm base, when value is above **1**, spectrogram brightness will be displayed logarithmically\. Otherwise, spectrogram brightness will be displayed linearly\.
* **Spectrum log offset factor x1000** \- Spectrogram base bactor, when its displayed logarithmically, it affects the **Base** buttons working\.
* **Toolbar position** \- Visibility and position of toolbar on module area\. It is possible to display in 2\-row or 4\-row layout\.
* **Toolbar size \[%\]** \- Tool bar size as module size percentage\.
* **Decimate below step** \- Minimal step value, when spectrum is calculated for every step\. If step size is less than this value, the spectrum will be repeated, so performance requirement will be lower, but spectrum time detail display will be slightly lower\. This value is usable in displaying lower spectrum steps with fast drawing, when the lower spectrum steps than this value will require only slighty higher performance\.
* **Decimate above resolution** \- Maximum resolution value, when spectrum is calculated for every step\. If resolution is greater than this value, the spectrum will be repeated, so performance requirement will be lower, but spectrum time detail display will be slightly lower\. This value is usable in displaying higher spectrum resolutions with fast drawing, when the higher spectrum resolutions than this value will require only slighty higher performance\.
* **Canvas width scale** \- Scale canvas pixel width, usable if screen pixels are very small and may decrease performance requirement\.
* **Canvas height scale** \- Scale canvas pixel height, usable if screen pixels are very small and may decrease performance requirement
* **Pointer strip size** \- Pointer strip width in pixels\.
* **Pointer strip color** \- Pointer strip color value\.
* **Input overdrive threshold x1000** \- Absolute 16\-bit sample value, wher audio input overdrive will be indicated\. Some overdriven audio devices generates sample absolute values slighty lower than 1\.0/\-1\.0, so the value must be slightly lower than maximum absolute sample value\. To turn off overdrive indicator, set this value above 1000, which means 1\.0\.
* **Output overdrive threshold x1000** \- Absolute 16\-bit sample value, wher audio output overdrive will be indicated\. Incorrectly set audio processing can generate sample values higher than maximum, this will make output audio distortion\. To turn off overdrive indicator, set this value above 1000, which means 1\.0\.
* **Overdrive color** \- Overdrive indicator color\.
* **Overdrive opacity** \- Overdrive indicator opacity from 0 to 255, if value is 0, the indicator will not be visible, if value is 255, the indicator will be opaque\.
* **Display mode lines** \- Avaibility of line modes in Display state switching\.
* **Display waveform** \- Avaibility of waveform modes in Display state switching\.
* **Waveform background level** \- Simulated spectrogram level for background in waveform mode from 0 to 65535\.
* **Waveform foreground level** \- Simulated spectrogram level for foreground in waveform mode from 0 to 65535\.
* **Repaint length \[samples\]** \- Number of samples, which can be repainted backward in every action, which affects spectrogram/waveform display\. This value affects the range of repainting backward\.
* **Repaint step \[pixels\]** \- Number of audio steps \(pixels\), which will be repainted by one current audio step\. It value must be choosen experimentally, the higher value will result by faster repainting, but requires higher performance\.
* **Audio channel R** \- Audio channel assignment to red color channel\.
* **Audio channel G** \- Audio channel assignment to green color channel\.
* **Audio channel B** \- Audio channel assignment to blue color channel\.
* **Audio gain R x1000** \- Red color channel value gain, usable to change color tint\. This value may not to be confused with spectrum gain\.
* **Audio gain G x1000** \- Green color channel value gain, usable to change color tint\. This value may not to be confused with spectrum gain\.
* **Audio gain B x1000** \- Blue color channel value gain, usable to change color tint\. This value may not to be confused with spectrum gain\.

# Stereo scope

## Purpose

This module displays sound as X\-Y scope\. It can display input audio or output audio or combined both streams simirally like analog oscilloscope\. The axis can be treated as audio channels \(left and right\) to display for example Lissajous curves or "vector graphics" designed to display on oscilloscope connected to audio output device\. Insteat of Left/Right axis, there can be displayed Side/Mid axis to better show, if audio is monaural/stereophonic, stereo base or stereo balance\. The input device overloading can be shown by display signal very close to canvas edge, while edge represents the maximum audio value, while the gain for X and Y is set to 1\.

## Functions in toolbar

The Stereo scope module has toolbar, in where there are buttons, which changes display parameters, the value will be changed by **Step** value, the buttons are in pais:


* **X\-, X\+, Y\-, Y\+, Z\-, Z\+** \- Sound gain across X/Y/Z axis\.
* **Dim\-, Dim\+** \- Display dimming factor, the canvas dims by multiplying every pixel value by dimming factor, until pixel value is blow 0\.001, when is visible as black\.
* **Pxl\-, Pxl\+** \- Chabge pixel drawing radio\. When **0\.000**, there will be drew lines between value points only, when **1\.000**, there will be drew pixels, which represents sample value\. The other values means proportionally combining the both approaches\.
* **Step\-, Step\+** \- Change value change for above parameters\.

The other buttons are toggles between display modes and can have one of several captions, which represents the current state:


* **SM/LR** \- Switch between Side\-Mid or Left\-Right display mode\.
* **XY/YX** \- Swap axis\.
* **X** \- Change X axis value increasion direction\.
* **Y** \- Change Y axis value increasion direction\.

## Settings

The settings related to spectrogram module are in the **STEREO SCOPE** section:


* **Canvas width** \- Canvas width in pixels, its impacts to required computing performance\.
* **Canvas height** \- Canvas height in pixels, its impacts to required computing performance\.
* **Canvas width scale** \- Canvas pixel width, its not impacts to computing\.
* **Canvas height scale** \- Canvas pixel height, its not impacts to computing\.
* **Dimming factor x1000** \- Display dimming factor, it can be changed from toolbar\.
* **Dimming decimation** \- Display dimming decimation, its not impacts to display diming duration, but impacts to required computing performance\.
* **X gain x1000** \- Sound gain across X axis, it can be changed from toolbar\.
* **Y gain x1000** \- Sound gain across Y axis, it can be changed from toolbar\.
* **Z gain x1000** \- Sound gain across Z axis \(brightness\), it can be changed from toolbar\.
* **Pixel factor x1000** \- Pixel drawing radio for one sample, it can be changed from toolbar\.
* **Toolbar position** \- Stereo scope toolbar position\.
* **Toolbar size \[%\]** \- Stereo scope toolbar size\.
* **Background color** \- Background color outside of canvas\.
* **Audio R** \- Audio stream displayed as red color channel\.
* **Audio G** \- Audio stream displayed as green color channel\.
* **Audio B** \- Audio stream displayed as blue color channel\.

# Filter

## Purpose

AudioSpectrum has a ability to record and play processed audio in real time\. Within processing, there can be user up to 4 brick\-wall filters\. Each filter is a finited\-impulse\-response filter, which windows size and windowing function can be defined and affects the required performance, audio latency and filtering accuracy\. Each filter is defined by frequency characteristics and can act as for example lowpass filter, highpass filter or parametric equalizer\.

## Abilities and visualization

AudioSpectrum can store 4 filter definitions in 4 slots with independed properties\. The frequency axis may be divided into segment with independed values, while positive value means amplifying and negative value means damping signal across specified frequencies\. On the graph there is displayed 0 value as horizontal line across whole frequency range\. The frequency range is from 0 to half value of input sample rate\. There also draew theoretical response, which is defined be user and practical response, which is computed as FFT of generated filter serie, including windowing function and window size\.

## Functions in toobar

The toolbar has the following buttons, which has constant function:


* **Slot 0**, **Slot 1,** **Slot 2**, **Slot 3** \- Choode filter slot\.
* **Step\-, Step\+** \- Chage filter frequency and value step, this also affects to value step in **Process control** module\.
* **<<, >>** \- Select frequency band, the selected band will be show as thick level line, is is possible to select none of bands\.

The buttons available, when any band is selected:


* **Add** \- Add ne wband by splitting selected band into two parts\.
* **Rem** \- Remove selected band\.
* **Level\-, Level\+** \- Change band level\.
* **&#124;<, &#124;>** \- Change band lower frequency\.
* **<&#124;, >&#124;** \- Change band upper frequency\.

The buttons available, when none of band is selected:


* **None/Hamming/Blackman** \- Windowing formula\.
* **Win\-, Win\+** \- Length of filtering window\.

## Settings

The settings related to Filter module are in the **FILTER** section:


* **Filter canvas resolution** \- The filter canvas current resolution
* **Process filtering** \- Toggle audio processing, when Disabled, the inpus stream will be redirected to output without touching\.
* **Toolbar position** \- Filter toolbar positin\.
* **Toolbar size \[%\]** \- Filter toolbar size\.
* **Filter min level \[dB\]** \- Minimum possible and visible filter level value\.
* **Filter max level \[dB\]** \- Maximum possible and visible filter level value\.
* **Filter FFT size** \- Displayed filter frequency response resolution\.
* **Filter resolution** \- Input frequency response resolutin\.
* **Filter canvas orientation** \- Filter canvas orientation\.
* **Background color** \- Canvas background color\.
* **Zero line color** \- Color of line, which displays 0dB level\.
* **Spectrum color** \- Color of computed filter frequency response\.
* **Level line color** \- Color of level line, which represent ideal frequency response and indicates input filter levels\.

The settings related to autio playback and processing are in the **PLAYBACK** section:


* **Play output audio** \- Generate and play output audio \(directly or processed\)\. If AudioSpectrun is used to visualize input audio, this settings should be set into **No**\.
* **Min play buffer \[ms\]** \- Minumum playback buffer time\.
* **Max play buffer \[ms\]** \- Maximum playback buffer time\.
* **Soft margin \[ms\]** \- The margin from min/max bound, where player starts periodically adding or removing one sample per period\.
* **Sample add/remove period** \- Number of samples, per which player adds or removes one sample, when real playback buffer reaches soft margin\.
* **Draw buffer on spectrogram** \- Diagnostic function, draws buffer indicator over spectrogram canvas, where the lower display edge represents the minimum time and the upper display edge represents the maximum time\. The spectrogram display zoom and offset does not matter\. This function can visualize buffer time fluctuation during playback\.
* **Buffer background shade** \- The shade of gray to draw soft min/max bounds and middle playback buffer lines\.
* **Buffer foreground shade** \- The shade of gray to draw hard min/max bounds lines and real playback buffer time\.
* **Mute audio playback** \- Mute audio playback \(the sample values will be changed to dero directly before play\) while playing live \(recording\) audio or audio from playlist or in both cases\.

The playback timing can slighty differ from recording timing, also due to perfomance\-demanding activities\. The playback buffer is the time between aquire audio data pack to play and placing the data in play timeline, so the times fluctuates during play\. This is very visible when drafing buffer on spectrogram is enabled and allow to test buffer parameters\. The **Min play buffer** and **Max play buffer** defines the hard play buffer bounds\. When player is initialized, the first playback buffer time equals to average time between hard bounds and there is a middle time\. The **Soft margin** defines the soft buffer bounds\. The lower soft bound is the lover hard bound increased by soft margin, and the upper soft bound is the upper hard bound decreased by soft margin\.

During playing, there are possible the following scenarios:


* When playback buffer time reaches beyond lower soft bound, for next audio chunks there will be added one sample \(copied from previos sample\) per certain period \(the sound pitch may me slighty decreased\), until the playback time will be upper than middle time\.
* When playback buffer time reaches beyond upper soft bound, for next audio chunks there will be remover one sample per certain period \(the sound pitch may me slighty increased\), until the playback time will be lower than middle time\.
* When playback buffer time reaches beyond lower or upper hard bound, the playback buffer time for next audio chunk will be changed to middle time and small distortion will be audible\.

# Process control

## Puspose and abilities

This module provides the audio processing configuration by series of process transforms\. There are available the following transforms:


* **Null** \- No transform\.
* **Filter** \- Apply brick\-wall filter, you can choose one of four filters for every audio channel, but is is recommended to define for left and right channel or for mid and side channel only\. Otherwise, there are applied two filter processes, the first is filter for left and right channels, and the second process is filtering the mid and side channel\. The **~** sign indicates no filter processing for this channel\.
* **Volume** \- Change audio volume, balance, stereo base etc\.
* **Noise** \- Add dual\-channel white noise to audio\. The volume of original audio will be not changed\.
* **Invert L** \- Invert left channel phase\.
* **Invert R** \- Invert right channel phase\.
* **Swap stereo** \- Swap left and right channels\.

## Creating transform list

To add transform, you have to click **Add before first** or **Add after last** button\. The **Settings** button brings screen of settings, the **Step\-** and **Step\+** changes gain value change step\. The transform is shown in table\. In the **Transform** column there are three buttons\. The first of them removes the transform and the other buttons moves transform up or down across the table to change transform order\. The drop\-down list allows to choose transform operation\. In the columns **Left**, **Right**, **Mid** and **Side**, you can choose filter slot or change gain for this channel\. Sobe transforms has no parameters to change\.

## Saving and loading transform configurations

Below the transform table, there are buttons, which allows to save and load whole process configuration, including filter slots into 10 slots from 0 to 9\. This buttons are the following function:


* **Save X** \- Save process configuration into X slot\.
* **Load X** \- Load configuration from X slot\.
* **Clear X** \- Clear X slot\.

# Playlist

## Purpose

Instead of live input audio, AudioSpectrum has ability to play sound files from playlist\. In fact, while playing sound from playlist, application also records sound from input device, but recorded sample values are substituted by samples from loaded sound file\. This feature may be used to process audio from music file without using external player or to "display" sound designed to display on X\-Y oscilloscope, in such case, there will be processed samples directly from file, without passing through audio devices\.

## Creating and managing

The playlist module provides the **Settings** button, which prings the Settings screen and drop\-down list, which provides two options:


* **Live audio** \- Audio from input device, in this mode the playlist is not used and playing is frozen\.
* **Audio from playlist** \- Play audio from playlist, played audio will be treated as recorded input audio\.

To add files, you have to select file into field **Add audio files**\. The recognized files will be added to playlist table and stored in internal memory\. You can add several files once\. In the table there are the following columns:


* **Operations** \- Buttons related to item, from left to right, there are **Remove**, **Move up** and **Move down**\.
* **Index** \- Index number\.
* **File name** \- Original file name\.
* **Sample rate** \- Sample rate read from file\.
* **Channels** \- Mono or stereo indicator\.
* **Length** \- File length in samples\.

To manage playing files from playlist, you can use the buttons above playlist table:


* **&#124;<** \- Previous item
* **<<** \- Increase backward play speed or decrease forward playing speed\.
* **<** \- Play backward at base speed
* **\[\]** \- Stop playing
* **>** \- Play forward at base speed
* **>>** \- Increase forward play speed or decrease backward playing speed\.
* **>&#124;** \- Next item

The playing base speed will be accord to recording sample rate, not to file sample rate\. The playlist storing is not possible because JavaScript API does not provide automatically loading files by file path and name\.


