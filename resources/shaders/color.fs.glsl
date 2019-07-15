#version 300 es

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

out vec4 GL_FragColor;

uniform vec4 Color;

void main()
{
	GL_FragColor = Color;
}
