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
    cyl("Trunk", 0.16, 1.15, root, bark, (0, 0, 0.55), segs=8, radius2=0.11)
    box("RootFlare", (0.42, 0.38, 0.12), root, bark, (0, 0, 0.06), bevel=0.02)
    sphere("Canopy", 0.95, root, leaf, (0, 0, 1.38), u=8, v=6, scale=(1.32, 1.18, 0.7))
    sphere("Canopy_A", 0.62, root, leaf, (0.38, 0.12, 1.78), u=7, v=5, scale=(1.15, 1.05, 0.78))
    sphere("Canopy_B", 0.48, root, leaf, (-0.32, -0.18, 1.55), u=7, v=5, scale=(1.2, 0.95, 0.7))
    return finalize(root, contract)


def build_willow(contract):
    bark, leaf = bark_foliage()
    root = new_root(contract["nodes"]["root"])
    cyl("Trunk", 0.14, 1.7, root, bark, (0, 0, 0.85), segs=8, radius2=0.09)
    sphere("Crown", 0.55, root, leaf, (0, 0, 2.05), u=7, v=5, scale=(1.4, 1.25, 0.7))
    sphere("Drape_L", 0.95, root, leaf, (-0.15, 0.05, 1.35), u=8, v=6, scale=(0.95, 0.9, 1.55))
    sphere("Drape_R", 0.85, root, leaf, (0.28, -0.08, 1.25), u=8, v=6, scale=(0.85, 0.8, 1.45))
    return finalize(root, contract)


def build_pine(contract):
    bark, leaf = bark_foliage()
    root = new_root(contract["nodes"]["root"])
    cyl("Trunk", 0.14, 1.55, root, bark, (0, 0, 0.75), segs=7, radius2=0.09)
    cone("Bough_0", 1.55, 0.18, 1.55, root, leaf, (0, 0, 1.45), segs=7)
    cone("Bough_1", 1.2, 0.14, 1.4, root, leaf, (0, 0, 2.25), segs=7)
    cone("Bough_2", 0.85, 0.1, 1.25, root, leaf, (0, 0, 3.05), segs=6)
    cone("Bough_3", 0.5, 0.02, 1.05, root, leaf, (0, 0, 3.75), segs=6)
    return finalize(root, contract)


def build_scrub(contract):
    bark, leaf = bark_foliage()
    root = new_root(contract["nodes"]["root"])
    cyl("Twig", 0.05, 0.45, root, bark, (0.1, 0, 0.22), segs=5)
    sphere("Lobe_A", 0.7, root, leaf, (0, 0, 0.52), u=7, v=5, scale=(1.35, 0.95, 0.68))
    sphere("Lobe_B", 0.48, root, leaf, (0.5, 0.12, 0.48), u=6, v=5, scale=(1.15, 0.85, 0.6))
    sphere("Lobe_C", 0.4, root, leaf, (-0.38, -0.16, 0.42), u=6, v=4, scale=(1.1, 0.9, 0.55))
    return finalize(root, contract)


def build_sage(contract):
    bark, leaf = bark_foliage()
    root = new_root(contract["nodes"]["root"])
    cyl("Stem", 0.03, 0.28, root, bark, (0, 0, 0.14), segs=5)
    sphere("Clump_A", 0.42, root, leaf, (0, 0, 0.34), u=6, v=4, scale=(1.25, 1.05, 0.7))
    sphere("Clump_B", 0.3, root, leaf, (0.42, 0.18, 0.28), u=6, v=4, scale=(1.15, 0.95, 0.65))
    sphere("Clump_C", 0.32, root, leaf, (-0.34, -0.14, 0.3), u=6, v=4, scale=(1.2, 1.0, 0.62))
    return finalize(root, contract)


def build_barn(contract):
    paint = mat("Mat_Paint", (0.69, 0.22, 0.18), roughness=0.5)
    roof = mat("Mat_Roof", (0.32, 0.22, 0.16), roughness=0.7)
    trim = mat("Mat_Trim", (0.86, 0.82, 0.72), roughness=0.45)
    root = new_root(contract["nodes"]["root"])
    box("Body", (7.0, 4.8, 3.4), root, paint, (0, 0, 1.7), bevel=0.04)
    box("Roof_L", (4.15, 5.2, 0.18), root, roof, (-1.48, 0, 3.95), rotation=(0, 0, 0.52), bevel=0.01)
    box("Roof_R", (4.15, 5.2, 0.18), root, roof, (1.48, 0, 3.95), rotation=(0, 0, -0.52), bevel=0.01)
    box("Ridge", (0.3, 5.3, 0.18), root, roof, (0, 0, 4.92))
    box("Door", (2.2, 0.1, 2.4), root, trim, (0, 2.42, 1.2), bevel=0.02)
    box("Brace_A", (0.12, 0.08, 2.5), root, roof, (-0.55, 2.48, 1.25), rotation=(0, 0.55, 0))
    box("Brace_B", (0.12, 0.08, 2.5), root, roof, (0.55, 2.48, 1.25), rotation=(0, -0.55, 0))
    box("Loft", (0.95, 0.08, 0.72), root, trim, (0, 2.44, 2.85))
    box("Sill", (2.4, 0.12, 0.12), root, roof, (0, 2.46, 0.08))
    return finalize(root, contract)


