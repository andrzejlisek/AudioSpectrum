# AudioSpectrum

## Overview

This application requires a web browser compatible with HTML5 WebAudio, so it is compatible with current version of Mozilla Firefox, Google Chrome and maybe with other PC and mobile web browsers, but working in browsers other than mentioned is not tested and not guaranteed.

## Tools available on toolbar and keyboard control

The main purpose of Spectrum is displaying audio spectrogram. Spectrogram display can be controlled using mouse or touchscreen or keyboard. The available tools are following:
* __Gain__ - __Q__, __A__ - Sound gain, it should be set according to input sound volume to get signals enough perceptible (not too dark and not too bright).
* __Resolution__ - __W__, __S__ - Frequency spectrum resolution, lower frequency resolution will result in higher time resolution, lower performance requirement and vice versa.
* __Window__ - __E__, __D__ - Part of window used to calculate spectrum without changing resolution, changing result is similar to changing resolution, but spectrum will be smoother and this setting not affects in performance requirement.
* __Zoom__ - __R__, __F__ - Vertical spectrum size.
* __Offset__ - __T__, __G__ - Vertical spectrum position.
* __Step__ - __Y__, __H__ - Number of samples per one pixel, the lower step will result in higher speed in drawing, so the more details will be perceptible.
* __Base__ - __U__, __J__ - Brightness of zero value, used to highlight weak signals or hide uniform noise without gain changing.
* __Min/Max__ - __I__, __K__ - Number of values used to display minimum (negative) or maximum (positive) value, it can highlight weak signals in some cases.
* __Lines__ - __O__, __L__ - Number of lines (tracks) displayed once.
* __Display__ - __Z__ - Switch between spectrum and waveform or switch half offset between on and off (maximally six display states, depending on settings).
* __Pause__ - __X__ - Pause or resume spectrum drawing without turning off audio input, if audio input is not turned on, it will be turned on.

## Waveform display

Using __Display__ button or __Z__ key, you can display waveform to check, if audio device is correctly drived, so if audio signal is present, not too low and not clipped. In waveform mode, display controls other than __Resolution__, __Window__ and __Min/Max__ works in the same way, as in spectrum mode. The __Resolution__ and __Window__ control not affects in waveform display. The __Min/Max__ changes number of steps to display maximum value to get maximum sample values more perceptible The negative and positive value will give the same result, the __0__ value is treated as __1__ in waveform mode.

## Setting screen

You can go to settings and other tools by clicking/tapping anywhere on the screen outside the toolbar. This screen provides Spectrum settings, tools, audio information, display information and keyboard key assignment description.

### Buttons

On the settings screen there are the following buttons (repeated to give easier access):
* __Close__ - Close settings screen.
* __Pause__ - Pause or resume spectrum in the same way as Pause function availamble on the main screen, usable when toolbar is not visible and keyboard is not available.
* __Fullscreen__ - Switch web browser to full screen mode.
* __Reset__ - Reset all settings to default, requires application restart.
* __Start/Stop__ - Starts and stops getting audio from input device, required in some cases.

### Information

The settings screen displays the following information:
* __Input sample rate__ - Audio input sample rate, it depends on web browser implementation.
* __Decimated sample rate__ - Audio sample rate after decimation, so this is simulated sample rate of audio used to draw spectrogram.
* __Screen resolution__ - Whole browser screen size, including toolbar, margins, etc.
* __Canvas resolution__ - Real resolution of canvas used to spectrogram display.

### Options and parameters

The available setting parameters are following:
* __Canvas orientation__ - Whole canvas clockwise rotation with flipping or without flipping, usable especially on some mobile devices with locked screen automatic rotation. The flipping means swapping graphics drawing axes.
* __Spectrum band flip__ - Spectrogram band flipping to change frequency and offset increasing direction.
* __Sample decimation__ - Samplerate divider to get lower audio sample, which requires lower performance, the value of input samples are averaged.
* __Toolbar position__ - Visibility and position of toolbar on main screen. It is possible to display 10x2 layout or 5x4 layout.
* __Toolbar button size__ - One button size of tool bar. It changes, how big area of screen is occupied by toolbar.
* __Decimate below step__ - Minimal step value, when spectrum is calculated for every step. If step size is less than this value, the spectrum will be repeated, so performance requirement will be lower, but spectrum time detail display will be slightly lower. This value is usable in displaying lower spectrum steps with fast drawing, when the lower spectrum steps than this value will require only slighty higher performance.
* __Decimate above resolution__ - Maximum resolution value, when spectrum is calculated for every step. If resolution is greater than this value, the spectrum will be repeated, so performance requirement will be lower, but spectrum time detail display will be slightly lower. This value is usable in displaying higher spectrum resolutions with fast drawing, when the higher spectrum resolutions than this value will require only slighty higher performance.
* __Spectrum window type__ - Window type used to calculate Fourier transform used in spectrum.
* __Canvas width factor__, __Canvas height factor__ - Lower canvas resolution, this display behavior and performance requirement will be the same, as the screen will be smaller, usable if screen pixels are very small.
* __Drawing gamma x1000__ - Gamma values used to spectrogram level display, interted value will be divided by 1000.
* __Pointer strip size__ - Pointer strip width in pixels.
* __Pointer strip color R__, __Pointer strip color G__, __Pointer strip color B__ - Pointer strip color values.
* __Overdrive threshold__ - Absolute 16-bit sample value, wher audio input overdrive will be indicated. Some overdriven audio devices generates sample values slighty lower than 32767, to turn off overdrive indicator, set this value far above 32767.
* __Overdrive color R__, __Overdrive color G__, __Overdrive color B__ - Overdrive indicator color values.
* __Overdrive opacity__ - Overdrive indicator opacity from 0 to 255, if value is 0, the indicator will not be visible, if value is 255, the indicator will be opaque.
* __Display mode lines__ - Avaibility of line modes in Display state switching.
* __Display waveform__ - Avaibility of waveform modes in Display state switching.
* __Waveform background level__ - Simulated spectrogram level for background in waveform mode from 0 to 65535.
* __Waveform foreground level__ - Simulated spectrogram level for foreground in waveform mode from 0 to 65535.
* __Button font size__ - Button font size, it can affect button size.
* __Repaint length__ - Number of samples, which can be repainted backward in every action, which affects spectrogram/waveform display. This value affects the range of repainting backward.
* __Repaint step__ - Number of audio steps (pixels), which will be repainted by one current audio step. It value must be choosen experimentally, the higher value will result by faster repainting, but requires higher performance.
* __Audio buffer size__ - Audio recording buffer size, it must be choosen experimentally.
* __Audio mode R__, __Audio mode G__, __Audio mode B__ - Selection, wchich audio channels will be assigned to R, G, B color channels.
* __Audio gain R__, __Audio gain G__, __Audio gain B__ - Color channel value gain, usable to change color tint. This value can not to be confused with spectrum gain.
* __Audio echo cancellation__ - Echo cancellation using WebAudio parameter (may not work in some web browsers).
* __Audio noise suppression__ - Noise suppression using WebAudio parameter (may not work in some web browsers).
* __Audio auto gain control__ - Auto gain control using WebAudio parameter (may not work in some web browsers).
* __Auto start__ - Auto audio start directly after application loaded. The Enabled option may not work in some web browsers. The Screen option causes, that the first click/tab on screen will start audio instead of action assigned to clicked/tapped object. This option is usable when __Enabled__ does not work.
* __Auto fullscreen__ - Auto switching to fullscreen mode, work the same way as __Auto start__.
