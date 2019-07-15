#version 300 es

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

//in vec4 FragmentPosition;

uniform vec4 LightPosition;

void main()
{
    //gl_FragDepth = (length(FragmentPosition.xyz - LightPosition.xyz) / 25.0);
}
