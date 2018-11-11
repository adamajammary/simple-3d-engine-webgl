attribute vec3 VertexNormal;
attribute vec3 VertexPosition;
attribute vec2 VertexTextureCoords;

// varying vec3 FragmentNormal;
// varying vec4 FragmentPosition;
varying vec2 FragmentTextureCoords;

uniform mat4 MatrixModel;
uniform mat4 MatrixView;
uniform mat4 MatrixProjection;
uniform mat4 MatrixMVP;

void main()
{
    /*vec4 worldPosition    = (matrixModel * vec4(vertexPosition.xy, 0.0, 1.0));
	fragmentTextureCoords = vec2(((vertexPosition.x + 1.0) * 0.5), ((vertexPosition.y + 1.0) * 0.5));
    gl_Position           = worldPosition;*/

	FragmentTextureCoords = vec2(((VertexPosition.x + 1.0) * 0.5), ((VertexPosition.y + 1.0) * 0.5));
    gl_Position           = (MatrixModel * vec4(VertexPosition.xy, 0.0, 1.0));
}
