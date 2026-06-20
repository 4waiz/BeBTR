# -*- coding: utf-8 -*-
"""
Generate all overlay graphics (PNG w/ alpha) for the BeBTR award video.
Design system: futuristic health-tech, BeBTR green + deep navy, Segoe UI.
All canvases are 1920x1080 (full-frame overlays) so they composite 1:1.
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1920, 1080
A = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(A, "assets")
os.makedirs(ASSETS, exist_ok=True)

FONTS = "C:/Windows/Fonts/"
def font(name, size):
    return ImageFont.truetype(FONTS + name, size)

# Font roles
F_TITLE   = lambda s: font("segoeuib.ttf", s)   # bold
F_SEMI    = lambda s: font("seguisb.ttf", s) if os.path.exists(FONTS+"seguisb.ttf") else font("segoeuib.ttf", s)
F_LIGHT   = lambda s: font("segoeuil.ttf", s)   # light
F_REG     = lambda s: font("segoeui.ttf", s)
F_COND    = lambda s: font("bahnschrift.ttf", s)

# Brand palette
GREEN   = (31, 168, 75)
GREEN_B = (46, 204, 113)
TEAL    = (25, 211, 197)
NAVY    = (10, 22, 40)
NAVY2   = (16, 32, 56)
WHITE   = (255, 255, 255)
GREY    = (203, 213, 225)

LOGO = os.path.join(A, "..", "public", "logo.png")

def new_canvas():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))

def text_w(draw, txt, fnt, tracking=0):
    if tracking == 0:
        return draw.textbbox((0,0), txt, font=fnt)[2]
    return sum(draw.textbbox((0,0), c, font=fnt)[2] + tracking for c in txt) - tracking

def draw_tracked(draw, xy, txt, fnt, fill, tracking=0, anchor_center_x=None):
    """Draw text with letter-spacing. If anchor_center_x set, center on it."""
    x, y = xy
    if anchor_center_x is not None:
        tw = text_w(draw, txt, fnt, tracking)
        x = anchor_center_x - tw // 2
    for c in txt:
        draw.text((x, y), c, font=fnt, fill=fill)
        x += draw.textbbox((0,0), c, font=fnt)[2] + tracking
    return x

def soft_shadow_text(base, xy, txt, fnt, fill, tracking=0, center_x=None,
                     shadow=(0,0,0,170), blur=8, offset=(0,4)):
    """Render text onto a transparent layer with a soft drop shadow, paste to base."""
    layer = Image.new("RGBA", base.size, (0,0,0,0))
    d = ImageDraw.Draw(layer)
    x, y = xy
    if center_x is not None:
        tw = text_w(d, txt, fnt, tracking)
        x = center_x - tw // 2
    # shadow layer
    sh = Image.new("RGBA", base.size, (0,0,0,0))
    ds = ImageDraw.Draw(sh)
    xx = x
    for c in txt:
        ds.text((xx+offset[0], y+offset[1]), c, font=fnt, fill=shadow)
        xx += d.textbbox((0,0), c, font=fnt)[2] + tracking
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    layer = Image.alpha_composite(layer, sh)
    d = ImageDraw.Draw(layer)
    xx = x
    for c in txt:
        d.text((xx, y), c, font=fnt, fill=fill)
        xx += d.textbbox((0,0), c, font=fnt)[2] + tracking
    return Image.alpha_composite(base, layer)

def accent_rule(draw, cx, y, w=220, color=GREEN_B, thick=5):
    draw.rounded_rectangle([cx-w//2, y, cx+w//2, y+thick], radius=thick//2, fill=color)

def vignette_panel(alpha=235):
    """Full navy gradient background for title/closing cards."""
    img = Image.new("RGBA", (W, H), NAVY + (alpha,))
    # subtle radial-ish lighten in center using a blurred ellipse
    glow = Image.new("RGBA", (W, H), (0,0,0,0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W*0.18, H*0.05, W*0.82, H*0.95], fill=(31,168,75,40))
    glow = glow.filter(ImageFilter.GaussianBlur(180))
    img = Image.alpha_composite(img, glow)
    # second teal glow lower-right
    glow2 = Image.new("RGBA", (W, H), (0,0,0,0))
    gd2 = ImageDraw.Draw(glow2)
    gd2.ellipse([W*0.55, H*0.45, W*1.05, H*1.1], fill=(25,211,197,30))
    glow2 = glow2.filter(ImageFilter.GaussianBlur(200))
    img = Image.alpha_composite(img, glow2)
    return img

def load_logo(size):
    lg = Image.open(LOGO).convert("RGBA")
    lg = lg.resize((size, size), Image.LANCZOS)
    return lg

# ---------------------------------------------------------------------------
# 1) OPENING TITLE CARD
# ---------------------------------------------------------------------------
def opening_card():
    img = vignette_panel(245)
    # logo top center
    logo = load_logo(190)
    img.alpha_composite(logo, (W//2 - 95, 200))
    d = ImageDraw.Draw(img)
    img = soft_shadow_text(img, (0, 430), "BeBTR", F_TITLE(150), WHITE, tracking=4, center_x=W//2, blur=14, offset=(0,6))
    d = ImageDraw.Draw(img)
    accent_rule(d, W//2, 620, w=260, color=GREEN_B, thick=6)
    img = soft_shadow_text(img, (0, 660), "AI-POWERED PREVENTIVE FITNESS", F_LIGHT(54), GREY, tracking=8, center_x=W//2, blur=6)
    d = ImageDraw.Draw(img)
    draw_tracked(d, (0, 770), "BY  TEAM  LIMITLESS", F_SEMI(40), GREEN_B, tracking=10, anchor_center_x=W//2)
    img.save(os.path.join(ASSETS, "card_opening.png"))

# ---------------------------------------------------------------------------
# 2) CREDENTIAL STRIP (under opening / award line) - lower banner
# ---------------------------------------------------------------------------
def award_banner():
    """Compact 'FIRST PLACE' badge pill, top-left corner of the certificate B-roll.
    Sits clear of the cert's own centered title and clear of bottom subtitles."""
    img = new_canvas()
    d = ImageDraw.Draw(img)
    # rounded pill, top-left
    x0, y0 = 90, 80
    fnt = F_TITLE(58)
    label = "FIRST PLACE"
    tw = d.textbbox((0,0), label, font=fnt)[2]
    pad = 44
    star_w = 64
    cw = tw + pad*2 + star_w
    ch = 110
    pill = Image.new("RGBA", (cw, ch), (0,0,0,0))
    pd = ImageDraw.Draw(pill)
    pd.rounded_rectangle([0,0,cw,ch], radius=ch//2, fill=(8,18,34,225))
    pd.rounded_rectangle([0,0,cw,ch], radius=ch//2, outline=GREEN_B, width=4)
    # trophy/star mark (simple 5-point star)
    cx, cy, R = pad+18, ch//2, 26
    import math
    pts=[]
    for k in range(10):
        ang = -math.pi/2 + k*math.pi/5
        r = R if k%2==0 else R*0.42
        pts.append((cx+r*math.cos(ang), cy+r*math.sin(ang)))
    pd.polygon(pts, fill=GREEN_B)
    pd.text((pad+star_w, ch//2-38), label, font=fnt, fill=WHITE)
    img.alpha_composite(pill, (x0, y0))
    img.save(os.path.join(ASSETS, "banner_award.png"))

# ---------------------------------------------------------------------------
# 3) LOWER THIRD - speaker name
# ---------------------------------------------------------------------------
def lower_third():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    x0, y0 = 110, 780
    # bar background (rounded) with gradient
    bar_w, bar_h = 760, 170
    bar = Image.new("RGBA", (bar_w, bar_h), (0,0,0,0))
    bd = ImageDraw.Draw(bar)
    for i in range(bar_w):
        a = int(225 * (1 - i/bar_w*0.85))
        bd.line([(i,0),(i,bar_h)], fill=(10,22,40,a))
    mask = Image.new("L", (bar_w, bar_h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0,0,bar_w,bar_h], radius=18, fill=255)
    img.paste(bar, (x0, y0), mask)
    d = ImageDraw.Draw(img)
    # green accent edge
    d.rounded_rectangle([x0, y0, x0+10, y0+bar_h], radius=5, fill=GREEN_B)
    d.text((x0+45, y0+30), "Awaiz Ahmed", font=F_TITLE(60), fill=WHITE)
    d.text((x0+48, y0+106), "Software Engineer & Co-Founder", font=F_REG(34), fill=GREY)
    # second role line right under, brand
    img.save(os.path.join(ASSETS, "lower_third_name.png"))

def lower_third_team():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    x0, y0 = 110, 800
    bar_w, bar_h = 600, 150
    bar = Image.new("RGBA", (bar_w, bar_h), (0,0,0,0))
    bd = ImageDraw.Draw(bar)
    for i in range(bar_w):
        a = int(225 * (1 - i/bar_w*0.85))
        bd.line([(i,0),(i,bar_h)], fill=(10,22,40,a))
    mask = Image.new("L", (bar_w, bar_h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0,0,bar_w,bar_h], radius=18, fill=255)
    img.paste(bar, (x0, y0), mask)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([x0, y0, x0+10, y0+bar_h], radius=5, fill=TEAL)
    d.text((x0+45, y0+28), "Team Limitless", font=F_TITLE(54), fill=WHITE)
    d.text((x0+48, y0+98), "BeBTR  ·  Preventive Fitness", font=F_REG(32), fill=GREY)
    img.save(os.path.join(ASSETS, "lower_third_team.png"))

# ---------------------------------------------------------------------------
# 4) KEYWORD OVERLAYS (problem / solution / future)
#    Big short phrase, lower-left, with accent tick.
# ---------------------------------------------------------------------------
def keyword(name, lines, color=GREEN_B, sub=None, pos="left", size=96):
    img = new_canvas()
    d = ImageDraw.Draw(img)
    if pos == "left":
        x = 130
        y = 360 if len(lines) > 1 else 430
        accent_rule(d, x+5, y-40, w=110, color=color, thick=7)
        for ln in lines:
            img = soft_shadow_text(img, (x, y), ln, F_TITLE(size), WHITE, tracking=1, blur=10, offset=(0,5))
            d = ImageDraw.Draw(img)
            y += int(size*1.12)
        if sub:
            d.text((x+4, y+10), sub, font=F_LIGHT(40), fill=GREY)
    else:  # center
        total = len(lines)
        y = H//2 - int(size*0.6*total)
        for ln in lines:
            img = soft_shadow_text(img, (0, y), ln, F_TITLE(size), WHITE, tracking=2, center_x=W//2, blur=10, offset=(0,5))
            d = ImageDraw.Draw(img)
            y += int(size*1.15)
    img.save(os.path.join(ASSETS, f"kw_{name}.png"))

# ---------------------------------------------------------------------------
# 5) FEATURE CHIP ROW (solution) - small labeled chip near corner
# ---------------------------------------------------------------------------
def chip(name, label, color=GREEN_B):
    img = new_canvas()
    d = ImageDraw.Draw(img)
    fnt = F_SEMI(46)
    tw = d.textbbox((0,0), label, font=fnt)[2]
    pad = 38
    cw = tw + pad*2 + 34
    ch = 96
    x0, y0 = 130, 150
    # chip bg
    chipimg = Image.new("RGBA", (cw, ch), (0,0,0,0))
    cd = ImageDraw.Draw(chipimg)
    cd.rounded_rectangle([0,0,cw,ch], radius=ch//2, fill=(10,22,40,225))
    cd.rounded_rectangle([0,0,cw,ch], radius=ch//2, outline=color, width=3)
    # dot
    cd.ellipse([pad-6, ch//2-9, pad+12, ch//2+9], fill=color)
    cd.text((pad+34, ch//2-30), label, font=fnt, fill=WHITE)
    img.alpha_composite(chipimg, (x0, y0))
    img.save(os.path.join(ASSETS, f"chip_{name}.png"))

# ---------------------------------------------------------------------------
# 6) TRANSITION ARROW CARD: "From reactive treatment -> To proactive prevention"
# ---------------------------------------------------------------------------
def shift_card():
    img = vignette_panel(238)
    d = ImageDraw.Draw(img)
    img = soft_shadow_text(img, (0, 300), "FROM  REACTIVE  TREATMENT", F_LIGHT(60), GREY, tracking=6, center_x=W//2, blur=6)
    d = ImageDraw.Draw(img)
    # arrow
    ax = W//2
    d.line([(ax-50, 470),(ax+50, 470)], fill=GREEN_B, width=6)
    d.polygon([(ax+50,455),(ax+85,470),(ax+50,485)], fill=GREEN_B)
    img = soft_shadow_text(img, (0, 540), "TO  PROACTIVE  PREVENTION", F_TITLE(78), WHITE, tracking=4, center_x=W//2, blur=10)
    d = ImageDraw.Draw(img)
    accent_rule(d, W//2, 680, w=240, color=TEAL, thick=6)
    img.save(os.path.join(ASSETS, "card_shift.png"))

# ---------------------------------------------------------------------------
# 7) ENVIRONMENTS GRID: Gyms / Schools / Workplaces / Community
# ---------------------------------------------------------------------------
def environments_card():
    img = vignette_panel(236)
    d = ImageDraw.Draw(img)
    img = soft_shadow_text(img, (0, 170), "INTELLIGENT  PREVENTIVE  COACHING", F_LIGHT(50), GREY, tracking=6, center_x=W//2, blur=6)
    d = ImageDraw.Draw(img)
    accent_rule(d, W//2, 270, w=200, color=GREEN_B, thick=5)
    items = ["GYMS", "SCHOOLS", "WORKPLACES", "COMMUNITY\nWELLNESS"]
    # 4 columns
    cols = 4
    gap = 60
    cw = (W - 260 - gap*(cols-1)) // cols
    x = 130
    y = 420
    ch = 340
    for it in items:
        card = Image.new("RGBA", (cw, ch), (0,0,0,0))
        cd = ImageDraw.Draw(card)
        cd.rounded_rectangle([0,0,cw,ch], radius=24, fill=(16,32,56,210))
        cd.rounded_rectangle([0,0,cw,ch], radius=24, outline=(46,204,113,140), width=2)
        # top accent line
        cd.rounded_rectangle([cw*0.18, 26, cw*0.82, 32], radius=3, fill=GREEN_B)
        # label centered
        lines = it.split("\n")
        ly = ch//2 - (len(lines)*54)//2 - 6
        for ln in lines:
            tw = cd.textbbox((0,0), ln, font=F_SEMI(46))[2]
            cd.text(((cw-tw)//2, ly), ln, font=F_SEMI(46), fill=WHITE)
            ly += 60
        img.alpha_composite(card, (x, y))
        x += cw + gap
    img.save(os.path.join(ASSETS, "card_environments.png"))

# ---------------------------------------------------------------------------
# 8) CLOSING CARD
# ---------------------------------------------------------------------------
def closing_card():
    img = vignette_panel(248)
    logo = load_logo(170)
    img.alpha_composite(logo, (W//2 - 85, 210))
    img = soft_shadow_text(img, (0, 420), "BeBTR", F_TITLE(140), WHITE, tracking=4, center_x=W//2, blur=14, offset=(0,6))
    d = ImageDraw.Draw(img)
    accent_rule(d, W//2, 600, w=300, color=GREEN_B, thick=6)
    img = soft_shadow_text(img, (0, 645), "Move better.  Train safer.  Build a healthier future.",
                           F_LIGHT(52), GREY, tracking=2, center_x=W//2, blur=6)
    d = ImageDraw.Draw(img)
    draw_tracked(d, (0, 760), "TEAM  LIMITLESS", F_SEMI(44), GREEN_B, tracking=12, anchor_center_x=W//2)
    img.save(os.path.join(ASSETS, "card_closing.png"))

# ---------------------------------------------------------------------------
# 9) Foresight question card
# ---------------------------------------------------------------------------
def foresight_card():
    img = new_canvas()
    # darken scrim full
    scrim = Image.new("RGBA",(W,H),(8,18,34,150))
    img = Image.alpha_composite(img, scrim)
    d = ImageDraw.Draw(img)
    draw_tracked(d, (0, 360), "A  FORESIGHT  QUESTION", F_SEMI(40), TEAL, tracking=10, anchor_center_x=W//2)
    img = soft_shadow_text(img, (0, 440), "What if the gym of the future", F_LIGHT(72), WHITE, tracking=2, center_x=W//2, blur=8)
    img = soft_shadow_text(img, (0, 540), "could prevent injury", F_TITLE(80), WHITE, tracking=2, center_x=W//2, blur=10)
    img = soft_shadow_text(img, (0, 640), "before it happens?", F_TITLE(80), GREEN_B, tracking=2, center_x=W//2, blur=10)
    img.save(os.path.join(ASSETS, "card_foresight.png"))

if __name__ == "__main__":
    opening_card()
    award_banner()
    lower_third()
    lower_third_team()
    foresight_card()
    # problem keywords
    keyword("poorform",   ["Poor form"],          color=(239,99,99))
    keyword("unsafe",     ["Unsafe habits"],       color=(239,99,99))
    keyword("injuries",   ["Preventable", "injuries"], color=(239,99,99))
    # solution keywords
    keyword("realtime",   ["Real-time", "posture correction"], color=GREEN_B, size=88)
    keyword("aifeedback", ["AI movement", "feedback"], color=GREEN_B, size=88)
    keyword("adaptive",   ["Adaptive training", "guidance"], color=GREEN_B, size=84)
    keyword("cv",         ["Computer vision", "+ wearable data"], color=TEAL, size=84)
    shift_card()
    environments_card()
    closing_card()
    print("All graphics generated ->", ASSETS)
    print(sorted(os.listdir(ASSETS)))
