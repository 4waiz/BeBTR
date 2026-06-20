# -*- coding: utf-8 -*-
"""
Build a clean, correctly-spelled SRT by aligning the known script to Whisper's
segment timings. We define subtitle cues with explicit (start,end) borrowed from
Whisper word/segment timings, and correct text.
"""
import os
A = os.path.dirname(os.path.abspath(__file__))

def ts(t):
    h = int(t//3600); m=int((t%3600)//60); s=int(t%60); ms=int(round((t-int(t))*1000))
    if ms==1000: s+=1; ms=0
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

# (start, end, text)  -- timings aligned to whisper segments, text = corrected script
# Keep each cue short (<= ~2 lines / ~42 chars per line) for mobile readability.
cues = [
    (0.00,  2.40, "Assalamualaikum wa rahmatullahi\nwa barakatuh."),
    (2.40,  5.84, "Hi, I'm Awaiz Ahmed, a software engineer\nand co-founder of Team Limitless."),
    (5.84,  9.10, "Our project, BeBTR, is an award-winning\nAI fitness application,"),
    (9.10,  13.20, "developed for the Smart Health Hackathon\npowered by startAD"),
    (13.20, 17.56, "and the Department of Health – Abu Dhabi,"),
    (17.56, 19.60, "where we won First Place."),
    (19.60, 22.94, "Today, millions of people exercise\nwithout proper feedback."),
    (22.94, 28.14, "They may perform movements incorrectly,\nbuild unsafe habits,"),
    (28.14, 31.60, "or only realise something is wrong\nafter pain or injury appears."),
    (31.60, 35.80, "BeBTR asks a foresight question:"),
    (35.80, 42.10, "What if the gym of the future could\nprevent injury before it happens?"),
    (42.10, 48.20, "BeBTR uses AI, computer vision, and\nwearable-data concepts"),
    (48.20, 51.40, "to give real-time posture correction\nand adaptive training feedback."),
    (51.40, 54.22, "Instead of generic workout advice,"),
    (54.22, 58.00, "BeBTR helps users understand how they move,\nand correct mistakes instantly,"),
    (58.00, 60.80, "and train in a safer,\nmore personalised way."),
    (60.80, 66.40, "It is designed for a future where gyms,\nschools, workplaces,"),
    (66.40, 71.20, "and community wellness spaces can offer\nintelligent preventive coaching to everyone."),
    (71.20, 73.02, "Over the next 10 years,"),
    (73.02, 79.20, "BeBTR can help shift fitness from reactive\ntreatment to proactive prevention."),
    (79.20, 83.20, "This means fewer preventable injuries,\nsafer exercise habits,"),
    (83.20, 86.36, "and better access to guidance for people\nwho cannot always afford"),
    (86.36, 89.20, "a personal trainer\nor specialist support."),
    (89.20, 92.00, "Our vision is not only to build an app,"),
    (92.00, 96.00, "but to help shape a future where everyday\nmovement becomes smarter, safer,"),
    (96.00, 98.32, "and more human-centred."),
    (98.32, 104.00, "BeBTR shows how foresight, AI, and\nhuman-centred design can come together"),
    (104.00, 106.40, "to improve wellbeing\nbefore problems begin."),
    (106.40, 109.00, "We are Team Limitless,\nand our mission is simple:"),
    (109.00, 111.40, "help people move better, train safer,\nand build a healthier future."),
]

# The final video prepends an intro title card before the speaker footage,
# so all speech (and therefore all subtitle) timings shift by INTRO seconds.
INTRO = 3.5

def write_srt(path, offset=0.0):
    out=[]
    for i,(s,e,t) in enumerate(cues,1):
        out.append(str(i))
        out.append(f"{ts(s+offset)} --> {ts(e+offset)}")
        out.append(t)
        out.append("")
    open(path,"w",encoding="utf-8").write("\n".join(out))

if __name__=="__main__":
    os.makedirs(os.path.join(A,"out"),exist_ok=True)
    # Delivered SRT matches the final rendered video (with intro offset).
    p1 = os.path.join(A,"out","BeBTR_Dubai_Foresight_Awards_Subtitles.srt")
    write_srt(p1, offset=INTRO)
    print("wrote", p1, "cues:", len(cues))
    print("last cue end:", cues[-1][1]+INTRO)
