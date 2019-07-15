#version 300 es

const int MAX_TEXTURES      = 6;
const int VERTICES_PER_FACE = 3;

layout(triangles)                       in;
layout(triangle_strip, max_vertices=18) out;

out vec4 FragmentPosition;

uniform mat4 Normal;
uniform mat4 Model;
uniform mat4 VP[MAX_TEXTURES];
uniform mat4 MVP;

uniform vec4 LightPosition;

void main()
{
	for (int face = 0; face < MAX_TEXTURES; face++)
	{
		int layer = int(LightPosition.w);
		gl_Layer  = (layer >= 0 ? (layer * MAX_TEXTURES + face) : face);

		for (int vertex = 0; vertex < VERTICES_PER_FACE; vertex++)
		{
			FragmentPosition = gl_in[vertex].gl_Position;
			gl_Position      = (VP[face] * FragmentPosition);

			EmitVertex();
		}    

		EndPrimitive();
	}
}