def build_windmill(contract):
    wood = mat("Mat_Wood", (0.48, 0.34, 0.22), roughness=0.72)
    sail = mat("Mat_Sail", (0.9, 0.86, 0.74), roughness=0.48)
    iron = mat("Mat_Iron", (0.18, 0.16, 0.14), metallic=0.55, roughness=0.4)
    root = new_root(contract["nodes"]["root"])
    cyl("Tower", 0.28, 5.2, root, wood, (0, 0, 2.6), segs=8, radius2=0.16)
    box("Deck", (0.95, 0.95, 0.08), root, wood, (0, 0, 5.15), bevel=0.01)
    box("Nacelle", (0.55, 0.72, 0.42), root, wood, (0, 0.08, 5.38), bevel=0.03)
    box("Tail", (0.08, 0.7, 0.28), root, iron, (0, 0.52, 5.42))
    blades = empty("Blades", root, (0, -0.38, 5.38))
    for i in range(4):
        box(
            f"Sail_{i}",
            (0.18, 0.05, 2.2),
            blades,
            sail,
            (0, 0, 1.12),
            rotation=(0, i * PI / 2, 0),
            bevel=0.01,
        )
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
    neon = mat("Mat_Neon", (0.86, 0.32, 0.18), roughness=0.35, emission=((0.78, 0.28, 0.12), 0.7))
    window = mat("Mat_Window", (0.55, 0.72, 0.78), roughness=0.12, emission=((0.35, 0.45, 0.5), 0.45), alpha=0.85)
    stripe = mat("Mat_Stripe", (0.78, 0.32, 0.14), roughness=0.5)
    root = new_root(contract["nodes"]["root"])
    box("Body", (7.2, 4.2, 2.6), root, chrome, (0, 0, 1.3), bevel=0.06)
    box("Roof", (7.8, 4.7, 0.22), root, roof, (0, 0, 2.68), bevel=0.02)
    box("Stripe", (7.22, 4.22, 0.16), root, stripe, (0, 0, 2.05))
    for i, x in enumerate((-2.2, 0.0, 2.2)):
        box(f"Window_{i}", (1.45, 0.08, 0.9), root, window, (x, 2.12, 1.45))
    box("Door", (1.1, 0.08, 1.7), root, chrome, (0, 2.14, 0.95), bevel=0.02)
    box("Post", (0.14, 0.14, 3.4), root, chrome, (-4.35, 1.55, 1.7))
    box("Sign", (2.2, 0.12, 0.7), root, neon, (-4.35, 1.55, 3.35), bevel=0.02)
    return finalize(root, contract)


def build_lighthouse(contract):
    paint = mat("Mat_Paint", (0.9, 0.88, 0.82), roughness=0.48)
    stripe = mat("Mat_Stripe", (0.64, 0.24, 0.18), roughness=0.5)
    lantern = mat("Mat_Lantern", (1.0, 0.9, 0.68), roughness=0.28, emission=((1.0, 0.82, 0.5), 0.85))
    capm = mat("Mat_Cap", (0.22, 0.16, 0.12), roughness=0.62)
    root = new_root(contract["nodes"]["root"])
    cyl("Base", 2.05, 1.2, root, stripe, (0, 0, 0.6), segs=10, radius2=1.75)
    cyl("Tower", 1.32, 6.2, root, paint, (0, 0, 4.2), segs=10, radius2=1.12)
    cyl("Stripe", 1.28, 1.55, root, stripe, (0, 0, 4.45), segs=10, radius2=1.18)
    cyl("Lantern", 0.88, 1.3, root, lantern, (0, 0, 8.0), segs=8, radius2=0.82)
    box("Gallery", (2.05, 2.05, 0.08), root, capm, (0, 0, 7.32))
    cone("Cap", 1.12, 0.08, 1.05, root, capm, (0, 0, 8.95), segs=8)
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
    cyl("Talus", 6.5, 1.1, root, dust, (0, 0, 0.55), segs=8, radius2=5.6)
    cyl("Butte", 5.5, 3.5, root, earth, (0, 0, 2.7), segs=8, radius2=4.7)
    cyl("Caprock", 4.85, 0.7, root, cap, (0, 0, 4.75), segs=8, radius2=4.55)
    return finalize(root, contract)


