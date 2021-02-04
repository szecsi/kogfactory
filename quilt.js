const commandLineArgs = require('command-line-args')
var fs = require('fs-extra')

const optionDefinitions = [
  { name: 'project', type: String, multiple: true, defaultOption: true },
]
const options = commandLineArgs(optionDefinitions);

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
        patch.replaceAll(/^\+(.+)$/mg, (match, l1) => {
          if(l1.startsWith("++")){
            if(inSection){
              slide += `
         </script> </code></pre>
      </section>`;
            }
            slide += `<section>
        <h3>`;
            slide += l1.substring(5);
        //slide += p1;
        slide += `</h3>            
                  <pre class="kotlin"><code class="floating-annotations" data-trim> <script type="text/template">
`;
        } else {
          slide += l1;
          slide += "\n";
        }});
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