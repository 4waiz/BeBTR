#!/bin/bash
# Generate Ken Burns B-roll clips (1920x1080, 30fps) from still images.
# Landscape images: scale to fill, slow zoom. Portrait images: blurred fill bg + sharp centered foreground with slow zoom.
set -e
cd "$(dirname "$0")"
ASSETS=assets
WORK=work
mkdir -p $WORK/broll
FPS=30

kenburns_landscape () {
  local SRC="$1"; local OUT="$2"; local DUR="$3"; local ZDIR="$4"
  local FRAMES=$(python -c "print(int($DUR*$FPS))")
  # zoom from 1.0 to 1.08 (in) or 1.08 to 1.0 (out)
  if [ "$ZDIR" = "out" ]; then
    ZEXPR="if(eq(on,0),1.08,max(1.001,zoom-0.0009))"
  else
    ZEXPR="min(zoom+0.0009,1.10)"
  fi
  ffmpeg -y -loop 1 -i "$SRC" -t "$DUR" -r $FPS \
    -filter_complex "[0:v]scale=2400:-1,crop=2400:1350,setsar=1[base];\
[base]zoompan=z='$ZEXPR':d=$FRAMES:s=1920x1080:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':fps=$FPS,\
format=yuv420p[v]" -map "[v]" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$OUT"
}

kenburns_portrait () {
  local SRC="$1"; local OUT="$2"; local DUR="$3"
  local FRAMES=$(python -c "print(int($DUR*$FPS))")
  ffmpeg -y -loop 1 -i "$SRC" -t "$DUR" -r $FPS \
    -filter_complex "\
[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=40:2,eq=brightness=-0.12[bg];\
[0:v]scale=-1:1000[fg0];\
[fg0]zoompan=z='min(zoom+0.0008,1.08)':d=$FRAMES:s=720x1000:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':fps=$FPS[fg];\
[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$OUT"
}

echo ">> certificate (landscape)"
kenburns_landscape "../certificate.jpeg" "$WORK/broll/certificate.mp4" 3.4 "in"

echo ">> cheque-team (portrait)"
kenburns_portrait "../src/images/cheque-team.jpg" "$WORK/broll/cheque_team.mp4" 2.8

echo ">> cheque-solo (portrait)"
kenburns_portrait "../src/images/cheque-solo.jpg" "$WORK/broll/cheque_solo.mp4" 2.6

echo ">> app screenshot (portrait)"
kenburns_portrait "../src/images/App.png" "$WORK/broll/app.mp4" 4.6

echo "DONE broll"
ls -la $WORK/broll/
