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
// uniform vec4             materialColor;
// uniform bool             isTextured;
uniform Light     sunLight;
// uniform sampler2D        backgroundTexture;	// 0
// uniform sampler2D        rTexture;			// 1
// uniform sampler2D        gTexture;			// 2
// uniform sampler2D        bTexture;			// 3
// uniform sampler2D        blendMap;			// 4
uniform sampler2D textures[MAX_TEXTURES];
//uniform float     textureScales[MAX_TEXTURES];
uniform vec2      textureScales[MAX_TEXTURES];	// tx = [ [x, y], [x, y], ... ];

// highp float rand(vec2 co)
// {
// 	highp float a  = 12.9898;
// 	highp float b  = 78.233;
// 	highp float c  = 43758.5453;
// 	highp float dt = dot(co.xy, vec2(a,b));
// 	highp float sn = mod(dt, 3.14);

// 	return fract(sin(sn) * c);
// }

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

	vec4  blendMapColor           = texture2D(textures[4], fragmentTextureCoords);
	float backgroundTextureAmount = (1.0 - (blendMapColor.r + blendMapColor.g + blendMapColor.b));
	//vec2  tiledCoordinates        = (fragmentTextureCoords * textureScales[0]);
	vec2  tiledCoordinates        = vec2(fragmentTextureCoords.x * textureScales[0].x, fragmentTextureCoords.y * textureScales[0].y);
	vec4  backgroundTextureColor  = (texture2D(textures[0], tiledCoordinates) * backgroundTextureAmount);
	vec4  rTextureColor           = (texture2D(textures[1], tiledCoordinates) * blendMapColor.r);
	vec4  gTextureColor           = (texture2D(textures[2], tiledCoordinates) * blendMapColor.g);
	vec4  bTextureColor           = (texture2D(textures[3], tiledCoordinates) * blendMapColor.b);
	vec4  totalColor              = (backgroundTextureColor + rTextureColor + gTextureColor + bTextureColor);

	// LIGHT COLOR (PHONG REFLECTION)
	vec3 lightColor = max((ambient + (sunLight.Color.rgb * dot(normalize(fragmentNormal), normalize(-sunLight.Direction)))), 0.0);
	gl_FragColor    = vec4((totalColor.rgb * lightColor), totalColor.a);

	// // TEXTURE
	// if (isTextured) {
	// 	texelColor   = texture2D(textureSampler, fragmentTextureCoords);
	// 	gl_FragColor = vec4((texelColor.rgb * lightColor), texelColor.a);
	// } else {
	// 	gl_FragColor = vec4((materialColor.rgb * lightColor), materialColor.a);
	// }

	// // DEEP WATER
	// if (fragmentPosition.y < 0.1) {
	// 	gl_FragColor = vec4((vec3(0.0, 0.0, rand(vec2(0.1, 0.5))) * lightColor), 1.0);
	// // WATER
	// } else if (fragmentPosition.y < 0.15) {
	// 	gl_FragColor = vec4((vec3(0.0, 0.0, rand(vec2(0.6, 1.0))) * lightColor), 1.0);
	// // SAND
	// } else if (fragmentPosition.y < 0.3) {
	// 	gl_FragColor = vec4((vec3(0.8, 0.7, 0.5) * lightColor), 1.0);
	// // GRASS
	// } else if (fragmentPosition.y < 0.5) {
	// 	gl_FragColor = vec4((vec3(0.0, rand(vec2(0.2, 1.0)), 0.0) * lightColor), 1.0);
	// // ROCK
	// } else if (fragmentPosition.y < 0.7) {
	// 	gl_FragColor = vec4((vec3(rand(vec2(0.4, 0.6)), rand(vec2(0.4, 0.6)), rand(vec2(0.4, 0.6))) * lightColor), 1.0);
	// // SNOW
	// } else if (fragmentPosition.y < 0.95) {
	// 	gl_FragColor = vec4((vec3(1.0, 1.0, 1.0) * lightColor), 1.0);
	// }

	//gl_FragColor = vec4(fragmentColor, 1.0);
	//gl_FragColor = vec4(fragmentNormal, 1.0);
	//gl_FragColor = texture2D(textureSampler, fragmentTextureCoords);
	//gl_FragColor = vec4((texelColor.rgb * lightIntensity), texelColor.a);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	//gl_FragColor = vec4(fragmentTextureCoords, 1.0, 1.0);
}
