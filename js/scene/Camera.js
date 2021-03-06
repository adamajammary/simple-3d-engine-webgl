/**
* Camera
* @class
*/
class Camera extends Component
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
        super("Camera", position);
        
        let forward    = vec3.create();
        let right      = vec3.create();
        let pitch      = 0.0;
        let yaw        = -(Math.PI / 2.0);
        let mouseState = new MouseState();
        let projection = mat4.create();
        let view       = mat4.create();

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

            this.MoveBy(moveVector);
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

                this.MoveBy(moveVector);
                this.MoveBy([ 0.0, moveModifier.y, 0.0 ]);
            }
            // MOVE/PAN FORWARD/BACK (Z)
            else if (event.ctrlKey)
            {
                vec3.multiply(moveVector, forward, moveAmountY);

                this.MoveBy(moveVector);
            // ROTATE HORIZONTAL/VERTICAL (YAW/PITCH)
            } else {
                this.RotateBy([ (moveModifier.x * 0.01), -(moveModifier.y * 0.01), 0.0 ]);
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
                    moveVector = vec3.fromValues(0.0, moveModifier, 0.0);
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

                this.MoveBy(moveVector);
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
            this.RotateTo(vec3.fromValues(yaw, pitch, 0.0));
        }

        /**
        * @param {Array<number>} lookAt
        */
        this.LookAt = function()
        {
            return lookAt;
        }

        /**
        * Moves by amount
        * @param {Array<number>} amount
        */
        this.MoveBy = function(amount)
        {
            if (!isNaN(parseFloat(amount[0])) &&
                !isNaN(parseFloat(amount[1])) &&
                !isNaN(parseFloat(amount[2])))
            {
                this.position = vec3.add(this.position, this.position, amount);
                this.updatePosition();
            }
        }

        /**
        * Moves to new position
        * @param {Array<number>} newPosition
        */
        this.MoveTo = function(newPosition)
        {
            if (!isNaN(parseFloat(newPosition[0])) &&
                !isNaN(parseFloat(newPosition[1])) &&
                !isNaN(parseFloat(newPosition[2])))
            {
                this.position = newPosition;
                this.updatePosition();
            }
        }
        
        /**
        * @param  {Array<number>} model
        * @param  {boolean}       removeTranslation
        * @return {Array<number>} Model View Projection matrix
        */
        this.MVP = function(model, removeTranslation = false)
        {
            let mvp = mat4.create();

            mat4.multiply(mvp, this.View(removeTranslation), model);
            mat4.multiply(mvp, projection, mvp);

            return mvp;
        }
        
        /**
        * @return {number}
        */
        this.Near = function()
        {
            return near;
        }

        /**
        * Rotate by amount in radians
        * @param {Array<number>} amountRadians
        */
        this.RotateBy = function(amountRadians)
        {
            if (!isNaN(parseFloat(amountRadians[0])) &&
                !isNaN(parseFloat(amountRadians[1])))
            {
                yaw   += amountRadians[0];
                pitch += amountRadians[1];

                this.updateRotation();
            }
        }

        /**
        * Set new rotation in radians
        * @param {Array<number>} newRotationRadians
        */
        this.RotateTo = function(newRotationRadians)
        {
            if (!isNaN(parseFloat(newRotationRadians[0])) &&
                !isNaN(parseFloat(newRotationRadians[1])))
            {
                yaw   = newRotationRadians[0];
                pitch = newRotationRadians[1];

                this.updateRotation();
            }
        }
        
        /**
        * @return {<Array<number>}
        */
        /*this.Rotation = function()
        {
            return [ yaw, pitch, 0.0 ];
        }*/

        /**
        * @return {Array<number>} Projection matrix
        */
        this.Projection = function()
        {
            return projection;
        }

        /**
        * @param {number} angleRadians
        */
        this.SetFOV = function(angleRadians)
        {
            var index  = (angleRadians.indexOf(':') + 1);
            fovRadians = parseFloat(index > 0 ? angleRadians.substr(index) : angleRadians);

            this.UpdateProjection();
        }

        this.UpdateProjection = function()
        {
            let aspectRatio = (RenderEngine.Canvas().width / RenderEngine.Canvas().height);
            mat4.perspective(projection, fovRadians, aspectRatio, near, far);
        }

        this.updatePosition = function()
        {
            let center = vec3.create();
            vec3.add(center, this.position, forward);
            mat4.lookAt(view, this.position, center, vec3.fromValues(0.0, 1.0, 0.0));
        }

        this.updateRotation = function()
        {
            // https://learnopengl.com/#!Getting-started/Camera
            pitch         = Math.max(Math.min(pitch, (Math.PI / 2.0)), -(Math.PI / 2.0));
            this.rotation = vec3.fromValues(yaw, pitch, 0.0);
            
            let center = vec3.fromValues(
                Math.cos(pitch) * Math.cos(yaw),    // X
                Math.sin(pitch),                    // Y
                Math.cos(pitch) * Math.sin(yaw)     // Z
            );
            
            vec3.normalize(forward, center);

            vec3.add(center, this.position, forward);
            mat4.lookAt(view, this.position, center, vec3.fromValues(0.0, 1.0, 0.0));
        }

        /**
        * @param  {boolean}       removeTranslation
        * @return {Array<number>} View matrix
        */
        this.View = function(removeTranslation = false)
        {
            // http://math.hws.edu/graphicsbook/c3/s5.html
            if (removeTranslation)
            {
                return mat4.fromValues(
                    view[0],  view[1],  view[2],  0.0,  // COLUMN 0
                    view[4],  view[5],  view[6],  0.0,  // COLUMN 1
                    view[8],  view[9],  view[10], 0.0,  // COLUMN 2
                    0.0,      0.0,      0.0,      1.0   // COLUMN 3
                );
            }

            return view;
        }

        /**
        * MAIN
        */
        this.Children = [ this ];
        this.type     = ComponentType.CAMERA;

        vec3.subtract(forward, lookAt, position);
        vec3.normalize(forward, forward);
        
        vec3.cross(right, vec3.fromValues(0.0, 1.0, 0.0), forward);
        vec3.normalize(right, right);
        
        this.UpdateProjection();
        this.updatePosition();
        this.updateRotation();
    }
}
