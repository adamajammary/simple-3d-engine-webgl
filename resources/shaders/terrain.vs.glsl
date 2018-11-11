attribute vec3 VertexNormal;
attribute vec3 VertexPosition;
attribute vec2 VertexTextureCoords;

varying vec3 FragmentNormal;
varying vec4 FragmentPosition;
varying vec2 FragmentTextureCoords;

uniform mat4 MatrixModel;
uniform mat4 MatrixView;
uniform mat4 MatrixProjection;
uniform mat4 MatrixMVP;

void main()
{
    /*vec4 worldPosition = (matrixModel * vec4(vertexPosition, 1.0));

    fragmentNormal        = (matrixModel * vec4(vertexNormal, 0.0)).xyz;
    fragmentPosition      = worldPosition;
    fragmentTextureCoords = vertexTextureCoords;

    gl_Position = (matrixProjection * matrixView * worldPosition);*/

    FragmentNormal        = (MatrixModel * vec4(VertexNormal, 0.0)).xyz;
    FragmentPosition      = (MatrixModel * vec4(VertexPosition, 1.0));
    FragmentTextureCoords = VertexTextureCoords;

	gl_Position = (MatrixMVP * vec4(VertexPosition, 1.0));	
}
