# Creating an Animated WebP from a MOV with a Phone Overlay

This documents the workflow used to create the FourSure animated WebP
for `elliscodedotcom`.

The final result is an animated WebP showing the FourSure game running
inside a Nokia flip-phone image.

## Prerequisites

Install FFmpeg and ImageMagick with Homebrew:

``` bash
brew install ffmpeg imagemagick
```

Verify both:

``` bash
ffmpeg -version
magick -version
```

## 1. Start with the MOV

Put the source video in the working directory:

``` text
directory-webp/
├── input.mov
└── phone.png
```

The source MOV used in this workflow was approximately:

-   480 × 588 pixels
-   \~9 FPS
-   \~58 seconds

## 2. Extract the video into PNG frames

Create a directory for the frames:

``` bash
mkdir frames
```

Extract the video at its native \~9 FPS:

``` bash
ffmpeg -i input.mov -vf "fps=9" frames/frame_%04d.png
```

This creates files such as:

``` text
frames/
├── frame_0001.png
├── frame_0002.png
├── frame_0003.png
└── ...
```

At this point, individual frames can be viewed in Finder and unwanted
frames can be deleted.

### Viewing frames on macOS

In Finder:

1.  Open the `frames` directory.
2.  Press `⌘ + 1` for Icon View.
3.  Press `⌘ + J` to open View Options.
4.  Increase the **Icon size** slider.
5.  Use Quick Look (`Spacebar`) when a larger view is needed.

The important thing is that only the frames wanted in the final
animation remain in `frames/`.

## 3. Prepare the phone overlay

The phone image should be a PNG containing the complete phone at the
desired final canvas size, with the screen area available for the game
image.

In this workflow:

``` text
phone.png
```

was a 1000 × 1000 image.

The FourSure frame was placed into the phone screen using ImageMagick
rather than manually resizing every frame in GIMP.

## 4. Test the phone compositing with one frame

Before processing every frame, test one frame:

``` bash
magick phone.png \
  \( frame_0007.png -resize 372x \) \
  -geometry +313+274 \
  -composite \
  test.png
```

The important parameters are:

``` text
-resize 372x
-geometry +313+274
```

`372x` resizes the FourSure frame to 372 pixels wide while preserving
its aspect ratio.

`+313+274` positions the resized FourSure image at x=313, y=274 on the
1000 × 1000 phone canvas.

This leaves the phone's native status bar visible:

-   Time
-   Wi-Fi
-   Battery
-   Other status icons

The FourSure image covers the old game-specific score/multiplier area
below the status bar.

## 5. Composite every selected frame

Create a directory for the composited frames:

``` bash
mkdir composited
```

Then run:

``` bash
for f in frames/*.png; do
    name=$(basename "$f")
    magick phone.png \
      \( "$f" -resize 372x \) \
      -geometry +313+274 \
      -composite \
      "composited/$name"
done
```

This creates:

``` text
composited/
├── frame_0001.png
├── frame_0002.png
├── frame_0003.png
└── ...
```

Each composited frame is a complete 1000 × 1000 phone image with the
corresponding FourSure frame displayed inside the phone.

## 6. Create the animated WebP

Once all the composited frames look correct:

``` bash
magick -delay 11 -loop 0 composited/*.png -quality 70 output.webp
```

Options:

-   `-delay 11` --- approximately 9 frames per second (ImageMagick delay
    is measured in hundredths of a second)
-   `-loop 0` --- loop forever
-   `-quality 70` --- WebP compression quality of 70
-   `composited/*.png` --- use all composited frames in filename order
-   `output.webp` --- final animated WebP

## Final directory structure

After completing the workflow, the directory can look like:

``` text
directory-webp/
├── input.mov
├── phone.png
├── frames/
│   ├── frame_0001.png
│   ├── frame_0002.png
│   └── ...
├── composited/
│   ├── frame_0001.png
│   ├── frame_0002.png
│   └── ...
├── test.png
└── output.webp
```

## Quick version

Once the frames have been selected, the essential commands are:

``` bash
mkdir composited

for f in frames/*.png; do
    name=$(basename "$f")
    magick phone.png \
      \( "$f" -resize 372x \) \
      -geometry +313+274 \
      -composite \
      "composited/$name"
done

magick -delay 11 -loop 0 composited/*.png -quality 70 output.webp
```

## Notes

### Why not do this entirely in GIMP?

The phone overlay does not need to be manually added and resized to
dozens of animation layers. ImageMagick can apply the exact same resize
and position to every frame automatically.

### If the phone overlay changes

The `372x` and `+313+274` values are specific to this phone image and
screen placement. If a different phone image is used, these values will
need to be recalculated.

### If the animation is too large

The main ways to reduce the output size are:

-   Keep fewer frames.
-   Lower the frame rate when extracting frames.
-   Reduce the FourSure image width.
-   Lower the WebP quality from `70` to something like `60` or `50`.

For example, extracting at 6 FPS instead of 9:

``` bash
ffmpeg -i input.mov -vf "fps=6" frames/frame_%04d.png
```

And creating a smaller WebP:

``` bash
magick -delay 17 -loop 0 composited/*.png -quality 60 output.webp
```
