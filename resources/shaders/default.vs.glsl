#version 300 es

const int MAX_TEXTURES = 6;

in vec3 VertexNormal;
in vec3 VertexPosition;
in vec2 VertexTextureCoords;

out vec3 FragmentNormal;
out vec4 FragmentPosition;
out vec2 FragmentTextureCoords;
out vec4 ClipSpace;

uniform mat3 Normal;
uniform mat4 Model;
uniform mat4 VP[MAX_TEXTURES];
uniform mat4 MVP;

void main()
{
	//FragmentNormal = vec3(Model * vec4(VertexNormal, 0.0));
	//FragmentNormal = vec3(transpose(inverse(mat3(Model))) * VertexNormal);
	FragmentNormal        = (Normal * VertexNormal);
	FragmentPosition      = (Model * vec4(VertexPosition, 1.0));
	FragmentTextureCoords = VertexTextureCoords;
	ClipSpace             = (MVP * vec4(VertexPosition, 1.0));
	gl_Position           = ClipSpace;
}
