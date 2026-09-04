"""Shared bpy mesh helpers for Sunday Drive prop forge."""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Matrix

PI = math.pi
ROOT = Path(__file__).resolve().parent


def argv_opts():
    args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    out = None
    contract = None
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


def load_contract(path: Path) -> dict:
    return json.loads(path.read_text())


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


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
                loop[uv_layer].uv = ((v.x + 2.0) * 0.22, (v.y + 2.0) * 0.22)
            elif abs(n.y) >= abs(n.x):
                loop[uv_layer].uv = ((v.x + 2.0) * 0.22, (v.z + 1.0) * 0.22)
            else:
                loop[uv_layer].uv = ((v.y + 2.0) * 0.22, (v.z + 1.0) * 0.22)


def mesh_obj(name, bm, parent, material, location=(0, 0, 0), rotation=None, scale=None):
    project_uv(bm)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    obj.location = location
    if rotation:
        obj.rotation_euler = rotation
    if scale:
        obj.scale = scale
    if material:
        obj.data.materials.append(material)
    bpy.context.collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj


def box(name, size, parent, material, location=(0, 0, 0), bevel=0.0, rotation=None):
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
    return mesh_obj(name, bm, parent, material, location, rotation=rotation)


def _axis_rotate(bm, axis):
    if axis == "X":
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(PI / 2, 3, "Y"))
    elif axis == "Y":
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(PI / 2, 3, "X"))


def cone(name, radius1, radius2, depth, parent, material, location, axis="Z", segs=8, rotation=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm,
        cap_ends=True,
        cap_tris=False,
        segments=segs,
        radius1=radius1,
        radius2=radius2,
        depth=depth,
    )
    _axis_rotate(bm, axis)
    return mesh_obj(name, bm, parent, material, location, rotation=rotation)


def cyl(name, radius, depth, parent, material, location, axis="Z", segs=12, radius2=None, rotation=None):
    r2 = radius if radius2 is None else radius2
    return cone(name, radius, r2, depth, parent, material, location, axis=axis, segs=segs, rotation=rotation)


def sphere(name, radius, parent, material, location, u=8, v=6, scale=None):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=u, v_segments=v, radius=radius)
    if scale:
        for vert in bm.verts:
            vert.co.x *= scale[0]
            vert.co.y *= scale[1]
            vert.co.z *= scale[2]
    return mesh_obj(name, bm, parent, material, location)


def ico(name, radius, parent, material, location, subdivisions=0, scale=None):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=subdivisions, radius=radius)
    if scale:
        for vert in bm.verts:
            vert.co.x *= scale[0]
            vert.co.y *= scale[1]
            vert.co.z *= scale[2]
    return mesh_obj(name, bm, parent, material, location)


def disc(name, radius, parent, material, location, segs=16):
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, cap_tris=False, segments=segs, radius=radius)
    return mesh_obj(name, bm, parent, material, location)


def empty(name, parent, location):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_size = 0.12
    obj.location = location
    bpy.context.collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj


def new_root(name):
    root = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(root)
    return root


def required_names(contract):
    nodes = contract.get("nodes") or {}
    names = []
    if nodes.get("root"):
        names.append(nodes["root"])
    for key in ("required", "wheels", "headlamps", "tails"):
        names.extend(nodes.get(key) or [])
    for key in ("head", "blades", "front"):
        if nodes.get(key):
            names.append(nodes[key])
    names.extend((nodes.get("anchors") or {}).values())
    out = []
    seen = set()
    for name in names:
        if name not in seen:
            seen.add(name)
            out.append(name)
    return out


def finalize(root, contract, yaw=True):
    missing = [n for n in required_names(contract) if n not in bpy.data.objects]
    if missing:
        raise SystemExit(f"{contract['id']} missing objects: {missing}")
    if yaw:
        root.rotation_euler[2] = PI
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
