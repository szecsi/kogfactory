Reveal.on("slidechanged", function(event){
  var codeboxes = document.querySelectorAll("code.floating-annotations");
  for(var i=0; i<codeboxes.length; i++){
    var scrolledbox = codeboxes[i];
    //var slide = scrolledbox.closest("section");
    var updateAnno = function(){
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
          console.log(crect);
          console.log(codeRect);        
          if(crect.y > codeRect.y && crect.y + crect.height < codeRect.y + codeRect.height) {
              draw.rect(crect.width, crect.height).move(crect.x-slideRect.x, crect.y-slideRect.y).stroke('#f60').fill({ color: '#f60', opacity: 0.05 });
              var comment = marks[iMark].getAttribute("comment");
              var lineCount = 1;
              comment = comment.replaceAll("\\n", () => {lineCount++; return "\n";});
              var text = draw.text(comment).fill('#f60').font('size', '15');
              var textheight = text.leading() * 15 * lineCount;
              var texty = crect.y-slideRect.y;
              if(texty < miny + textheight){
                texty = miny + textheight;
              }
              text.move(slideRect.width - 300, texty - textheight);
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
    var timeoutId = null;//window.setTimeout(updateAnno, 2000);    
  /*  var button = document.createElement("button");
    button.innerHTML = "show floating annotation";
    slide.appendChild(button);    
    button.addEventListener("click", function(){
      console.log("clicked");
      if(timeoutId) {
        var slide = scrolledbox.closest("section");
        var svgs = slide.querySelectorAll("svg");
        for(var iSvg=0; iSvg<svgs.length; iSvg++){
          svgs[iSvg].style.display = "none";
        }            
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(updateAnno, 200);
    });*/
    updateAnno();
    scrolledbox.addEventListener("scroll", function(){
      if(timeoutId) {
        var slide = scrolledbox.closest("section");
        var svgs = slide.querySelectorAll("svg");
        for(var iSvg=0; iSvg<svgs.length; iSvg++){
          svgs[iSvg].style.display = "none";
        }            
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(updateAnno, 200);
    });
  }
});