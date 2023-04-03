import bpy
import mathutils

import os
import os.path
import math
import operator
import bmesh

def ensure_folder_exist( foldername ):
  if not os.access( foldername, os.R_OK|os.W_OK|os.X_OK ):
    os.makedirs( foldername )

def ensure_extension( filepath, extension ):
  if not filepath.lower().endswith( extension ):
    filepath += extension
  return filepath

def flat_array( array ):
  return ", ".join( str( round( x, 6 ) ) for x in array )
  
def add_mesh_string(slist, obj ):
  mesh = bmesh.new()
  mesh.from_object(obj, bpy.context.evaluated_depsgraph_get())
  obj.data.calc_normals_split()

  #uvLayer = mesh.uv_layers.new()
  vertexRepIndexLayer = mesh.loops.layers.int.new("vertexRepIndex")
  
  uvLayer = mesh.loops.layers.uv["UVMap"]
  lindex = 0
  for f in mesh.faces:
    for l in f.loops:
      l.index = lindex
      lindex = lindex + 1

  vertices = []
  normals = []
  uvs = []

  for v in mesh.verts:
    vvertreps = []
    for l in v.link_loops:
      exists = False
      for i in vvertreps:
        if normals[i] == obj.data.loops[l.index].normal and uvs[i] == l[uvLayer].uv:
          exists = True
          l[vertexRepIndexLayer] = i
          break
      #print(l.index)
      if not exists:
        l[vertexRepIndexLayer] = len(vertices)
        vvertreps.append(len(vertices))
        vertices.append(v.co)
        normals.append(obj.data.loops[l.index].normal)
        uvs.append(l[uvLayer].uv)

  slist.append('\t\t{')
  slist.append('\t "vertices": [ ')
  for v in vertices:
    slist.append(f"\t\t{v.x}, {v.y}, {v.z}")
    slist.append("\t\t,")
  slist.pop() #remove last comma
  slist.append('\t ], ')

  slist.append('\t "normals": [ ')
  for n in normals:
    slist.append(f"\t\t{n.x}, {n.y}, {n.z}")
    slist.append(",")
  slist.pop() #remove last comma
  slist.append('\t ], ')

  slist.append('\t "texturecoords": [ [')
  for u in uvs:
    slist.append(f"\t\t{u.x}, {u.y}")
    slist.append(",")
  slist.pop() #remove last comma
  slist.append('\t ] ], ')

  slist.append('\t "faces": [')
  for f in mesh.faces:
    tri = []
    for l in f.loops:
      tri.append(l[vertexRepIndexLayer])
    slist.append(f"[{tri[0]}, {tri[1]}, {tri[2]}]")
    slist.append(",")
  slist.pop() #remove last comma
  slist.append('\t ] ')
  slist.append('\t}')
  slist.append(',')

# #####################################################
# Main
# #####################################################

def save( filepath ):
  filepath = ensure_extension( filepath, ".json")
  out = open( filepath, "w" )

  out.write( '{\n\t"meshes": [\n')
  slist = []

  for o in bpy.data.objects:
    print(o.type)      
    if o.type != 'MESH':
        continue
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(state=True)
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.duplicate()
    bpy.ops.object.mode_set( mode = "OBJECT" )
    bpy.ops.object.modifier_add( type="TRIANGULATE" )
    bpy.ops.object.modifier_apply( apply_as = "DATA", modifier = "Triangulate" )

    add_mesh_string( slist, bpy.context.active_object )
  
    bpy.ops.object.delete()

  slist.pop() #remove last comma
  out.write( "\n\t".join(slist) )
  out.write( '\t]\n}')

  out.close()
  return {"FINISHED"}

save("d:\\Education\\Graph\\testpokemon.json")