def build_chapel(contract):
    paint = mat("Mat_Paint", (0.9, 0.86, 0.78), roughness=0.48)
    roof = mat("Mat_Roof", (0.32, 0.26, 0.2), roughness=0.7)
    trim = mat("Mat_Trim", (0.22, 0.16, 0.12), roughness=0.6)
    glass = mat("Mat_Glass", (0.35, 0.42, 0.5), roughness=0.15, alpha=0.8)
    root = new_root(contract["nodes"]["root"])
    box("Nave", (3.6, 5.2, 2.6), root, paint, (0, 0, 1.3), bevel=0.04)
    cone("Roof", 3.35, 0.2, 1.75, root, roof, (0, 0, 3.45), segs=4)
    box("Door", (0.95, 0.1, 1.7), root, trim, (0, 2.62, 0.9), bevel=0.015)
    box("Window_L", (0.08, 0.7, 1.05), root, glass, (-1.82, 0.4, 1.45))
    box("Window_R", (0.08, 0.7, 1.05), root, glass, (1.82, 0.4, 1.45))
    box("Steeple", (0.72, 0.72, 2.2), root, paint, (0, -1.8, 3.7), bevel=0.02)
    cone("Spire", 0.55, 0.04, 1.3, root, trim, (0, -1.8, 5.4), segs=4)
    return finalize(root, contract)


def build_fence(contract):
    post = mat("Mat_Post", (0.26, 0.18, 0.12), roughness=0.82)
    rail = mat("Mat_Rail", (0.34, 0.24, 0.16), roughness=0.78)
    root = new_root(contract["nodes"]["root"])
    span = 10.0
    for i, y in enumerate((0.0, -span / 2, -span)):
        box(f"Post_{i}", (0.13, 0.13, 1.18), root, post, (0, y, 0.59), bevel=0.01)
        box(f"Cap_{i}", (0.16, 0.16, 0.05), root, rail, (0, y, 1.2))
    box("Rail_Lo", (0.07, span + 0.2, 0.08), root, rail, (0, -span / 2, 0.38))
    box("Rail_Hi", (0.07, span + 0.2, 0.08), root, rail, (0, -span / 2, 0.82))
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
    hide = mat("Mat_Hide", (0.45, 0.32, 0.18), roughness=0.78)
    dark = mat("Mat_Dark", (0.22, 0.14, 0.08), roughness=0.82)
    cream = mat("Mat_Cream", (0.86, 0.82, 0.72), roughness=0.7)
    root = new_root(contract["nodes"]["root"])
    box("Body", (0.28, 1.05, 0.32), root, hide, (0, 0.05, 0.72), bevel=0.04)
    sphere("Chest", 0.22, root, hide, (0, -0.42, 0.7), u=7, v=6)
    sphere("Rump", 0.24, root, hide, (0, 0.5, 0.72), u=7, v=6)
    disc("Patch", 0.18, root, cream, (0, 0.55, 0.62), segs=8)
    box("Tail", (0.07, 0.08, 0.2), root, cream, (0, 0.68, 0.88))
    head = empty("Head", root, (0, -0.52, 0.95))
    cyl("Neck", 0.1, 0.55, head, hide, (0, -0.02, 0.12), segs=6, radius2=0.06, rotation=(0.7, 0, 0))
    box("Skull", (0.16, 0.3, 0.14), head, dark, (0, -0.28, 0.32), bevel=0.02)
    box("Snout", (0.1, 0.22, 0.08), head, dark, (0, -0.46, 0.26), bevel=0.01)
    box("Nose", (0.07, 0.04, 0.045), head, cream, (0, -0.56, 0.26))
    cone("Ear_L", 0.05, 0.01, 0.24, head, hide, (-0.08, -0.22, 0.48), segs=4)
    cone("Ear_R", 0.05, 0.01, 0.24, head, hide, (0.08, -0.22, 0.48), segs=4)
    for i, (x, y) in enumerate(((-0.1, -0.32), (0.1, -0.32), (-0.1, 0.42), (0.1, 0.42))):
        box(f"Leg_{i}", (0.06, 0.06, 0.42), root, dark, (x, y, 0.32), bevel=0.008)
        box(f"Hoof_{i}", (0.07, 0.1, 0.06), root, dark, (x, y, 0.06))
    return finalize(root, contract)


def build_neon(contract):
    post = mat("Mat_Post", (0.2, 0.19, 0.18), roughness=0.6)
    neon = mat("Mat_Neon", (0.86, 0.38, 0.22), roughness=0.32, emission=((0.78, 0.28, 0.12), 0.75))
    eat = mat("Mat_Eat", (0.95, 0.88, 0.72), roughness=0.3, emission=((0.9, 0.72, 0.45), 0.55))
    root = new_root(contract["nodes"]["root"])
    box("Post", (0.12, 0.12, 3.6), root, post, (0, 0, 1.8), bevel=0.008)
    box("Board", (1.7, 0.1, 0.62), root, neon, (0, 0, 3.35), bevel=0.02)
    box("Script", (1.1, 0.08, 0.28), root, eat, (0, 0.08, 3.35), bevel=0.01)
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
