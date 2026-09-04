"""Low-poly roadside props. Origin on the ground. Optional yaw maps front to -Z in glTF."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from lib import (  # noqa: E402
    PI,
    argv_opts,
    box,
    cone,
    cyl,
    disc,
    empty,
    export_glb,
    finalize,
    ico,
    load_contract,
    mat,
    new_root,
    reset_scene,
    sphere,
)


def bark_foliage():
    return (
        mat("Mat_Bark", (0.28, 0.18, 0.12), roughness=0.88),
        mat("Mat_Foliage", (0.32, 0.48, 0.18), roughness=0.78),
    )


def build_round(contract):
    bark, leaf = bark_foliage()
    root = new_root(contract["nodes"]["root"])
    cyl("Trunk", 0.18, 1.35, root, bark, (0, 0, 0.68), segs=8, radius2=0.1)
    box("RootFlare", (0.55, 0.48, 0.16), root, bark, (0, 0, 0.08), bevel=0.03)
    cyl("Limb", 0.06, 0.7, root, bark, (0.28, 0.08, 1.35), segs=6, radius2=0.04, rotation=(0, 0.7, 0.35))
    ico("Canopy", 0.95, root, leaf, (0, 0, 1.72), scale=(1.45, 1.28, 0.92))
    ico("Canopy_A", 0.58, root, leaf, (0.55, 0.18, 2.05), scale=(1.2, 1.05, 0.85))
    ico("Canopy_B", 0.52, root, leaf, (-0.48, -0.22, 1.78), scale=(1.25, 1.1, 0.8))
    ico("Canopy_C", 0.42, root, leaf, (0.12, -0.4, 2.22), scale=(1.15, 1.0, 0.75))
    ico("Canopy_D", 0.38, root, leaf, (-0.2, 0.42, 1.55), scale=(1.1, 1.15, 0.7))
    return finalize(root, contract)


def build_willow(contract):
    bark, leaf = bark_foliage()
    root = new_root(contract["nodes"]["root"])
    cyl("Trunk", 0.15, 2.15, root, bark, (0.08, 0, 1.08), segs=8, radius2=0.08, rotation=(0.12, 0, 0.08))
    ico("Crown", 0.62, root, leaf, (0.05, 0, 2.35), scale=(1.55, 1.35, 0.7))
    ico("Drape_L", 0.85, root, leaf, (-0.35, 0.1, 1.45), scale=(0.85, 0.8, 1.75))
    ico("Drape_R", 0.78, root, leaf, (0.42, -0.12, 1.35), scale=(0.75, 0.7, 1.65))
    ico("Drape_C", 0.7, root, leaf, (0.05, 0.35, 1.2), scale=(0.7, 0.65, 1.5))
    ico("Drape_F", 0.62, root, leaf, (0.1, -0.38, 1.15), scale=(0.65, 0.6, 1.4))
    return finalize(root, contract)


def build_pine(contract):
    bark, leaf = bark_foliage()
    root = new_root(contract["nodes"]["root"])
    cyl("Trunk", 0.16, 1.85, root, bark, (0, 0, 0.92), segs=7, radius2=0.09)
    cone("Bough_0", 1.65, 0.22, 1.45, root, leaf, (0.05, 0, 1.35), segs=7, rotation=(0, 0, 0.06))
    cone("Bough_1", 1.28, 0.16, 1.35, root, leaf, (-0.06, 0.04, 2.15), segs=7, rotation=(0.04, 0.2, -0.05))
    cone("Bough_2", 0.92, 0.12, 1.2, root, leaf, (0.04, -0.05, 2.95), segs=6)
    cone("Bough_3", 0.55, 0.02, 1.15, root, leaf, (0, 0, 3.75), segs=6)
    cone("Bough_4", 0.28, 0.0, 0.7, root, leaf, (0, 0, 4.35), segs=5)
    return finalize(root, contract)


def build_scrub(contract):
    bark, leaf = bark_foliage()
    root = new_root(contract["nodes"]["root"])
    cyl("Twig", 0.05, 0.55, root, bark, (0.12, 0, 0.28), segs=5)
    ico("Lobe_A", 0.68, root, leaf, (0, 0, 0.58), scale=(1.55, 1.05, 0.78))
    ico("Lobe_B", 0.48, root, leaf, (0.58, 0.16, 0.52), scale=(1.25, 0.9, 0.65))
    ico("Lobe_C", 0.42, root, leaf, (-0.48, -0.18, 0.45), scale=(1.2, 1.0, 0.6))
    ico("Lobe_D", 0.32, root, leaf, (0.15, -0.4, 0.4), scale=(1.1, 0.85, 0.55))
    return finalize(root, contract)


def build_sage(contract):
    bark, leaf = bark_foliage()
    root = new_root(contract["nodes"]["root"])
    cyl("Stem", 0.03, 0.32, root, bark, (0, 0, 0.16), segs=5)
    ico("Clump_A", 0.4, root, leaf, (0, 0, 0.36), scale=(1.4, 1.15, 0.72))
    ico("Clump_B", 0.3, root, leaf, (0.48, 0.2, 0.3), scale=(1.25, 1.0, 0.62))
    ico("Clump_C", 0.32, root, leaf, (-0.4, -0.16, 0.32), scale=(1.3, 1.05, 0.6))
    ico("Clump_D", 0.22, root, leaf, (0.12, -0.32, 0.24), scale=(1.15, 0.9, 0.5))
    return finalize(root, contract)


def build_barn(contract):
    paint = mat("Mat_Paint", (0.69, 0.22, 0.18), roughness=0.5)
    roof = mat("Mat_Roof", (0.32, 0.22, 0.16), roughness=0.7)
    trim = mat("Mat_Trim", (0.86, 0.82, 0.72), roughness=0.45)
    stone = mat("Mat_Stone", (0.45, 0.4, 0.34), roughness=0.9)
    root = new_root(contract["nodes"]["root"])
    box("Foundation", (7.15, 4.95, 0.38), root, stone, (0, 0, 0.19), bevel=0.02)
    box("Body", (7.0, 4.8, 3.15), root, paint, (0, 0, 1.85), bevel=0.05)
    box("Corner_L", (0.16, 0.16, 3.15), root, trim, (-3.42, 2.32, 1.85))
    box("Corner_R", (0.16, 0.16, 3.15), root, trim, (3.42, 2.32, 1.85))
    box("Roof_L", (4.35, 5.45, 0.2), root, roof, (-1.55, 0, 4.12), rotation=(0, 0, 0.5), bevel=0.015)
    box("Roof_R", (4.35, 5.45, 0.2), root, roof, (1.55, 0, 4.12), rotation=(0, 0, -0.5), bevel=0.015)
    box("Ridge", (0.32, 5.5, 0.18), root, roof, (0, 0, 5.12))
    box("Door", (2.35, 0.12, 2.55), root, trim, (0, 2.44, 1.45), bevel=0.025)
    box("Brace_A", (0.14, 0.1, 2.7), root, roof, (-0.58, 2.52, 1.5), rotation=(0, 0.58, 0))
    box("Brace_B", (0.14, 0.1, 2.7), root, roof, (0.58, 2.52, 1.5), rotation=(0, -0.58, 0))
    box("Loft", (1.05, 0.1, 0.82), root, trim, (0, 2.46, 3.12), bevel=0.01)
    box("Sill", (2.55, 0.14, 0.14), root, roof, (0, 2.48, 0.38))
    box("Cupola", (0.85, 0.85, 0.7), root, paint, (0, 0, 5.52), bevel=0.03)
    box("CupolaRoof", (1.15, 1.15, 0.12), root, roof, (0, 0, 5.92), bevel=0.01)
    box("Vane", (0.06, 0.06, 0.55), root, trim, (0, 0, 6.28))
    box("VaneArm", (0.55, 0.08, 0.05), root, trim, (0.12, 0, 6.48))
    return finalize(root, contract)


def build_windmill(contract):
    wood = mat("Mat_Wood", (0.48, 0.34, 0.22), roughness=0.72)
    sail = mat("Mat_Sail", (0.92, 0.88, 0.76), roughness=0.48)
    iron = mat("Mat_Iron", (0.18, 0.16, 0.14), metallic=0.55, roughness=0.4)
    root = new_root(contract["nodes"]["root"])
    cyl("Tower", 0.42, 5.4, root, wood, (0, 0, 2.7), segs=8, radius2=0.18)
    box("Deck", (1.15, 1.15, 0.1), root, wood, (0, 0, 5.35), bevel=0.015)
    box("Nacelle", (0.62, 0.88, 0.48), root, wood, (0, 0.1, 5.58), bevel=0.04)
    box("Tail", (0.08, 0.85, 0.32), root, iron, (0, 0.62, 5.62))
    blades = empty("Blades", root, (0, -0.42, 5.58))
    for i in range(4):
        ang = i * PI / 2
        box(f"Sail_{i}", (0.55, 0.04, 2.45), blades, sail, (0, 0, 1.28), rotation=(0, ang, 0), bevel=0.012)
        box(f"Frame_{i}", (0.08, 0.06, 2.5), blades, wood, (0, 0.02, 1.28), rotation=(0, ang, 0))
    return finalize(root, contract)


def build_silo(contract):
    metal = mat("Mat_Metal", (0.62, 0.6, 0.54), metallic=0.35, roughness=0.42)
    cap = mat("Mat_Cap", (0.48, 0.24, 0.16), roughness=0.5)
    rust = mat("Mat_Rust", (0.42, 0.22, 0.12), roughness=0.7)
    root = new_root(contract["nodes"]["root"])
    cyl("Drum", 1.2, 5.4, root, metal, (0, 0, 2.7), segs=10, radius2=1.12)
    cyl("Hoop_A", 1.24, 0.08, root, rust, (0, 0, 1.4), segs=10)
    cyl("Hoop_B", 1.22, 0.08, root, rust, (0, 0, 3.1), segs=10)
    cone("Cap", 1.32, 0.12, 1.15, root, cap, (0, 0, 5.95), segs=10)
    box("Chute", (0.42, 0.55, 1.35), root, rust, (0.95, 0.1, 1.2), bevel=0.02)
    return finalize(root, contract)


def build_pond(contract):
    water = mat("Mat_Water", (0.22, 0.42, 0.4), roughness=0.12, alpha=0.78)
    wood = mat("Mat_Wood", (0.38, 0.28, 0.2), roughness=0.8)
    bank = mat("Mat_Bank", (0.42, 0.48, 0.3), roughness=0.86)
    root = new_root(contract["nodes"]["root"])
    disc("Bank", 8.2, root, bank, (0, 0, 0.03), segs=18)
    disc("Water", 7.15, root, water, (0, 0, 0.05), segs=16)
    box("Dock", (1.4, 4.2, 0.14), root, wood, (0.2, 2.4, 0.16), bevel=0.01)
    for i, y in enumerate((1.1, 2.4, 3.6)):
        cyl(f"Pile_{i}", 0.07, 0.55, root, wood, (0.75 if i % 2 else -0.35, y, 0.22), segs=6)
    box("Shed", (2.2, 2.4, 1.6), root, wood, (3.2, -1.6, 0.8), bevel=0.03)
    box("ShedRoof", (2.55, 2.7, 0.14), root, bank, (3.2, -1.6, 1.68), bevel=0.01)
    return finalize(root, contract)


def build_diner(contract):
    chrome = mat("Mat_Chrome", (0.82, 0.84, 0.86), metallic=0.72, roughness=0.18)
    roof = mat("Mat_Roof", (0.66, 0.18, 0.14), roughness=0.42)
    neon = mat("Mat_Neon", (0.86, 0.32, 0.18), roughness=0.35, emission=((0.78, 0.28, 0.12), 0.85))
    window = mat("Mat_Window", (0.55, 0.72, 0.78), roughness=0.12, emission=((0.35, 0.45, 0.5), 0.55), alpha=0.85)
    stripe = mat("Mat_Stripe", (0.78, 0.32, 0.14), roughness=0.5)
    root = new_root(contract["nodes"]["root"])
    box("Body", (7.4, 4.3, 2.55), root, chrome, (0, 0, 1.28), bevel=0.1)
    box("Roof", (8.0, 4.85, 0.24), root, roof, (0, 0, 2.72), bevel=0.03)
    box("Awning", (7.6, 0.85, 0.08), root, stripe, (0, 2.35, 2.18), rotation=(0.35, 0, 0))
    box("Stripe", (7.42, 4.32, 0.18), root, stripe, (0, 0, 2.08))
    for i, x in enumerate((-2.3, 0.0, 2.3)):
        box(f"Window_{i}", (1.55, 0.1, 1.0), root, window, (x, 2.18, 1.5))
    box("Door", (1.15, 0.1, 1.75), root, chrome, (0, 2.2, 0.98), bevel=0.025)
    box("Steps", (1.35, 0.55, 0.22), root, chrome, (0, 2.55, 0.12), bevel=0.02)
    box("Post", (0.16, 0.16, 3.7), root, chrome, (-4.55, 1.7, 1.85))
    box("Sign", (2.55, 0.14, 0.85), root, neon, (-4.55, 1.7, 3.55), bevel=0.03)
    box("Arrow", (0.7, 0.12, 0.35), root, neon, (-3.15, 1.7, 3.55), bevel=0.02)
    return finalize(root, contract)


def build_lighthouse(contract):
    paint = mat("Mat_Paint", (0.9, 0.88, 0.82), roughness=0.48)
    stripe = mat("Mat_Stripe", (0.64, 0.24, 0.18), roughness=0.5)
    lantern = mat("Mat_Lantern", (1.0, 0.9, 0.68), roughness=0.28, emission=((1.0, 0.82, 0.5), 1.05))
    capm = mat("Mat_Cap", (0.22, 0.16, 0.12), roughness=0.62)
    root = new_root(contract["nodes"]["root"])
    cyl("Base", 2.15, 1.35, root, stripe, (0, 0, 0.68), segs=10, radius2=1.8)
    cyl("Tower", 1.38, 6.35, root, paint, (0, 0, 4.3), segs=10, radius2=1.08)
    cyl("Stripe", 1.32, 1.65, root, stripe, (0, 0, 4.55), segs=10, radius2=1.2)
    box("Door", (0.7, 0.12, 1.55), root, capm, (0, 1.55, 1.05), bevel=0.02)
    cyl("Lantern", 0.92, 1.45, root, lantern, (0, 0, 8.15), segs=8, radius2=0.85)
    box("Gallery", (2.25, 2.25, 0.1), root, capm, (0, 0, 7.38), bevel=0.01)
    for i, (x, y) in enumerate(((1.05, 0.0), (-1.05, 0.0), (0.0, 1.05), (0.0, -1.05))):
        box(f"Rail_{i}", (0.06, 0.06, 0.32), root, capm, (x, y, 7.58))
    cone("Cap", 1.18, 0.06, 1.15, root, capm, (0, 0, 9.15), segs=8)
    return finalize(root, contract)


def build_rocks(contract):
    stone = mat("Mat_Stone", (0.42, 0.4, 0.38), roughness=0.9)
    lichen = mat("Mat_Lichen", (0.36, 0.42, 0.28), roughness=0.86)
    root = new_root(contract["nodes"]["root"])
    ico("Boulder_A", 1.15, root, stone, (-0.8, 0.2, 0.98), scale=(1.35, 1.1, 0.85))
    ico("Boulder_B", 0.85, root, lichen, (1.3, -0.4, 0.6), scale=(1.2, 0.95, 0.7))
    ico("Boulder_C", 0.7, root, stone, (0.2, 1.4, 0.46), scale=(1.4, 1.05, 0.65))
    ico("Boulder_D", 0.55, root, lichen, (-1.6, -1.1, 0.34), scale=(1.15, 1.25, 0.6))
    return finalize(root, contract)


def build_dock(contract):
    water = mat("Mat_Water", (0.2, 0.38, 0.42), roughness=0.14, alpha=0.8)
    wood = mat("Mat_Wood", (0.4, 0.3, 0.22), roughness=0.82)
    paint = mat("Mat_Paint", (0.82, 0.78, 0.68), roughness=0.5)
    root = new_root(contract["nodes"]["root"])
    disc("Water", 8.6, root, water, (0, 0, 0.04), segs=18)
    box("Pier", (1.6, 6.5, 0.16), root, wood, (0, 2.6, 0.18), bevel=0.01)
    for i, y in enumerate((0.4, 2.4, 4.4)):
        cyl(f"Pile_{i}", 0.09, 0.7, root, wood, (-0.7, y, 0.2), segs=6)
        cyl(f"PileR_{i}", 0.09, 0.7, root, wood, (0.7, y, 0.2), segs=6)
    box("Hull", (1.1, 2.4, 0.35), root, paint, (2.4, 1.6, 0.22), bevel=0.04)
    box("House", (2.6, 2.8, 1.8), root, paint, (-3.4, -1.2, 0.9), bevel=0.03)
    box("HouseRoof", (2.95, 3.15, 0.14), root, wood, (-3.4, -1.2, 1.86))
    return finalize(root, contract)


def build_mesa(contract):
    earth = mat("Mat_Earth", (0.64, 0.42, 0.24), roughness=0.88)
    cap = mat("Mat_Cap", (0.74, 0.55, 0.32), roughness=0.8)
    dust = mat("Mat_Dust", (0.7, 0.52, 0.34), roughness=0.92)
    root = new_root(contract["nodes"]["root"])
    cyl("Talus", 6.7, 1.2, root, dust, (0, 0, 0.6), segs=8, radius2=5.5)
    cyl("Butte", 5.4, 3.35, root, earth, (0, 0, 2.65), segs=8, radius2=4.55)
    cyl("Mid", 5.0, 0.45, root, dust, (0, 0, 4.2), segs=8, radius2=4.7)
    cyl("Caprock", 4.95, 0.85, root, cap, (0, 0, 4.85), segs=8, radius2=4.5)
    ico("Notch", 0.85, root, dust, (2.4, 0.8, 1.4), scale=(1.4, 1.1, 0.7))
    return finalize(root, contract)


def build_chapel(contract):
    paint = mat("Mat_Paint", (0.92, 0.88, 0.8), roughness=0.48)
    roof = mat("Mat_Roof", (0.32, 0.26, 0.2), roughness=0.7)
    trim = mat("Mat_Trim", (0.22, 0.16, 0.12), roughness=0.6)
    glass = mat("Mat_Glass", (0.42, 0.28, 0.55), roughness=0.12, emission=((0.25, 0.12, 0.35), 0.25), alpha=0.82)
    root = new_root(contract["nodes"]["root"])
    box("Nave", (3.7, 5.35, 2.7), root, paint, (0, 0, 1.35), bevel=0.06)
    cone("Roof", 3.45, 0.12, 1.95, root, roof, (0, 0, 3.58), segs=4)
    box("Door", (1.05, 0.12, 1.85), root, trim, (0, 2.7, 0.95), bevel=0.02)
    box("Steps", (1.35, 0.55, 0.2), root, paint, (0, 3.05, 0.1), bevel=0.015)
    box("Window_L", (0.1, 0.62, 1.25), root, glass, (-1.88, 0.35, 1.55))
    box("Window_R", (0.1, 0.62, 1.25), root, glass, (1.88, 0.35, 1.55))
    box("Steeple", (0.82, 0.82, 2.45), root, paint, (0, -1.85, 3.85), bevel=0.03)
    cone("Spire", 0.62, 0.03, 1.55, root, trim, (0, -1.85, 5.7), segs=4)
    box("CrossV", (0.07, 0.07, 0.55), root, trim, (0, -1.85, 6.55))
    box("CrossH", (0.38, 0.07, 0.07), root, trim, (0, -1.85, 6.62))
    return finalize(root, contract)


def build_fence(contract):
    post = mat("Mat_Post", (0.26, 0.18, 0.12), roughness=0.82)
    rail = mat("Mat_Rail", (0.34, 0.24, 0.16), roughness=0.78)
    root = new_root(contract["nodes"]["root"])
    span = 10.0
    for i, y in enumerate((0.0, -span / 2, -span)):
        box(f"Post_{i}", (0.16, 0.16, 1.28), root, post, (0, y, 0.64), bevel=0.015)
        box(f"Cap_{i}", (0.2, 0.2, 0.07), root, rail, (0, y, 1.3), bevel=0.01)
    box("Rail_Lo", (0.08, span + 0.25, 0.09), root, rail, (0, -span / 2, 0.32), bevel=0.01)
    box("Rail_Mid", (0.08, span + 0.25, 0.09), root, rail, (0, -span / 2, 0.62), bevel=0.01)
    box("Rail_Hi", (0.08, span + 0.25, 0.09), root, rail, (0, -span / 2, 0.92), bevel=0.01)
    return finalize(root, contract)


def build_reed(contract):
    stem = mat("Mat_Stem", (0.36, 0.44, 0.22), roughness=0.8)
    head = mat("Mat_Head", (0.38, 0.26, 0.14), roughness=0.7)
    root = new_root(contract["nodes"]["root"])
    pts = [(-0.22, 0.04, 1.15), (0.0, -0.06, 1.35), (0.2, 0.08, 1.2), (-0.08, 0.16, 1.05), (0.12, -0.14, 1.25)]
    for i, (x, y, h) in enumerate(pts):
        cyl(f"Stem_{i}" if i < 2 else f"StemX_{i}", 0.028, h, root, stem, (x, y, h / 2), segs=5, radius2=0.018)
        sphere(f"Head_{i}" if i < 2 else f"HeadX_{i}", 0.07, root, head, (x, y, h + 0.04), u=5, v=4, scale=(0.7, 0.7, 1.3))
    return finalize(root, contract)


def build_mailbox(contract):
    postm = mat("Mat_Post", (0.32, 0.24, 0.18), roughness=0.8)
    boxm = mat("Mat_Box", (0.28, 0.36, 0.42), roughness=0.45)
    flag = mat("Mat_Flag", (0.72, 0.16, 0.12), roughness=0.4)
    root = new_root(contract["nodes"]["root"])
    box("Post", (0.1, 0.1, 1.1), root, postm, (0, 0, 0.55), bevel=0.005)
    box("Box", (0.28, 0.5, 0.22), root, boxm, (0, 0.05, 1.18), bevel=0.02)
    box("Door", (0.24, 0.04, 0.18), root, boxm, (0, 0.3, 1.18))
    box("Flag", (0.04, 0.22, 0.08), root, flag, (0.18, 0.02, 1.28))
    return finalize(root, contract)


def build_lamp(contract):
    iron = mat("Mat_Iron", (0.18, 0.17, 0.16), metallic=0.4, roughness=0.48)
    bulb = mat("Mat_Bulb", (1.0, 0.9, 0.7), roughness=0.25, emission=((1.0, 0.82, 0.5), 0.6))
    root = new_root(contract["nodes"]["root"])
    cyl("Post", 0.08, 3.15, root, iron, (0, 0, 1.57), segs=8, radius2=0.06)
    box("Arm", (0.06, 0.55, 0.06), root, iron, (0, -0.22, 3.12), bevel=0.005)
    cyl("Housing", 0.18, 0.16, root, iron, (0, -0.48, 3.02), segs=8)
    sphere("Bulb", 0.14, root, bulb, (0, -0.48, 2.88), u=7, v=5)
    return finalize(root, contract)


def build_hay(contract):
    straw = mat("Mat_Straw", (0.72, 0.58, 0.26), roughness=0.82)
    twine = mat("Mat_Twine", (0.42, 0.32, 0.16), roughness=0.7)
    root = new_root(contract["nodes"]["root"])
    cyl("Bale", 0.7, 1.18, root, straw, (0, 0, 0.7), axis="X", segs=10)
    cyl("Twine_A", 0.72, 0.05, root, twine, (-0.22, 0, 0.7), axis="X", segs=10)
    cyl("Twine_B", 0.72, 0.05, root, twine, (0.22, 0, 0.7), axis="X", segs=10)
    return finalize(root, contract)


def build_dune(contract):
    sand = mat("Mat_Sand", (0.8, 0.7, 0.5), roughness=0.9)
    shadow = mat("Mat_Shadow", (0.62, 0.5, 0.34), roughness=0.92)
    root = new_root(contract["nodes"]["root"])
    sphere("Rise", 2.35, root, sand, (0, 0, 0.52), u=8, v=6, scale=(1.85, 1.15, 0.28))
    sphere("Crest", 1.4, root, sand, (0.6, -0.2, 0.7), u=7, v=5, scale=(1.4, 1.0, 0.32))
    sphere("Slip", 1.55, root, shadow, (-0.9, 0.35, 0.38), u=7, v=5, scale=(1.5, 1.2, 0.22))
    return finalize(root, contract)


def build_tuft(contract):
    blade = mat("Mat_Blade", (0.36, 0.48, 0.2), roughness=0.8)
    tip = mat("Mat_Tip", (0.5, 0.58, 0.28), roughness=0.75)
    root = new_root(contract["nodes"]["root"])
    cone("Blade_0", 0.12, 0.01, 0.58, root, blade, (0.02, 0, 0.29), segs=5, rotation=(0.12, 0, 0.08))
    cone("Blade_1", 0.1, 0.01, 0.5, root, tip, (-0.08, 0.05, 0.25), segs=5, rotation=(-0.18, 0.4, -0.1))
    cone("Blade_2", 0.11, 0.01, 0.46, root, blade, (0.06, -0.06, 0.23), segs=5, rotation=(0.2, -0.3, 0.12))
    return finalize(root, contract)


def build_rock(contract):
    stone = mat("Mat_Stone", (0.42, 0.4, 0.38), roughness=0.9)
    moss = mat("Mat_Moss", (0.3, 0.38, 0.22), roughness=0.86)
    root = new_root(contract["nodes"]["root"])
    ico("Boulder", 0.4, root, stone, (0, 0, 0.26), scale=(1.15, 1.05, 0.78))
    ico("Chip", 0.16, root, moss, (0.28, -0.1, 0.12), scale=(1.2, 0.9, 0.7))
    return finalize(root, contract)


def build_wildflowers(contract):
    stem = mat("Mat_Stem", (0.26, 0.4, 0.16), roughness=0.8)
    bloom = mat("Mat_Bloom", (0.78, 0.32, 0.18), roughness=0.45)
    root = new_root(contract["nodes"]["root"])
    pts = [(-0.16, 0.04, 0.42), (0.12, -0.06, 0.5), (0.02, 0.12, 0.38), (-0.04, -0.1, 0.46)]
    for i, (x, y, h) in enumerate(pts):
        name = f"Stem_{i}" if i < 2 else f"StemX_{i}"
        bname = f"Bloom_{i}" if i < 2 else f"BloomX_{i}"
        cyl(name, 0.018, h, root, stem, (x, y, h / 2), segs=4, radius2=0.012)
        sphere(bname, 0.07, root, bloom, (x, y, h + 0.02), u=5, v=4)
    return finalize(root, contract)


def build_sign(contract):
    pole = mat("Mat_Pole", (0.32, 0.3, 0.26), roughness=0.7)
    board = mat("Mat_Board", (0.72, 0.58, 0.26), roughness=0.55)
    root = new_root(contract["nodes"]["root"])
    box("Pole", (0.08, 0.08, 1.8), root, pole, (0, 0, 0.9), bevel=0.005)
    box("Board", (0.72, 0.06, 0.5), root, board, (0, 0, 1.72), bevel=0.01)
    cyl("Bolt", 0.03, 0.08, root, pole, (0, 0.04, 1.72), axis="Y", segs=6)
    return finalize(root, contract)


def build_mail(contract):
    paint = mat("Mat_Paint", (0.92, 0.92, 0.9), roughness=0.42)
    stripe = mat("Mat_Stripe", (0.16, 0.28, 0.55), roughness=0.45)
    glass = mat("Mat_Glass", (0.12, 0.16, 0.2), roughness=0.1, alpha=0.7)
    rubber = mat("Mat_Rubber", (0.08, 0.07, 0.06), roughness=0.9)
    root = new_root(contract["nodes"]["root"])
    box("Body", (1.55, 3.35, 1.35), root, paint, (0, 0.15, 0.95), bevel=0.04)
    box("Cab", (1.55, 1.05, 0.72), root, paint, (0, -1.15, 1.55), bevel=0.03)
    box("Stripe", (1.57, 3.36, 0.22), root, stripe, (0, 0.15, 1.05))
    box("Glass", (1.2, 0.06, 0.42), root, glass, (0, -1.66, 1.58))
    box("Bumper", (1.58, 0.16, 0.12), root, stripe, (0, -1.78, 0.42), bevel=0.01)
    for name, x, y in (("Wheel_FL", -0.7, -1.05), ("Wheel_FR", 0.7, -1.05), ("Wheel_RL", -0.7, 1.2), ("Wheel_RR", 0.7, 1.2)):
        cyl(name, 0.28, 0.2, root, rubber, (x, y, 0.28), axis="X", segs=10)
    return finalize(root, contract)


def build_deer(contract):
    hide = mat("Mat_Hide", (0.52, 0.36, 0.2), roughness=0.78)
    dark = mat("Mat_Dark", (0.2, 0.12, 0.07), roughness=0.82)
    cream = mat("Mat_Cream", (0.9, 0.86, 0.76), roughness=0.7)
    root = new_root(contract["nodes"]["root"])
    sphere("Body", 0.2, root, hide, (0, 0.02, 0.58), u=9, v=7, scale=(0.85, 2.05, 0.72))
    sphere("Chest", 0.16, root, hide, (0, -0.34, 0.56), u=8, v=6, scale=(1.1, 1.15, 1.0))
    sphere("Rump", 0.18, root, hide, (0, 0.38, 0.6), u=8, v=6, scale=(1.15, 1.1, 1.0))
    ico("Patch", 0.12, root, cream, (0, 0.48, 0.52), scale=(1.1, 0.7, 0.55))
    box("Tail", (0.05, 0.06, 0.16), root, cream, (0, 0.55, 0.78), rotation=(0.4, 0, 0), bevel=0.01)
    head = empty("Head", root, (0, -0.42, 0.78))
    cyl("Neck", 0.07, 0.38, head, hide, (0, -0.04, 0.1), segs=7, radius2=0.05, rotation=(0.95, 0, 0))
    box("Skull", (0.13, 0.16, 0.11), head, hide, (0, -0.22, 0.28), bevel=0.025)
    box("Snout", (0.08, 0.14, 0.07), head, dark, (0, -0.34, 0.24), bevel=0.012)
    box("Nose", (0.05, 0.03, 0.035), head, dark, (0, -0.42, 0.24))
    cone("Ear_L", 0.045, 0.008, 0.16, head, hide, (-0.07, -0.16, 0.4), segs=4, rotation=(0.15, 0, 0.35))
    cone("Ear_R", 0.045, 0.008, 0.16, head, hide, (0.07, -0.16, 0.4), segs=4, rotation=(0.15, 0, -0.35))
    for i, (x, y) in enumerate(((-0.08, -0.28), (0.08, -0.28), (-0.08, 0.34), (0.08, 0.34))):
        box(f"Leg_{i}", (0.045, 0.045, 0.5), root, dark, (x, y, 0.28), bevel=0.008)
        box(f"Hoof_{i}", (0.06, 0.08, 0.05), root, dark, (x, y, 0.04), bevel=0.006)
    return finalize(root, contract)


def build_neon(contract):
    post = mat("Mat_Post", (0.2, 0.19, 0.18), roughness=0.6)
    neon = mat("Mat_Neon", (0.9, 0.32, 0.16), roughness=0.28, emission=((0.85, 0.22, 0.08), 0.95))
    eat = mat("Mat_Eat", (0.98, 0.9, 0.72), roughness=0.28, emission=((0.95, 0.75, 0.4), 0.7))
    root = new_root(contract["nodes"]["root"])
    box("Post", (0.14, 0.14, 3.75), root, post, (0, 0, 1.88), bevel=0.01)
    box("Board", (2.05, 0.12, 0.78), root, neon, (0, 0, 3.52), bevel=0.03)
    box("Script", (1.35, 0.1, 0.32), root, eat, (0, 0.1, 3.52), bevel=0.015)
    box("Arrow", (0.55, 0.1, 0.28), root, neon, (1.15, 0, 3.22), bevel=0.015)
    return finalize(root, contract)


BUILDERS = {
    "round": build_round,
    "willow": build_willow,
    "pine": build_pine,
    "scrub": build_scrub,
    "sage": build_sage,
    "barn": build_barn,
    "windmill": build_windmill,
    "silo": build_silo,
    "pond": build_pond,
    "diner": build_diner,
    "lighthouse": build_lighthouse,
    "rocks": build_rocks,
    "dock": build_dock,
    "mesa": build_mesa,
    "chapel": build_chapel,
    "fence": build_fence,
    "reed": build_reed,
    "mailbox": build_mailbox,
    "lamp": build_lamp,
    "hay": build_hay,
    "dune": build_dune,
    "tuft": build_tuft,
    "rock": build_rock,
    "wildflowers": build_wildflowers,
    "sign": build_sign,
    "mail": build_mail,
    "deer": build_deer,
    "neon": build_neon,
}


def forge_one(contract, out: Path):
    builder = BUILDERS.get(contract["id"])
    if not builder:
        raise SystemExit(f"no builder for {contract['id']}")
    reset_scene()
    builder(contract)
    export_glb(out)


def main():
    out, contract_path = argv_opts()
    args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    if "--all" in args:
        outdir = Path(out) if out else ROOT.parent.parent / "generated" / ".staging"
        outdir.mkdir(parents=True, exist_ok=True)
        for ident in BUILDERS:
            contract = load_contract(ROOT / "contracts" / f"{ident}.json")
            forge_one(contract, outdir / contract["file"])
        return
    if not contract_path:
        raise SystemExit("missing --contract")
    contract = load_contract(contract_path)
    if out is None:
        out = ROOT.parent.parent / "generated" / ".staging" / contract["file"]
    forge_one(contract, out)


if __name__ == "__main__":
    main()
