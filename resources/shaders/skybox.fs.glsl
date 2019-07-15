#version 300 es

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

const int MAX_TEXTURES = 6;

in      vec3        FragmentTextureCoords;
out     vec4        GL_FragColor;
uniform vec4        EnableSRGB;
uniform samplerCube Textures[MAX_TEXTURES];

// sRGB GAMMA CORRECTION
vec3 GetFragColorSRGB(vec3 colorRGB)
{
	if (EnableSRGB.x > 0.1) {
		float sRGB = (1.0 / 2.2);
		colorRGB.rgb = pow(colorRGB.rgb, vec3(sRGB, sRGB, sRGB));
	}

	return colorRGB;
}

void main()
{
	GL_FragColor     = texture(Textures[0], FragmentTextureCoords);
	GL_FragColor.rgb = GetFragColorSRGB(GL_FragColor.rgb);
}
