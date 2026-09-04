"""Stylized woodie wagon. Origin on ground. Hood toward -Z after glTF Y-up export."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Matrix

ROOT = Path(__file__).resolve().parent
CONTRACT_PATH = ROOT / "contracts" / "wagon.json"


def argv_opts():
    args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    out = None
    contract = CONTRACT_PATH
    i = 0
    while i < len(args):
        if args[i] == "--out" and i + 1 < len(args):
            out = Path(args[i + 1])
            i += 2
            continue
        if args[i] == "--contract" and i + 1 < len(args):
            contract = Path(args[i + 1])
            i += 2
            continue
        i += 1
    return out, contract


def mat(name, color, metallic=0.0, roughness=0.55, emission=None, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    principled = m.node_tree.nodes.get("Principled BSDF")
    principled.inputs["Base Color"].default_value = (*color, 1.0)
    principled.inputs["Metallic"].default_value = metallic
    principled.inputs["Roughness"].default_value = roughness
    if alpha < 1:
        principled.inputs["Alpha"].default_value = alpha
        m.blend_method = "BLEND"
        m.use_backface_culling = True
    if emission:
        principled.inputs["Emission Color"].default_value = (*emission[0], 1.0)
        principled.inputs["Emission Strength"].default_value = emission[1]
    return m


def project_uv(bm):
    uv_layer = bm.loops.layers.uv.verify()
    for face in bm.faces:
        n = face.normal
        for loop in face.loops:
            v = loop.vert.co
            if abs(n.z) >= abs(n.x) and abs(n.z) >= abs(n.y):
                loop[uv_layer].uv = ((v.x + 1.0) * 0.35, (v.y + 2.2) * 0.22)
            elif abs(n.y) >= abs(n.x):
                loop[uv_layer].uv = ((v.x + 1.0) * 0.35, (v.z + 0.2) * 0.9)
            else:
                loop[uv_layer].uv = ((v.y + 2.2) * 0.22, (v.z + 0.2) * 0.9)


def mesh_obj(name, bm, parent, material, location=(0, 0, 0)):
    project_uv(bm)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    obj.location = location
    if material:
        obj.data.materials.append(material)
    bpy.context.collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj


def box(name, size, parent, material, location=(0, 0, 0), bevel=0.0):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
        v.co.z *= size[2]
    if bevel > 0:
        bmesh.ops.bevel(
            bm,
            geom=bm.edges[:] + bm.verts[:],
            offset=bevel,
            segments=2,
            affect="EDGES",
        )
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return mesh_obj(name, bm, parent, material, location)


def cyl(name, radius, depth, parent, material, location, axis="X", segs=16):
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm,
        cap_ends=True,
        cap_tris=False,
        segments=segs,
        radius1=radius,
        radius2=radius,
        depth=depth,
    )
    if axis == "X":
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(1.57079632679, 3, "Y"))
    elif axis == "Y":
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(1.57079632679, 3, "X"))
    return mesh_obj(name, bm, parent, material, location)


def empty(name, parent, location):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_size = 0.12
    obj.location = location
    bpy.context.collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj


def required_names(contract):
    nodes = contract["nodes"]
    names = [nodes["root"], *nodes["wheels"], *nodes["headlamps"], *nodes["tails"]]
    names.extend(nodes["anchors"].values())
    return names


def build(contract):
    bpy.ops.wm.read_factory_settings(use_empty=True)

    cream = mat("Mat_Body", (0.95, 0.88, 0.76), roughness=0.42)
    wood = mat("Mat_Wood", (0.62, 0.38, 0.18), roughness=0.72)
    dark = mat("Mat_Dark", (0.07, 0.06, 0.05), roughness=0.82)
    chrome = mat("Mat_Chrome", (0.86, 0.84, 0.78), metallic=0.82, roughness=0.16)
    glass = mat("Mat_Glass", (0.10, 0.14, 0.16), roughness=0.08, alpha=0.62)
    rubber = mat("Mat_Rubber", (0.06, 0.05, 0.04), roughness=0.9)
    interior = mat("Mat_Interior", (0.10, 0.07, 0.05), roughness=0.92)
    lights = mat("Mat_Lights", (1.0, 0.90, 0.70), roughness=0.32, emission=((1.0, 0.85, 0.55), 0.7))
    tails = mat("Mat_Tails", (0.78, 0.16, 0.07), roughness=0.38, emission=((0.62, 0.07, 0.03), 0.55))
    amber = mat("Mat_Amber", (0.90, 0.55, 0.18), roughness=0.4, emission=((0.75, 0.4, 0.08), 0.35))
    plate = mat("Mat_Plate", (0.92, 0.88, 0.78), roughness=0.6)
    reverse = mat("Mat_Reverse", (0.92, 0.92, 0.88), roughness=0.35, emission=((0.9, 0.9, 0.85), 0.15))

    root = bpy.data.objects.new(contract["nodes"]["root"], None)
    bpy.context.collection.objects.link(root)

    # Built in Blender Z-up with hood toward -Y. Root yaw 180° maps hood to -Z in glTF.
    box("Body", (1.84, 4.18, 0.48), root, cream, (0, 0.06, 0.62), bevel=0.055)
    box("Skirt", (1.90, 4.16, 0.11), root, dark, (0, 0.05, 0.37), bevel=0.01)
    hood = box("Hood", (1.68, 1.46, 0.09), root, cream, (0, -1.36, 0.90), bevel=0.035)
    hood.rotation_euler[0] = 0.11
    box("Cabin", (1.50, 1.62, 0.34), root, cream, (0, 0.18, 1.05), bevel=0.04)
    box("Roof", (1.32, 1.72, 0.055), root, cream, (0, 0.28, 1.30), bevel=0.02)
    slope = box("RearSlope", (1.30, 0.48, 0.05), root, cream, (0, 1.22, 1.26), bevel=0.015)
    slope.rotation_euler[0] = -0.58
    box("Interior", (1.36, 1.48, 0.26), root, interior, (0, 0.22, 0.94))

    box("Wood_L", (0.06, 3.36, 0.56), root, wood, (-0.95, 0.22, 0.74), bevel=0.008)
    box("Wood_R", (0.06, 3.36, 0.56), root, wood, (0.95, 0.22, 0.74), bevel=0.008)
    box("ChromeHi_L", (0.025, 3.38, 0.03), root, chrome, (-0.99, 0.22, 1.03))
    box("ChromeHi_R", (0.025, 3.38, 0.03), root, chrome, (0.99, 0.22, 1.03))
    box("ChromeLo_L", (0.025, 3.38, 0.028), root, chrome, (-0.99, 0.22, 0.46))
    box("ChromeLo_R", (0.025, 3.38, 0.028), root, chrome, (0.99, 0.22, 0.46))

    box("TailWood", (1.70, 0.09, 0.86), root, wood, (0, 2.20, 0.78), bevel=0.012)
    box("TailChromeTop", (1.72, 0.04, 0.03), root, chrome, (0, 2.24, 1.20))
    box("TailChromeMid", (1.72, 0.035, 0.025), root, chrome, (0, 2.24, 0.42))

    box("Drip_L", (0.035, 2.00, 0.035), root, cream, (-0.63, 0.44, 1.33))
    box("Drip_R", (0.035, 2.00, 0.035), root, cream, (0.63, 0.44, 1.33))
    box("Rail_L", (0.035, 1.88, 0.03), root, chrome, (-0.48, 0.36, 1.37))
    box("Rail_R", (0.035, 1.88, 0.03), root, chrome, (0.48, 0.36, 1.37))
    box("RailBar_F", (1.00, 0.03, 0.028), root, chrome, (0, -0.46, 1.37))
    box("RailBar_R", (1.00, 0.03, 0.028), root, chrome, (0, 1.08, 1.37))

    windshield = box("Windshield", (1.28, 0.05, 0.42), root, glass, (0, -0.56, 1.14))
    windshield.rotation_euler[0] = 0.40
    box("RearGlass", (1.26, 0.06, 0.58), root, glass, (0, 1.88, 1.12))
    box("SideGlass_L", (0.035, 1.55, 0.34), root, glass, (-0.76, 0.22, 1.16))
    box("SideGlass_R", (0.035, 1.55, 0.34), root, glass, (0.76, 0.22, 1.16))
    box("Pillar_L", (0.10, 0.08, 0.56), root, cream, (-0.64, 1.86, 1.12))
    box("Pillar_R", (0.10, 0.08, 0.56), root, cream, (0.64, 1.86, 1.12))
    box("Header", (1.28, 0.08, 0.06), root, cream, (0, 1.88, 1.40))

    box("Bumper_F", (1.94, 0.22, 0.15), root, chrome, (0, -2.16, 0.43), bevel=0.02)
    box("Bumper_B", (1.94, 0.22, 0.15), root, chrome, (0, 2.18, 0.43), bevel=0.02)
    box("Overrider_L", (0.16, 0.12, 0.10), root, chrome, (-0.72, 2.28, 0.48))
    box("Overrider_R", (0.16, 0.12, 0.10), root, chrome, (0.72, 2.28, 0.48))
    box("Exhaust", (0.07, 0.16, 0.07), root, dark, (0.62, 2.30, 0.28))

    box("Grille", (0.90, 0.07, 0.24), root, dark, (0, -2.14, 0.64))
    for i, x in enumerate((-0.28, -0.10, 0.10, 0.28)):
        box(f"GrilleBar_{i}", (0.05, 0.04, 0.20), root, chrome, (x, -2.18, 0.64))

    cyl("Lamp_L", 0.155, 0.10, root, lights, (-0.62, -2.16, 0.66), axis="Y", segs=14)
    cyl("Lamp_R", 0.155, 0.10, root, lights, (0.62, -2.16, 0.66), axis="Y", segs=14)
    box("LampRing_L", (0.34, 0.03, 0.34), root, chrome, (-0.62, -2.12, 0.66))
    box("LampRing_R", (0.34, 0.03, 0.34), root, chrome, (0.62, -2.12, 0.66))
    box("Marker_L", (0.08, 0.06, 0.08), root, amber, (-0.88, -2.10, 0.70))
    box("Marker_R", (0.08, 0.06, 0.08), root, amber, (0.88, -2.10, 0.70))

    box("TailBezel_L", (0.26, 0.08, 0.42), root, chrome, (-0.78, 2.20, 0.78))
    box("TailBezel_R", (0.26, 0.08, 0.42), root, chrome, (0.78, 2.20, 0.78))
    box("Tail_L", (0.20, 0.08, 0.36), root, tails, (-0.78, 2.24, 0.78))
    box("Tail_R", (0.20, 0.08, 0.36), root, tails, (0.78, 2.24, 0.78))
    box("Reverse_L", (0.10, 0.04, 0.08), root, reverse, (-0.78, 2.26, 0.54))
    box("Reverse_R", (0.10, 0.04, 0.08), root, reverse, (0.78, 2.26, 0.54))
    box("PlateChrome", (0.52, 0.04, 0.16), root, chrome, (0, 2.24, 0.46))
    box("Plate", (0.46, 0.02, 0.12), root, plate, (0, 2.27, 0.46))

    box("MirrorArm_L", (0.08, 0.16, 0.08), root, chrome, (-0.94, -0.56, 1.08))
    box("MirrorArm_R", (0.08, 0.16, 0.08), root, chrome, (0.94, -0.56, 1.08))
    box("Mirror_L", (0.14, 0.08, 0.12), root, glass, (-1.04, -0.62, 1.08))
    box("Mirror_R", (0.14, 0.08, 0.12), root, glass, (1.04, -0.62, 1.08))
    cyl("Antenna", 0.012, 0.78, root, chrome, (-0.50, 0.90, 1.70), axis="Z", segs=6)

    for name, x, y in (
        ("Wheel_FL", -0.94, -1.28),
        ("Wheel_FR", 0.94, -1.28),
        ("Wheel_RL", -0.94, 1.32),
        ("Wheel_RR", 0.94, 1.32),
    ):
        w = cyl(name, 0.36, 0.26, root, rubber, (x, y, 0.36), axis="X", segs=18)
        cyl(f"{name}_Hub", 0.16, 0.28, w, chrome, (0, 0, 0), axis="X", segs=12)
        cyl(f"{name}_Cap", 0.07, 0.30, w, dark, (0, 0, 0), axis="X", segs=10)

    empty("Anchor_Spot_L", root, (-0.62, -2.20, 0.66))
    empty("Anchor_Spot_R", root, (0.62, -2.20, 0.66))
    empty("Anchor_Kiss", root, (0, -2.85, 0.20))
    empty("Anchor_CabinFill", root, (0, 0.40, 1.08))
    empty("Anchor_CabinGlow", root, (0, 2.13, 1.15))
    empty("Anchor_Motes", root, (0, -2.5, 0.6))

    missing = [n for n in required_names(contract) if n not in bpy.data.objects]
    if missing:
        raise SystemExit(f"missing objects: {missing}")

    root.rotation_euler[2] = 3.141592653589793
    bpy.context.view_layer.objects.active = root
    for ob in list(bpy.context.scene.objects):
        ob.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    return root


def export_glb(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(path),
        export_format="GLB",
        export_yup=True,
        export_apply=True,
        export_cameras=False,
        export_lights=False,
        export_extras=True,
    )
    print("wrote", path, "bytes", path.stat().st_size)


def main():
    out, contract_path = argv_opts()
    contract = json.loads(contract_path.read_text())
    if out is None:
        out = Path("/tmp") / contract["file"]
    build(contract)
    export_glb(out)


if __name__ == "__main__":
    main()
