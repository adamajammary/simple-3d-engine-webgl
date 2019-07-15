#version 300 es

const int MAX_TEXTURES = 6;

in vec3 VertexNormal;
in vec3 VertexPosition;
in vec2 VertexTextureCoords;

out vec2 FragmentTextureCoords;

uniform mat4 Normal;
uniform mat4 Model;
uniform mat4 VP[MAX_TEXTURES];
uniform mat4 MVP;

void main()
{
	FragmentTextureCoords = vec2(((VertexPosition.x + 1.0) * 0.5), ((VertexPosition.y + 1.0) * 0.5));
    gl_Position           = (Model * vec4(VertexPosition.xy, 0.0, 1.0));
}
