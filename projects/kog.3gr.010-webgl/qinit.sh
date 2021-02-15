#!/bin/bash -v

wd=$(pwd)
cd ../../..
var=`date +"%FORMAT_STRING"`
now=`date +"%F_%R"`
mv kogedge kogedge$now
git clone -b empty --single-branch https://github.com/szecsi/kogedge.git
cd kogedge
git checkout -b quilted
# apply all browser patches
echo $wd"/../../patches/kog.010.010.*.patch" | xargs -I % bash -c "git am %*"
# apply some webgl patches
echo $wd"/../../patches/kog.010.020.0010-WebGL2-rendering-context.patch" | xargs -I % bash -c "git am %*"
echo $wd"/../../patches/kog.010.020.0020-Create-WebGL-context.patch" | xargs -I % bash -c "git am %*"
echo $wd"/../../patches/kog.010.020.0030-Scene-instance-and-canvas-resize" | xargs -I % bash -c "git am %*"
echo $wd"/../../patches/kog.010.020.0040-Call-update.patch" | xargs -I % bash -c "git am %*"
echo $wd"/../../patches/kog.010.020.0050-Scene-class.patch" | xargs -I % bash -c "git am %*"
##skip triangle geometry
echo $wd"/../../patches/kog.010.020.0080-Idle-vertex-shader.patch" | xargs -I % bash -c "git am %*"
echo $wd"/../../patches/kog.010.020.0090-Solid-color-fragment-shader.patch" | xargs -I % bash -c "git am %*"
echo $wd"/../../patches/kog.010.020.0100-Shader-class.patch" | xargs -I % bash -c "git am %*"
echo $wd"/../../patches/kog.010.020.0110-Program-class.patch" | xargs -I % bash -c "git am %*"
##skip create and draw triangle geometry
##skip triangle draw
##dt not yet in initial code

# apply webglmath
echo $wd"/../../patches/kog.010.050.0010-WebGLMath.patch" | xargs -I % bash -c "git am %*"

# apply textured quad 
echo $wd"/../../patches/kog.030.010.0010-Textured-quad-geometry.patch" | xargs -I % bash -c "git am %*"
# apply texture2d
echo $wd"/../../patches/kog.030.010.0020-Texture2D-class.patch" | xargs -I % bash -c "git am %*"
