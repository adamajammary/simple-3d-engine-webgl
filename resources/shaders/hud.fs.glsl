#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

const int MAX_TEXTURES = 6;

//varying vec3 fragmentNormal;
//varying vec4 fragmentPosition;
varying vec2 FragmentTextureCoords;

uniform vec4      MaterialColor;
uniform bool      IsTransparent;
uniform sampler2D Textures[MAX_TEXTURES];
//uniform bool      isTextured;
//uniform vec2      textureScales[MAX_TEXTURES];	// tx = [ [x, y], [x, y], ... ];

void main()
{
	/*vec4 sampledColor = texture2D(textures[5], fragmentTextureCoords);

	if (isTransparent) {
		gl_FragColor = sampledColor;
	} else {
		gl_FragColor = vec4(sampledColor.rgb, materialColor.a);
	}*/

	vec4 sampledColor = texture2D(Textures[5], FragmentTextureCoords);

	if (IsTransparent)
		gl_FragColor = sampledColor;
	else
		gl_FragColor = vec4(sampledColor.rgb, MaterialColor.a);	
}
