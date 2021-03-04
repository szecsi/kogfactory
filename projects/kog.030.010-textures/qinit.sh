#!/bin/bash -v

wd=$(pwd)
cd ../..
var=`date +"%FORMAT_STRING"`
now=`date +"%F_%R"`
mv kogedge kogedge$now
git clone -b empty --single-branch https://github.com/szecsi/kogedge.git
cd kogedge
git checkout -b quilted
# apply all browser patches
echo $wd"/../../patches/kog.010.010.*.patch" | xargs -I % bash -c "git am %*"
# apply all webgl patches
echo $wd"/../../patches/kog.010.020.*.patch" | xargs -I % bash -c "git am %*"
# apply time step patch
echo $wd"/../../patches/kog.010.040.*.patch" | xargs -I % bash -c "git am %*"
# apply all model transformation patches
echo $wd"/../../patches/kog.010.050.*.patch" | xargs -I % bash -c "git am %*"
# apply all gom patches
echo $wd"/../../patches/kog.020.010.*.patch" | xargs -I % bash -c "git am %*"
# apply all 2d cam patches
echo $wd"/../../patches/kog.020.020.*.patch" | xargs -I % bash -c "git am %*"
