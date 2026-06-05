// Liquid-glass refraction filter — ported from the technique behind
// dashersw/liquid-glass-js, but done with an SVG displacement map instead of
// WebGL/html2canvas so it composites natively under our existing backdrop blur.
// feTurbulence generates a noise field; feDisplacementMap bends the blurred
// backdrop along that field, giving the wobbly edge refraction of real glass.
// Rendered once, referenced by CSS via `filter: url(#liquid-glass)`.
export function GlassFilter() {
  return (
    <svg className="glass-defs" aria-hidden="true" width="0" height="0">
      <defs>
        <filter
          id="liquid-glass"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.011"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.2" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="26"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
