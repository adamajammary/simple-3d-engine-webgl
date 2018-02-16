attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
attribute vec2 vertexTextureCoords;

varying vec3 fragmentNormal;
varying vec4 fragmentPosition;
varying vec2 fragmentTextureCoords;

uniform mat4 matrixModel;
uniform mat4 matrixView;
uniform mat4 matrixProjection;

void main()
{
    vec4 worldPosition = (matrixModel * vec4(vertexPosition, 1.0));

    fragmentNormal        = (matrixModel * vec4(vertexNormal, 0.0)).xyz;
    fragmentPosition      = worldPosition;
    fragmentTextureCoords = vertexTextureCoords;

    gl_Position = (matrixProjection * matrixView * worldPosition);
}
