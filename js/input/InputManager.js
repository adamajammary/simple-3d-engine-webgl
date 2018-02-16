/**
* Input Manager
* @class
*/
class InputManager
{
    /**
     * 
     */
    static Init()
    {
        document.addEventListener("keydown",   InputManager.InputKeyboard);
        document.addEventListener("mousedown", InputManager.InputMouseDown);
        document.addEventListener("mouseup",   InputManager.InputMouseUp);
        document.addEventListener("mousemove", InputManager.InputMouseMove);
        document.addEventListener("wheel",     InputManager.InputMouseScroll);

        return 0;
    }

    /**
    * @param {object} event
    */
    static InputKeyboard(event)
    {
        if (RenderEngine.Camera)
            RenderEngine.Camera.InputKeyboard(event);
    }

    /**
    * @param {object} event
    */
    static InputMouseDown(event)
    {
        if (RenderEngine.Camera)
            RenderEngine.Camera.InputMouseDown(event);
    }

    /**
    * @param {object} event
    */
    static InputMouseMove(event)
    {
        if (RenderEngine.Camera)
            RenderEngine.Camera.InputMouseMove(event);
    }

    /**
    * @param {object} event
    */
    static InputMouseScroll(event)
    {
        if (RenderEngine.Camera)
            RenderEngine.Camera.InputMouseScroll(event);
    }

    /**
    * @param {object} event
    */
    static InputMouseUp(event)
    {
        if (RenderEngine.Camera)
            RenderEngine.Camera.InputMouseUp(event);
        
        if (event.target.id == "webgl_canvas")
            PhysicsEngine.CheckRayCasts(event);
    }

}
