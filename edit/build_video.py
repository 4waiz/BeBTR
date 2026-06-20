# -*- coding: utf-8 -*-
"""
Master compositor for the BeBTR award video.
Builds one ffmpeg filter_complex:
  [intro card] + [speaker 1080p base with timed overlays & B-roll cutaways] + [outro card]
Outputs a CLEAN master (no burned subs). Subtitles burned in a later pass.

Timeline (speaker speech shifted by INTRO=3.5s):
  0.0 - 3.5     Intro title card (fade in/out), silent
  3.5 - 114.66  Speaker base (orig 0..111.16) with overlays:
  114.66- 117.9 Outro closing card
"""
import os, subprocess

A = os.path.dirname(os.path.abspath(__file__))
W = os.path.join(A, "work")
AS = os.path.join(A, "assets")
OUT = os.path.join(A, "out")
os.makedirs(OUT, exist_ok=True)

INTRO = 3.5
SPK_DUR = 111.5      # base.mp4 duration
OUTRO = 3.4
TOTAL = INTRO + SPK_DUR + OUTRO

def O(t):
    # Overlays are composited on the SPEAKER BASE chain, whose local time equals
    # the original speech time (0..111.5). The intro card is concatenated in front
    # afterwards, so overlays must use raw speech time here (NOT intro-shifted).
    # The delivered SRT is offset by INTRO separately (it's burned on the final cut).
    return round(t, 3)

# ---- Inputs (order matters; index used in filtergraph) ----
inputs = []
def add_input(path, loop=False, t=None):
    inputs.append((path, loop, t))
    return len(inputs) - 1

i_base   = add_input(os.path.join(W, "base.mp4"))
i_cert   = add_input(os.path.join(W, "broll", "certificate.mp4"))
i_chqT   = add_input(os.path.join(W, "broll", "cheque_team.mp4"))
i_chqS   = add_input(os.path.join(W, "broll", "cheque_solo.mp4"))
i_app    = add_input(os.path.join(W, "broll", "app.mp4"))
# still overlays (loop)
i_open   = add_input(os.path.join(AS, "card_opening.png"), loop=True, t=INTRO)
i_close  = add_input(os.path.join(AS, "card_closing.png"), loop=True, t=OUTRO)
i_l3name = add_input(os.path.join(AS, "lower_third_name.png"), loop=True, t=6)
i_l3team = add_input(os.path.join(AS, "lower_third_team.png"), loop=True, t=6)
i_l3team2= add_input(os.path.join(AS, "lower_third_team.png"), loop=True, t=6)
i_award  = add_input(os.path.join(AS, "banner_award.png"), loop=True, t=6)
i_kw_pf  = add_input(os.path.join(AS, "kw_poorform.png"), loop=True, t=4)
i_kw_un  = add_input(os.path.join(AS, "kw_unsafe.png"), loop=True, t=4)
i_kw_inj = add_input(os.path.join(AS, "kw_injuries.png"), loop=True, t=4)
i_fore   = add_input(os.path.join(AS, "card_foresight.png"), loop=True, t=7)
i_kw_rt  = add_input(os.path.join(AS, "kw_realtime.png"), loop=True, t=5)
i_kw_ai  = add_input(os.path.join(AS, "kw_aifeedback.png"), loop=True, t=5)
i_kw_ad  = add_input(os.path.join(AS, "kw_adaptive.png"), loop=True, t=5)
i_kw_cv  = add_input(os.path.join(AS, "kw_cv.png"), loop=True, t=5)
i_shift  = add_input(os.path.join(AS, "card_shift.png"), loop=True, t=7)
i_env    = add_input(os.path.join(AS, "card_environments.png"), loop=True, t=6)

fc = []  # filter_complex parts

# ---------- INTRO CARD (3.5s) ----------
# opening png -> fade in 0.5, hold, fade out 0.4 ; on navy bg
fc.append(
    f"color=c=0x0A1628:s=1920x1080:d={INTRO}:r=30[introbg];"
    f"[{i_open}:v]format=rgba,fade=t=in:st=0:d=0.6:alpha=1,"
    f"fade=t=out:st={INTRO-0.5}:d=0.5:alpha=1[introfg];"
    f"[introbg][introfg]overlay=0:0:format=auto[intro]"
)

# ---------- SPEAKER BASE + OVERLAYS ----------
cur = "[0:v]"
# Each overlay/B-roll input is an independent stream starting at local PTS 0.
# Strategy: fade IN at local 0, fade OUT at local (dur-fade), then SHIFT its PTS
# to start at global time `st`, and gate the composite with enable=between(t,st,en).
def ov(src_idx, name, st, en, fade=0.4, x="0", y="0"):
    """Enable-windowed, alpha-faded overlay (PNG, full-frame canvas)."""
    global cur
    dur = en - st
    fc.append(
        f"[{src_idx}:v]format=rgba,trim=0:{dur},setpts=PTS-STARTPTS,"
        f"fade=t=in:st=0:d={fade}:alpha=1,"
        f"fade=t=out:st={dur-fade}:d={fade}:alpha=1,"
        f"setpts=PTS+{st}/TB[{name}_f]"
    )
    out = f"[v{name}]"
    fc.append(f"{cur}[{name}_f]overlay={x}:{y}:enable='between(t,{st},{en})':format=auto{out}")
    cur = out

def broll(src_idx, name, st, en, fade=0.5):
    """Full-frame B-roll cutaway (already 1920x1080 mp4)."""
    global cur
    dur = en - st
    fc.append(
        f"[{src_idx}:v]format=rgba,trim=0:{dur},setpts=PTS-STARTPTS,"
        f"fade=t=in:st=0:d={fade}:alpha=1,"
        f"fade=t=out:st={dur-fade}:d={fade}:alpha=1,"
        f"setpts=PTS+{st}/TB[{name}_b]"
    )
    out = f"[v{name}]"
    fc.append(f"{cur}[{name}_b]overlay=0:0:enable='between(t,{st},{en})':format=auto{out}")
    cur = out

