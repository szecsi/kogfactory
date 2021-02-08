var updateAnno = function(scrolledbox, maxCharCountPerLine, marginSize, fontSize){
    var slide = scrolledbox.closest("section");
    var slideRect = slide.getBoundingClientRect();
    var codeRect = scrolledbox.getBoundingClientRect();            
    var svgs = slide.querySelectorAll("svg");

    for(var iSvg=0; iSvg<svgs.length; iSvg++){
      svgs[iSvg].remove();
    }
    var marks = scrolledbox.querySelectorAll("span.floating-annotation");
    var miny = 0;
    for(var iMark=0; iMark<marks.length; iMark++){
      var crect = marks[iMark].getBoundingClientRect();
      //console.log(crect);              
      var draw = SVG().addTo(slide);
      draw.size('100%', '100%');
      draw.css('position', 'absolute');
      draw.css('left', '0');
      draw.css('top', '0');
      draw.css('pointer-events', 'none');              
      //console.log(crect);
      //console.log(codeRect);        
      if(crect.y > codeRect.y && crect.y + crect.height < codeRect.y + codeRect.height) {
          draw.rect(crect.width, crect.height).move(crect.x-slideRect.x, crect.y-slideRect.y).stroke('#f60').fill({ color: '#f60', opacity: 0.05 });
          var comment = marks[iMark].getAttribute("comment");
          var hardlines = comment.split("\n");
          var lines = [];
          for(var ihl=0; ihl<hardlines.length; ihl++){
            var words = hardlines[ihl].split(/\s/g);
            var iWord = 0;
            var currentLine = "";
            while(iWord < words.length){
              if(currentLine.length === 0 || currentLine.length + words[iWord].length < maxCharCountPerLine){
                currentLine += words[iWord] + " ";
              } else {
                lines.push(currentLine);
                currentLine = words[iWord];
              }
              iWord++;
            }
            if(currentLine.length > 0) {
              lines.push(currentLine);
            }
          }
          comment = lines.join("\n");
          var lineCount = 1 + (comment.match(/\n/g) || []).length;
          //console.log(comment + " is " + lineCount + " lines");
          //comment = comment.replaceAll("\\n", () => {return "\n";});
          var text = draw.text(comment).fill('#f60').font('size', `${fontSize}`);
          var textheight = text.leading() * fontSize * lineCount;
          var texty = crect.y-slideRect.y;
          if(texty < miny + textheight){
            texty = miny + textheight;
          }
          text.move(slideRect.width - marginSize, texty - textheight);
          miny = texty + 20;
          draw.line(
            crect.x-slideRect.x + crect.width,
            crect.y-slideRect.y + crect.height / 2,
            slideRect.width - 300,
            texty - textheight / 2,                    
            ).stroke('#f60');
      }
    }
  };

Reveal.on("slidechanged", function(event){
  var maxCharCountPerLine = event.currentSlide.getAttribute("data-maxCharCountPerLine") || 40;
  var marginSize = event.currentSlide.getAttribute("data-marginSize") || 300;  
  var fontSize = event.currentSlide.getAttribute("data-fontSize") || 15;  
  var codeboxes = event.currentSlide.querySelectorAll("code.floating-annotations");
  for(var i=0; i<codeboxes.length; i++){
    var scrolledbox = codeboxes[i];
    updateAnno(scrolledbox, maxCharCountPerLine, marginSize, fontSize);
  }
});

Reveal.on("ready", function(event){
  var maxCharCountPerLine = event.currentSlide.getAttribute("data-maxCharCountPerLine") || 40;
  var marginSize = event.currentSlide.getAttribute("data-marginSize") || 300;  
  var fontSize = event.currentSlide.getAttribute("data-fontSize") || 15;
  var codeboxes = event.currentSlide.querySelectorAll("code.floating-annotations");
  for(var i=0; i<codeboxes.length; i++){
    var scrolledbox = codeboxes[i];
    var timeoutId = null;//window.setTimeout(updateAnno, 2000);    
    var delayfunc = function(){
      if(timeoutId) {
        var slide = scrolledbox.closest("section");
        var svgs = slide.querySelectorAll("svg");
        for(var iSvg=0; iSvg<svgs.length; iSvg++){
          svgs[iSvg].style.display = "none";
        }            
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(function(){updateAnno(scrolledbox, maxCharCountPerLine, marginSize, fontSize);}, 200);
    };
    scrolledbox.addEventListener("scroll", delayfunc);  
  }
});