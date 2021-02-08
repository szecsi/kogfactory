const commandLineArgs = require('command-line-args')
var fs = require('fs-extra')

const optionDefinitions = [
  { name: 'project', type: String, multiple: true, defaultOption: true },
]
const options = commandLineArgs(optionDefinitions);
const languageId = options.languageId || 0;

fs.readFile(options.project[0], 'utf8', function (err,source) {
  if (err) {
    return console.log(err);
  }
  var result = source.replaceAll(
    /<!--\s+patch\s*=\s*"([^"]+)"\s*-->/g,
      (match, p1) => {
        var slide = "";
        var inSection = false;
        var patch = fs.readFileSync("patches/" + p1, 'utf8');
        var language="autodetect";
        var format = /^(\s*)(.+)\/\/(#.+)$/;
        if(p1.includes(".html.")) {
          language = "html";
          format = /^(\s*)(.+)<!--(#.+)-->$/;
        }
        if(p1.includes(".kt.") || p1.includes(".kts.")) {
          language = "kotlin";
        }
        if(p1.includes("css")) {
          language = "css";
          format = /^(\s*)(.+)\/\*(#.+)\*\/$/;
        }
        if(p1.includes("glsl")) {
          language = "glsl";
        }
        const files = patch.split("\n+++ b/");
        files.shift();
        files.forEach(file => {
          hunks = file.split(/[\r\n]-- [\r\n]/)[0].split("\n@@");
          if(inSection){
            slide += `
       </script> </code></pre>
    </section>`;
          }
          slide += `<section>
      <h3>`;
          slide += hunks[0];
        slide += `</h3>
                <pre class="${language}"><code class="floating-annotations" data-trim> <script type="text/template">
`;
          hunks.shift();
          hunks.forEach( chunk => {
            var hunk = "@@" + chunk;
  //        patch.replaceAll(/\n@@.*\n([^]*)(\n@@|\n--)/g, (match, hunk, terminator) => {
            hunk.replaceAll(/^(\+|-| )(.*)$/mg, (match, indicator, l1) => {
  //            slide += l1.replace(/^(\s*)([^\s]+)\/\/\$(.+)$/, (match, lead, code, comment) =>
              if(indicator == "-") {
                slide += "<del>";
              } else {
                if(indicator == " ") {
                  slide += "<ins>";
                }
              }
              slide += l1.replace(format, (match, lead, code, comment) => { 
                comment.replaceAll(/#([^#]*)#([^#]+)/g, (match, pattern, anno) => {
                  if(pattern == ""){
                    pattern = code;
                  }
                  const langAnnos = anno.split("˙HUN˙");
                  if(langAnnos.length < languageId) {
                    anno = langAnnos[languageId];
                  } else {
                    anno = langAnnos[0];
                  }
                  var m = code.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
                  code = code.slice(0, m.index) + 
                    `<span comment="${anno.replaceAll(/; /g,"\n")}">` + 
                    code.slice(m.index, m.index+m[0].length) + 
                    `</span>` + 
                    code.slice(m.index+m[0].length);
                });
                return lead + `<span comment="${comment.replace("; ","\n")}">` + code + `</span>`;
              });
              if(indicator == "-") {
                slide += "</del>";
              } else {
                if(indicator == " ") {
                  slide += "</ins>";
                }
              }              
              slide += "\n";
            });
          });
        });
        slide += `
         </script> </code></pre>
      </section>`;
        return slide;
      }
    );
  var outfile = options.project[0].replace("projects", "build");
  fs.ensureFile(outfile);
  fs.writeFile(outfile, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});