# --- Award proof section: speech "where we won first place" ~ orig 17.5-22.9 ---
# certificate cutaway
broll(i_cert, "cert", O(13.4), O(16.6))                 # over startAD/DoH line
ov(i_award, "awardb", O(13.4), O(16.6), x="0", y="0")   # award banner on cert
broll(i_chqT, "chqt", O(16.9), O(19.5))                 # "where we won first place"
broll(i_chqS, "chqs", O(19.7), O(22.2))                 # continue proof

# --- Lower third: speaker name during intro line ---
ov(i_l3name, "l3n", O(2.8), O(8.6))

# --- Problem section keywords (orig ~23-31) ---
ov(i_kw_pf,  "kpf", O(23.4), O(26.4))
ov(i_kw_un,  "kun", O(26.4), O(28.6))
ov(i_kw_inj, "kinj",O(28.8), O(31.5))

# --- Foresight question card (orig ~35.8-42) ---
ov(i_fore, "fore", O(35.9), O(41.8), fade=0.5)

# --- Solution section (orig ~42-60) keywords + app broll ---
ov(i_kw_cv, "kcv", O(42.2), O(45.0))                    # computer vision + wearable
broll(i_app, "app", O(45.2), O(49.6))                   # app screenshot demo
ov(i_kw_rt, "krt", O(45.7), O(49.3))                    # real-time posture caption spans the app shot
ov(i_kw_ai, "kai", O(49.9), O(52.6))                    # AI movement feedback
ov(i_kw_ad, "kad", O(54.4), O(57.4))                    # adaptive training guidance

# --- Future section (orig 60.8-71 environments; 73-79 shift) ---
ov(i_env, "env", O(61.0), O(66.6), fade=0.5)            # gyms/schools/workplaces/community
ov(i_shift, "shift", O(73.2), O(79.0), fade=0.5)        # reactive -> proactive

# team lower third near closing mission (orig ~106.4)
ov(i_l3team2, "l3t2", O(106.2), O(110.8))

# Subtle persistent brand: small logo top-right whole speaker section (optional) - skip to stay clean.

# finalize speaker chain label
fc.append(f"{cur}null[spk]")

# ---------- OUTRO CARD ----------
fc.append(
    f"color=c=0x0A1628:s=1920x1080:d={OUTRO}:r=30[outrobg];"
    f"[{i_close}:v]format=rgba,fade=t=in:st=0:d=0.6:alpha=1,"
    f"fade=t=out:st={OUTRO-0.6}:d=0.6:alpha=1[outrofg];"
    f"[outrobg][outrofg]overlay=0:0:format=auto[outro]"
)

# ---------- CONCAT video: intro + spk + outro ----------
# add tiny fade to black between for smoothness
fc.append(f"[intro]fade=t=out:st={INTRO-0.3}:d=0.3[introx]")
fc.append(f"[spk]fade=t=in:st=0:d=0.4,fade=t=out:st={SPK_DUR-0.3}:d=0.3[spkx]")
fc.append(f"[outro]fade=t=in:st=0:d=0.3[outrox]")
fc.append(f"[introx][spkx][outrox]concat=n=3:v=1:a=0[vout]")

# ---------- AUDIO: silence(intro) + base audio + silence(outro) ----------
fc.append(f"anullsrc=channel_layout=stereo:sample_rate=44100,atrim=0:{INTRO}[a_intro]")
fc.append(f"[0:a]afade=t=in:st=0:d=0.2,afade=t=out:st={SPK_DUR-0.4}:d=0.4[a_spk]")
fc.append(f"anullsrc=channel_layout=stereo:sample_rate=44100,atrim=0:{OUTRO}[a_outro]")
fc.append(f"[a_intro][a_spk][a_outro]concat=n=3:v=0:a=1[aout]")

filtergraph = ";".join(fc)

# ---- Build command ----
cmd = ["ffmpeg", "-y"]
for path, loop, t in inputs:
    if loop:
        cmd += ["-loop", "1", "-t", str(t), "-i", path]
    else:
        cmd += ["-i", path]
cmd += ["-filter_complex", filtergraph,
        "-map", "[vout]", "-map", "[aout]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
        "-r", "30", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
        os.path.join(OUT, "BeBTR_Dubai_Foresight_Awards_No_Subtitles.mp4")]

# write filtergraph to file for debugging & to avoid cmdline length limits
fg_path = os.path.join(W, "filtergraph.txt")
open(fg_path, "w", encoding="utf-8").write(filtergraph)
print("Total timeline:", TOTAL, "s  =", f"{int(TOTAL//60)}:{TOTAL%60:05.2f}")
print("filtergraph length:", len(filtergraph))
print("inputs:", len(inputs))

if __name__ == "__main__":
    import sys
    if "--print" in sys.argv:
        print(filtergraph)
    else:
        # use -filter_complex_script to be safe
        cmd2 = ["ffmpeg","-y"]
        for path, loop, t in inputs:
            if loop: cmd2 += ["-loop","1","-t",str(t),"-i",path]
            else: cmd2 += ["-i",path]
        cmd2 += ["-filter_complex_script", fg_path,
                 "-map","[vout]","-map","[aout]",
                 "-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p",
                 "-r","30","-c:a","aac","-b:a","192k","-movflags","+faststart",
                 os.path.join(OUT,"BeBTR_Dubai_Foresight_Awards_No_Subtitles.mp4")]
        print("RUNNING ffmpeg...")
        r = subprocess.run(cmd2)
        sys.exit(r.returncode)
