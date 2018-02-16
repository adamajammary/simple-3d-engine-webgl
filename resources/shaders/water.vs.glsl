//attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
attribute vec2 vertexTextureCoords;

varying vec4 clipSpace;
varying vec4 fragmentPosition;
varying vec2 fragmentTextureCoords;
//varying vec3 fromVertexToCamera;
//varying vec3 fromLightToVertex;

// uniform vec3  cameraPosition;
uniform float clipHeight;
uniform mat4  matrixModel;
uniform mat4  matrixView;
uniform mat4  matrixProjection;

void main()
{
    vec4 worldPosition = (matrixModel * vec4(vertexPosition, 1.0));

    fragmentPosition      = worldPosition;
    fragmentTextureCoords = vertexTextureCoords;
    //fragmentTextureCoords = vec2(vertexPosition.x * 0.5 + 0.5, vertexPosition.y * 0.5 + 0.5);
    //fromVertexToCamera    = (cameraPosition - worldPosition.xyz);
    clipSpace             = (matrixProjection * matrixView * worldPosition);

    gl_Position = clipSpace;
}
