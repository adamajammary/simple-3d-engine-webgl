/**
* Camera
* @class
*/
class Camera
{
    /**
    * @param {Array<number>} position
    * @param {Array<number>} lookAt
    * @param {number}        fovRadians
    * @param {number}        near
    * @param {number}        far
    */
    constructor(position, lookAt, fovRadians, near, far)
    {
        //
        // PRIVATE
        //

        var forward    = vec3.create();
        var name       = "Camera";
        var right      = vec3.create();
        var pitch      = 0.0;
        var yaw        = -(Math.PI / 2.0);
        var mouseState = new MouseState();
        var type       = ComponentType.CAMERA;

        /**
        * @param {Array<number>} position
        * @param {Array<number>} lookAt
        */
        function init(position, lookAt)
        {
            vec3.subtract(forward, lookAt, position);
            vec3.normalize(forward, forward);
            
            vec3.cross(right, vec3.fromValues(0.0, 1.0, 0.0), forward);
            vec3.normalize(right, right);
        }
        
        //
        // PUBLIC
        //

        /**
        * @param  {number}
        * @return {object}
        */
        this.Child = function(index)
        {
            return this;
        }

        /**
        * @return {Array<object>}
        */
        this.Children = function()
        {
            return [ this ];
        }

        /**
        * @return {number}
        */
        this.Far = function()
        {
            return far;
        }

        /**
        * @param {object} event
        */
        this.InputKeyboard = function(event)
        {
            var canvas = RenderEngine.Canvas();

            if (!canvas || !canvas.active)
                return -1;

            var key          = event.key.toUpperCase();
            var moveModifier = (TimeManager.DeltaTime * 20.0);
            var moveAmount   = vec3.fromValues(moveModifier, moveModifier, moveModifier);
            var moveVector   = vec3.create();

            switch (key) {
            // FORWARD
            case 'W':
                vec3.multiply(moveVector, forward, moveAmount);
                break;
            // LEFT
            case 'A':
                vec3.cross(moveVector, forward, vec3.fromValues(0.0, 1.0, 0.0));
                vec3.normalize(moveVector, moveVector);
                vec3.multiply(moveVector, moveVector, vec3.negate(moveAmount, moveAmount));
                break;
            // BACK
            case 'S':
                vec3.multiply(moveVector, forward, vec3.negate(moveAmount, moveAmount));
                break;
            // RIGHT
            case 'D':
                vec3.cross(moveVector, forward, vec3.fromValues(0.0, 1.0, 0.0));
                vec3.normalize(moveVector, moveVector);
                vec3.multiply(moveVector, moveVector, moveAmount);
                break;
            }

            this.Move(moveVector);
        }

        /**
        * @param {object} event
        */
        this.InputMouseDown = function(event)
        {
            var canvas = RenderEngine.Canvas();
            
            canvas.active = (event.target.id == "webgl_canvas");

            if (canvas.active && ((event.button == MouseButton.MIDDLE) || (event.button == MouseButton.RIGHT)))
            {
                event.preventDefault();

                event.target.requestPointerLock = (event.target.requestPointerLock || event.target.mozRequestPointerLock || event.target.webkitRequestPointerLock || event.target.msRequestPointerLock);
                event.target.requestPointerLock();

                mouseState.Drag = true;
            }
        }

        /**
        * @param {object} event
        */
        this.InputMouseMove = function(event)
        {
            if (!mouseState.Drag) { return -1; }
            
            var moveModifier = {
                x: (event.movementX * TimeManager.DeltaTime * 3.0),
                y: (event.movementY * TimeManager.DeltaTime * 3.0)
            };
            var moveAmountX = vec3.fromValues(-moveModifier.x, -moveModifier.x, -moveModifier.x);
            var moveAmountY = vec3.fromValues(-moveModifier.y, -moveModifier.y, -moveModifier.y);
            var moveVector  = vec3.create();

            // MOVE/PAN HORIZONTAL/VERTICAL
            if (event.shiftKey)
            {
                vec3.cross(moveVector, forward, vec3.fromValues(0.0, 1.0, 0.0));
                vec3.normalize(moveVector, moveVector);
                vec3.multiply(moveVector, moveVector, moveAmountX);
                this.Move(moveVector);
                this.Move([ 0.0, moveModifier.y, 0.0 ]);
            }
            // MOVE/PAN FORWARD/BACK (Z)
            else if (event.ctrlKey)
            {
                vec3.multiply(moveVector, forward, moveAmountY);
                this.Move(moveVector);
            // ROTATE HORIZONTAL/VERTICAL (YAW/PITCH)
            } else {
                this.Rotate([ (moveModifier.x * 0.01), -(moveModifier.y * 0.01), 0.0 ]);
            }
        }

        /**
        * @param {object} event
        */
        this.InputMouseScroll = function(event)
        {
            if (event.target.id == "webgl_canvas")
            {
                event.preventDefault();

                var moveModifier = (-event.deltaY * TimeManager.DeltaTime * 1.0);
                var moveAmount   = vec3.fromValues(moveModifier, moveModifier, moveModifier);
                var moveVector   = vec3.create();

                // UP / DOWN (Y)
                if (event.shiftKey) {
                    this.Move([ 0.0, -(event.deltaY * TimeManager.DeltaTime * 1.0), 0.0 ]);
                }
                // LEFT / RIGHT (X)
                else if (event.ctrlKey)
                {
                    vec3.cross(moveVector, forward, vec3.fromValues(0.0, 1.0, 0.0));
                    vec3.normalize(moveVector, moveVector);
                    vec3.multiply(moveVector, moveVector, moveAmount);
                // FORWARD / BACK (Z)
                } else {
                    vec3.multiply(moveVector, forward, moveAmount);
                }

                this.Move(moveVector);
            }
        }

        /**
        * @param {object} event
        */
        this.InputMouseUp = function(event)
        {
            document.exitPointerLock = (document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock || document.msExitPointerLock);
            document.exitPointerLock();
            
            mouseState.Drag = false;
        }

        this.InvertPitch = function()
        {
            pitch = -pitch;
        }

        /**
        * @param {<Array<number>} lookAt
        */
        this.LookAt = function()
        {
            return lookAt;
        }

        /**
        * Moves by amount
        * @param {Array<number>} amount
        */
        this.Move = function(amount)
        {
            if (!isNaN(parseFloat(amount[0])) &&
                !isNaN(parseFloat(amount[1])) &&
                !isNaN(parseFloat(amount[2])))
            {
                position = vec3.add(position, position, amount);
            }
        }

        /**
        * @return {string}
        */
        this.Name = function()
        {
            return name;
        }

        /**
        * @return {number}
        */
        this.Near = function()
        {
            return near;
        }

        /**
        * @return {object}
        */
        this.Parent = function()
        {
            return null;
        }

        /**
        * @return {<Array<number>}
        */
        this.Position = function()
        {
            return position;
        }

        /**
        * Rotate by amount in radians
        * @param {Array<number>} amountRadians
        */
        this.Rotate = function(amountRadians)
        {
            if (!isNaN(parseFloat(amountRadians[0])) &&
                !isNaN(parseFloat(amountRadians[1])))
            {
                yaw   += amountRadians[0];
                pitch += amountRadians[1];
            }
        }

        /**
        * @return {<Array<number>}
        */
        this.Rotation = function()
        {
            return [ yaw, pitch, 0.0 ];
        }

        /**
        * Projection Matrix
        * @return {Array<Array<number>>}
        */
        this.Projection = function()
        {
            var canvas     = RenderEngine.Canvas();
            var projection = mat4.create();

            mat4.perspective(projection, fovRadians, (canvas.width / canvas.height), near, far);

            return projection;
        }

        /**
        * @param {number} angleRadians
        */
        this.SetFOV = function(angleRadians)
        {
            var index  = (angleRadians.indexOf(':') + 1);
            fovRadians = parseFloat(index > 0 ? angleRadians.substr(index) : angleRadians);
        }

        /**
        * @param {string} newName
        */
        this.SetName = function(newName)
        {
            name = newName;
        }

        /**
        * @param {<Array<number>} newPosition
        */
        this.SetPosition = function(newPosition)
        {
            if (!isNaN(parseFloat(newPosition[0])) &&
                !isNaN(parseFloat(newPosition[1])) &&
                !isNaN(parseFloat(newPosition[2])))
            {
                position = newPosition;
            }
        }

        /**
        * Set Rotation in radians
        * @param {Array<number>} newRotationRadians
        */
        this.SetRotation = function(newRotationRadians)
        {
            if (!isNaN(parseFloat(newRotationRadians[0])) &&
                !isNaN(parseFloat(newRotationRadians[1])))
            {
                yaw   = newRotationRadians[0];
                pitch = newRotationRadians[1];
            }
        }

        /**
        * @return {number}
        */
        this.Type = function()
        {
            return type;
        }

        /**
        * View Matrix
        * @return {Array<Array<number>>}
        */
        this.View = function()
        {
            var view = mat4.create();

            // https://learnopengl.com/#!Getting-started/Camera
            pitch = Math.max(Math.min(pitch, (Math.PI / 2.0)), -(Math.PI / 2.0));
            
            var center = vec3.create();

            center[0] = Math.cos(pitch) * Math.cos(yaw);
            center[1] = Math.sin(pitch);
            center[2] = Math.cos(pitch) * Math.sin(yaw);
            
            vec3.normalize(forward, center);
            vec3.add(center, position, forward);
            mat4.lookAt(view, position, center, vec3.fromValues(0.0, 1.0, 0.0));
            
            return view;
        }

        //
        // MAIN
        //
        
        init(position, lookAt);
    }
}
