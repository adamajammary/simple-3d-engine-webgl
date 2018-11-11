/**
* Buffer
* @class
*/
class Buffer
{
    /**
    * @param {object}        bufferType
    * @param {number}        arrayType
    * @param {Array<number>} array
    */
    constructor(bufferType, arrayType, array)
    {
        let gl = RenderEngine.GLContext();
        let id = null;
        
        init();

        function init()
        {
            id = gl.createBuffer();

            if (id)
            {
                gl.bindBuffer(bufferType, id);

                let buffer;

                switch (arrayType) {
                    case ArrayType.FLOAT32: buffer = new Float32Array(array); break;
                    case ArrayType.FLOAT64: buffer = new Float64Array(array); break;
                    case ArrayType.INT16:   buffer = new Int16Array(array);   break;
                    case ArrayType.UINT16:  buffer = new Uint16Array(array);  break;
                    case ArrayType.INT32:   buffer = new Int32Array(array);   break;
                    case ArrayType.UINT32:  buffer = new Uint32Array(array);  break;
                    case ArrayType.INT64:   buffer = new Int64Array(array);   break;
                    case ArrayType.UINT64:  buffer = new Uint64Array(array);  break;
                    default: buffer = null; break;
                }

                if (buffer) {
                    gl.bufferData(bufferType, buffer,  gl.STATIC_DRAW);
                    gl.bindBuffer(bufferType, null);
                } else {
                    alert("ERROR: Invalid array type.");
                }
            } else {
                alert("ERROR: Failed to create the buffer.");
            }        
        }
        
        /**
        * @return {object}
        */
        this.ID = function()
        {
            return id;
        }
    }
}
