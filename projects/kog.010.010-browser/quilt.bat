rem todo
rem builds a git repo using a hardcoded list of patches
rem start: build a git repo of the original
rem final: build a git repo of the final
git clone -b empty --single-branch https://github.com/szecsi/kogedge.git
git checkout -b quilted
git apply ../patches/kog.010.010.0010-html.patch
rem sildes: creates reveal.js slides from the commits  