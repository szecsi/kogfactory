import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.HTMLDivElement
import org.w3c.dom.HTMLCanvasElement
import org.w3c.dom.events.*
import org.w3c.dom.Window

class App(val canvas : HTMLCanvasElement, val overlay : HTMLDivElement) {

  val keysPressed = HashSet<String>()
  

  @Suppress("UNUSED_PARAMETER")
  fun registerEventHandlers() {
    document.onkeydown =  { //#{# locally defined function
      event : KeyboardEvent ->
      keysPressed.add( keyNames[event.keyCode] )
    }

    document.onkeyup = { 
      event : KeyboardEvent ->
      keysPressed.remove( keyNames[event.keyCode] )
    }

    canvas.onmousedown = { 
      event : MouseEvent ->
      // event.x.toInt()
      // event.y.toInt()
      event
    }

    canvas.onmousemove = { 
      event : Event ->
      event.stopPropagation()
    }

    canvas.onmouseup = { 
      event : Event ->
      event // This line is a placeholder for event handling code. It has no effect, but avoids the "unused parameter" warning.
    }

    canvas.onmouseout = { 
      event : Event ->
      event // This line is a placeholder for event handling code. It has no effect, but avoids the "unused parameter" warning.
    }

    window.requestAnimationFrame {//#requestAnimationFrame# trigger rendering
      update()//#update# this method is responsible; for drawing a frame
    }
  }  

  fun update() {
    window.requestAnimationFrame { update() }
  }
}

fun main() {
  val canvas = document.getElementById("canvas") as HTMLCanvasElement
  val overlay = document.getElementById("overlay") as HTMLDivElement
  overlay.innerHTML = """<font color="red">WebGL</font>"""

  try{
    val app = App(canvas, overlay)//#app# from this point on,; this object is responsible; for handling everything
    app.registerEventHandlers()//#registerEventHandlers# we implement this; to make sure the app; knows when there is; something to do
  } catch(e : Error) {
    console.error(e.message)
  }
}