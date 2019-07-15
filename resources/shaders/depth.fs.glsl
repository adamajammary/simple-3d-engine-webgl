#version 300 es

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

void main()
{
	//gl_FragDepth = gl_FragCoord.z;
}
