#version 300 es

const int MAX_TEXTURES = 6;

in vec3 VertexNormal;
in vec3 VertexPosition;
in vec2 VertexTextureCoords;

uniform mat4 Normal;
uniform mat4 Model;
uniform mat4 VP[MAX_TEXTURES];
uniform mat4 MVP;

void main()
{
	gl_Position = (MVP * vec4(VertexPosition, 1.0));
}
