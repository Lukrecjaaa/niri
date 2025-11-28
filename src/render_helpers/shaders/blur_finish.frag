// Ported from https://github.com/nferhat/fht-compositor/blob/main/src/renderer/shaders/blur-finish.frag
//
// Implementation from pinnacle-comp/pinnacle (GPL-3.0)
// Thank you very much!
#version 100

//_DEFINES_

#if defined(EXTERNAL)
#extension GL_OES_EGL_image_external : require
#endif

precision highp float;
#if defined(EXTERNAL)
uniform samplerExternalOES tex;
#else
uniform sampler2D tex;
#endif

uniform float alpha;
varying vec2 v_coords;

uniform float noise;

// Noise function copied from hyprland.
// I like the effect it gave, can be tweaked further
float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 727.727); // wysi :wink: :wink:
    p3 += dot(p3, p3.xyz + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
    if (alpha <= 0.0) {
      discard;
    }

    if (ignore_alpha > 0.0) {
      vec4 alpha_color = texture2D(alpha_tex, v_coords);
      if (alpha_color.a < ignore_alpha) {
        discard;
      }
    }

    // Sample the texture.
    vec4 color = texture2D(tex, v_coords);

#if defined(NO_ALPHA)
    color = vec4(color.rgb, 1.0);
#endif

    if (noise > 0.0) {
      // Add noise fx
      // This can be used to achieve a glass look
      float noiseHash   = hash(v_coords);
      float noiseAmount = (mod(noiseHash, 1.0) - 0.5);
      color.rgb += noiseAmount * noise;
    }

    color *= alpha;

    if (color.a <= 0.0) {
      discard;
    }

    gl_FragColor = color;
}

// vim: ft=glsl
