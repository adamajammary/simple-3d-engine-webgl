attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
attribute vec2 vertexTextureCoords;

uniform mat4 matrixModel;
uniform mat4 matrixView;
uniform mat4 matrixProjection;

void main()
{
    vec4 worldPosition = (matrixModel * vec4(vertexPosition, 1.0));
    gl_Position = (matrixProjection * matrixView * worldPosition);
}
