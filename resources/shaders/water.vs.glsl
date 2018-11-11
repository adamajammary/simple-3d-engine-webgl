attribute vec3 VertexNormal;
attribute vec3 VertexPosition;
attribute vec2 VertexTextureCoords;

varying vec4 ClipSpace;
varying vec4 FragmentPosition;
varying vec2 FragmentTextureCoords;

uniform mat4 MatrixModel;
uniform mat4 MatrixView;
uniform mat4 MatrixProjection;
uniform mat4 MatrixMVP;

/*//varying vec3 fromVertexToCamera;
//varying vec3 fromLightToVertex;

// uniform vec3  cameraPosition;
uniform float clipHeight;
varying vec4  clipSpace;*/

void main()
{
    /*vec4 worldPosition = (matrixModel * vec4(vertexPosition, 1.0));

    fragmentPosition      = worldPosition;
    fragmentTextureCoords = vertexTextureCoords;
    //fragmentTextureCoords = vec2(vertexPosition.x * 0.5 + 0.5, vertexPosition.y * 0.5 + 0.5);
    //fromVertexToCamera    = (cameraPosition - worldPosition.xyz);
    clipSpace             = (matrixProjection * matrixView * worldPosition);

    gl_Position = clipSpace;*/

    FragmentTextureCoords = VertexTextureCoords;
    FragmentPosition      = (MatrixModel * vec4(VertexPosition, 1.0));
    ClipSpace             = (MatrixMVP   * vec4(VertexPosition, 1.0));

    gl_Position = ClipSpace;    
}
