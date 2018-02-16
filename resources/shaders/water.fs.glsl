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

varying vec4 clipSpace;
varying vec4 fragmentPosition;
varying vec2 fragmentTextureCoords;
//varying vec3 fromVertexToCamera;
//varying vec3 fromLightToVertex;

uniform Camera    camera;
uniform vec3      clipMax;
uniform vec3      clipMin;
uniform bool      enableClipping;
uniform float     moveFactor;
uniform Light     sunLight;
uniform sampler2D textures[MAX_TEXTURES];
//uniform float     textureScales[MAX_TEXTURES];
uniform vec2      textureScales[MAX_TEXTURES];	// tx = [ [x, y], [x, y], ... ];
uniform float     waveStrength;

void main()
{
	// CLIPPING PLANE
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

	// PROJECTIVE TEXTURE
	vec2 normalizedDeviceSpace   = ((clipSpace.xy / clipSpace.w) * 0.5 + 0.5);				// [-1,-1] => [0,1]
	vec2 reflectionTextureCoords = vec2(normalizedDeviceSpace.x, -normalizedDeviceSpace.y);
	vec2 refractionTextureCoords = vec2(normalizedDeviceSpace.x, normalizedDeviceSpace.y);

	// // http://web.archive.org/web/20130416194336/http://olivers.posterous.com/linear-depth-in-glsl-for-real
	// // https://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer
	// // https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/gl_FragCoord.xhtml
	// float depth1                  = texture2D(textures[4], refractionTextureCoords).r;
	// float depth2                  = gl_FragCoord.z;
	// float a                       = (2.0 * camera.Near * camera.Far);
	// float b                       = (camera.Far + camera.Near);
	// float c                       = (camera.Far - camera.Near);
	// float distanceCameraToFloor   = (a / (b - (2.0 * depth1 - 1.0) * c));
	// float distanceCameraToSurface = (a / (b - (2.0 * depth2 - 1.0) * c));
	// float depth                   = (distanceCameraToSurface - distanceCameraToFloor);

	// DU/DV MAP - DISTORTION
	vec2 distortedTextureCoords = (texture2D(textures[2], vec2(tiledCoordinates.x + moveFactor, tiledCoordinates.y)).rg * 0.1);
	distortedTextureCoords      = (tiledCoordinates + vec2(distortedTextureCoords.x, distortedTextureCoords.y + moveFactor));
	vec2 totalDistortion        = ((texture2D(textures[2], distortedTextureCoords).rg * 2.0 - 1.0) * waveStrength);
	//vec2 totalDistortion        = ((texture2D(textures[2], distortedTextureCoords).rg * 2.0 - 1.0) * waveStrength * clamp((depth / 20.0), 0.0, 1.0));

	reflectionTextureCoords += totalDistortion;
	// reflectionTextureCoords.x = clamp(reflectionTextureCoords.x,  0.001,  0.999);
	// reflectionTextureCoords.y = clamp(reflectionTextureCoords.y, -0.999, -0.001);

	refractionTextureCoords += totalDistortion;
	// refractionTextureCoords  = clamp(refractionTextureCoords,    0.001,  0.999);
	
	vec4 reflectionColor = texture2D(textures[0], reflectionTextureCoords);
	vec4 refractionColor = texture2D(textures[1], refractionTextureCoords);

	// NORMAL MAP
	vec4 normalMapColor = texture2D(textures[3], distortedTextureCoords);
	//vec3 normal         = normalize(vec3(normalMapColor.r * 2.0 - 1.0, normalMapColor.b, normalMapColor.g * 2.0 - 1.0));
	vec3 normal         = normalize(vec3((normalMapColor.r * 2.0 - 1.0), (normalMapColor.b * 7.0), (normalMapColor.g * 2.0 - 1.0)));

	// FRESNEL EFFECT
    vec3  fromSurfaceToCamera = (camera.Position - fragmentPosition.xyz);
	vec3  fromLightToSurface  = (fragmentPosition.xyz - sunLight.Position);
	vec3  viewVector         = normalize(fromSurfaceToCamera);
	//float refractionFactor = clamp(pow(dot(viewVector, vec3(0.0, 1.0, 0.0)), 10.0), 0.0, 1.0);	// higher power => less reflective (transparent)
	float refractionFactor   = clamp(pow(dot(viewVector, normal), 10.0), 0.0, 1.0);	// higher power => less reflective (transparent)
	vec3  reflectedLight     = reflect(normalize(fromLightToSurface), normal);
	float specular           = pow(max(0.0, dot(reflectedLight, viewVector)), sunLight.Shine);
	vec3  specularHighlights = (sunLight.Color.rgb * specular * sunLight.Reflection);
	//vec3  specularHighlights = (sunLight.Color.rgb * specular * sunLight.Reflection * clamp((depth / 5.0), 0.0, 1.0));

	gl_FragColor  = (mix(reflectionColor, refractionColor, refractionFactor) + vec4(specularHighlights, 0.0));
	// gl_FragColor   = (mix(gl_FragColor, vec4(0.0, 0.3, 0.5, 1.0), 0.2) + vec4(specularHighlights, 0.0));
	//gl_FragColor.a = clamp((depth / 5.0), 0.0, 1.0);
}
