attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
attribute vec2 vertexTextureCoords;

varying   vec3 fragmentNormal;
varying   vec4 fragmentPosition;
varying   vec2 fragmentTextureCoords;

uniform   float clipHeight;
uniform   mat4  matrixModel; // World/Model
uniform   mat4  matrixView;  // Camera/View
uniform   mat4  matrixProjection;

void main()
{
    vec4 worldPosition = (matrixModel * vec4(vertexPosition, 1.0));

    fragmentNormal        = (matrixModel * vec4(vertexNormal, 0.0)).xyz;
    fragmentPosition      = worldPosition;
    fragmentTextureCoords = vertexTextureCoords;

    gl_Position = (matrixProjection * matrixView * worldPosition);
}
