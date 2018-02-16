#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

const int MAX_TEXTURES = 6;

struct Camera
{
	vec3  Position;
	float Near;
	float Far;
};

struct Light
{
	vec4  Color;
	vec3  Direction;
	vec3  Position;
	float Reflection;
	float Shine;
};

varying vec3 fragmentNormal;
varying vec4 fragmentPosition;
varying vec2 fragmentTextureCoords;

uniform vec3      ambient;
uniform bool      enableClipping;
uniform vec3      clipMax;
uniform vec3      clipMin;
uniform bool      isTextured;
uniform vec4      materialColor;
uniform Light     sunLight;
uniform sampler2D textures[MAX_TEXTURES];
//uniform float     textureScales[MAX_TEXTURES];
uniform vec2      textureScales[MAX_TEXTURES];	// tx = [ [x, y], [x, y], ... ];

void main()
{
	if (enableClipping)
	{
		if ((fragmentPosition.x > clipMax.x) || (fragmentPosition.y > clipMax.y) || (fragmentPosition.z > clipMax.z)) {
			discard;
		}
		if ((fragmentPosition.x < clipMin.x) || (fragmentPosition.y < clipMin.y) || (fragmentPosition.z < clipMin.z)) {
			discard;
		}
	}

	//vec2 tiledCoordinates = (fragmentTextureCoords * textureScales[0]);
	vec2 tiledCoordinates = vec2(fragmentTextureCoords.x * textureScales[0].x, fragmentTextureCoords.y * textureScales[0].y);

	// LIGHT COLOR (PHONG REFLECTION)
	vec3 lightColor = (ambient + (sunLight.Color.rgb * dot(normalize(fragmentNormal), normalize(-sunLight.Direction))));
	lightColor = max(lightColor, 0.0);

	// TEXTURE
	if (isTextured) {
		vec4 texelColor = texture2D(textures[0], tiledCoordinates);
		gl_FragColor    = vec4((texelColor.rgb * lightColor), texelColor.a);
	} else {
		gl_FragColor = vec4((materialColor.rgb * lightColor), materialColor.a);
	}

	//gl_FragColor = vec4((vec3(0.0, 1.0, 0.0) * lightColor), 1.0);

	//gl_FragColor = vec4(fragmentColor, 1.0);
	//gl_FragColor = vec4(fragmentNormal, 1.0);
	//gl_FragColor = texture2D(textureSampler, fragmentTextureCoords);
	//gl_FragColor = vec4((texelColor.rgb * lightIntensity), texelColor.a);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	//gl_FragColor = vec4(fragmentTextureCoords, 1.0, 1.0);
}
