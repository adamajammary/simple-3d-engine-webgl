//attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
//attribute vec2 vertexTextureCoords;

//varying vec3 fragmentNormal;
//varying vec4 fragmentPosition;
varying vec2 fragmentTextureCoords;

uniform mat4 matrixModel;
// uniform mat4 matrixView;
// uniform mat4 matrixProjection;

void main()
{
    vec4 worldPosition    = (matrixModel * vec4(vertexPosition.xy, 0.0, 1.0));
	fragmentTextureCoords = vec2(((vertexPosition.x + 1.0) * 0.5), ((vertexPosition.y + 1.0) * 0.5));
    gl_Position           = worldPosition;
}
