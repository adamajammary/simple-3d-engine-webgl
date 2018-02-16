/**
* Ray Cast
* @class
*/
class RayCast
{
    /**
    * @param {number} x 
    * @param {number} y 
    */
    constructor(x, y)
    {
        //
        // PRIVATE
        //

        var direction        = [];
        var inverseDirection = vec3.create();
        var origin           = [];

        /**
        * http://antongerdelan.net/opengl/raycasting.html
        * @return {Array<number>}
        */
        function calculateRay(x, y)
        {
            var canvasRect = RenderEngine.Canvas().getBoundingClientRect();

            // VIEWPORT SPACE
            var viewportSpace = [ (x - canvasRect.left), (y - canvasRect.top) ];

            // NORMALIZED DEVICE SPACE [-1.0, 1.0]
            var normalizedDeviceSpace = [
                ((viewportSpace[0]        / canvasRect.width)   * 2.0 - 1.0),
                ((1.0 - (viewportSpace[1] / canvasRect.height)) * 2.0 - 1.0)
            ];
            
            // (HOMOGENEOUS) CLIP SPACE
            var clipSpace = vec4.fromValues(
                normalizedDeviceSpace[0], normalizedDeviceSpace[1], -1.0, 1.0
            );
            
            // EYE (CAMERA) SPACE
            var eyeSpace                = vec4.create();
            var inverseProjectionMatrix = mat4.create();

            mat4.invert(inverseProjectionMatrix, RenderEngine.Camera.Projection());
            vec4.transformMat4(eyeSpace, clipSpace, inverseProjectionMatrix);

            eyeSpace[2] = -1.0;
            eyeSpace[3] = 0.0;
            
            // WORLD SPACE
            var worldSpace        = vec4.create();
            var inverseViewMatrix = mat4.create();

            mat4.invert(inverseViewMatrix, RenderEngine.Camera.View());
            vec4.transformMat4(worldSpace, eyeSpace, inverseViewMatrix);

            var ray = vec3.fromValues(worldSpace[0], worldSpace[1], worldSpace[2]);
            vec3.normalize(ray, ray);

            return ray;
        }

        //
        // PUBLIC
        //

        /**
         * @param {Array<number>} boxMin 
         * @param {Array<number>} boxMax 
         */
        this.RayIntersectAABB = function(boxMin, boxMax)
        {
            // https://www.unknowncheats.me/forum/counterstrike-global-offensive/136361-external-ray-tracing-ray-aabb.html
            // https://www.unknowncheats.me/forum/counterstrike-source/109498-efficient-iscrossonhitbox-algorithm.html
            
            // If line is parallel and outside the box it is not possible to intersect

            // X
            if ((direction[0] == 0.0) && ((origin[0] < Math.min(boxMin[0], boxMax[0])) || (origin[0] > Math.max(boxMin[0], boxMax[0]))))
                return false;

            // Y
            if ((direction[1] == 0.0) && ((origin[1] < Math.min(boxMin[1], boxMax[1])) || (origin[1] > Math.max(boxMin[1], boxMax[1]))))
                return false;

            // Z
            if ((direction[2] == 0.0) && ((origin[2] < Math.min(boxMin[2], boxMax[2])) || (origin[2] > Math.max(boxMin[2], boxMax[2]))))
                return false;
            
            // 6 FACES / SIDES / PLANES
            var t1 = ((boxMin[0] - origin[0]) * inverseDirection[0]);   // LEFT
            var t2 = ((boxMax[0] - origin[0]) * inverseDirection[0]);   // RIGHT
            var t3 = ((boxMin[1] - origin[1]) * inverseDirection[1]);   // BOTTON
            var t4 = ((boxMax[1] - origin[1]) * inverseDirection[1]);   // TOP
            var t5 = ((boxMin[2] - origin[2]) * inverseDirection[2]);   // BACK
            var t6 = ((boxMax[2] - origin[2]) * inverseDirection[2]);   // FRONT
            
            var tMin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
            var tMax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
            
            if ((tMax < 0) || (tMin > tMax))
                return false;
            
            return true;
        }

        /**
         * @param {Array<number>} boxMin 
         * @param {Array<number>} boxMax 
         */
        this.RayIntersectSphere = function(boxMin, boxMax)
        {
            console.log("RayIntersectSphere: NOT IMPLEMENTED YET");
        }

        //
        // MAIN
        //

        direction        = calculateRay(x, y);
        inverseDirection = vec3.fromValues((1.0 / direction[0]), (1.0 / direction[1]), (1.0 / direction[2]));
        origin           = RenderEngine.Camera.Position();
    }
}
