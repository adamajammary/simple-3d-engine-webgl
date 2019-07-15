#version 300 es

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

const int MAX_TEXTURES = 6;

in vec2 FragmentTextureCoords;

out vec4 GL_FragColor;

uniform vec4 MaterialColor;
uniform vec4 IsTransparent;

uniform sampler2D Textures[MAX_TEXTURES];

void main()
{
	vec4 sampledColor = texture(Textures[5], FragmentTextureCoords);

	if (IsTransparent.x > 0.1)
		GL_FragColor = sampledColor;
	else
		GL_FragColor = vec4(sampledColor.rgb, MaterialColor.a);
}
