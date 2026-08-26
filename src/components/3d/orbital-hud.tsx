"use client";

export function OrbitalHUD() {
  return (
    <svg
      className="absolute inset-0 h-full w-full pointer-events-none"
      viewBox="0 0 600 600"
    >
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#A855F7" stopOpacity="0.15" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* OUTER RING */}
      <g
        style={{
          transformOrigin: "300px 300px",
          animation: "spin-slow 40s linear infinite",
        }}
      >
        <circle
          cx="300"
          cy="300"
          r="250"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="1.5"
          strokeDasharray="18 12"
        />

        <circle cx="300" cy="50" r="4" fill="#A855F7" filter="url(#glow)" />
        <circle cx="550" cy="300" r="4" fill="#A855F7" filter="url(#glow)" />
        <circle cx="300" cy="550" r="4" fill="#A855F7" filter="url(#glow)" />
        <circle cx="50" cy="300" r="4" fill="#A855F7" filter="url(#glow)" />
      </g>

      {/* MIDDLE RING */}
      <g
        style={{
          transformOrigin: "300px 300px",
          animation: "spin-reverse 28s linear infinite",
        }}
      >
        <circle
          cx="300"
          cy="300"
          r="185"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="1"
          strokeDasharray="10 8"
        />

        <circle cx="300" cy="115" r="3" fill="#A855F7" filter="url(#glow)" />
        <circle cx="485" cy="300" r="3" fill="#A855F7" filter="url(#glow)" />
        <circle cx="300" cy="485" r="3" fill="#A855F7" filter="url(#glow)" />
        <circle cx="115" cy="300" r="3" fill="#A855F7" filter="url(#glow)" />
      </g>

      {/* INNER RING */}
      <g
        style={{
          transformOrigin: "300px 300px",
          animation: "spin-slow 18s linear infinite",
        }}
      >
        <circle
          cx="300"
          cy="300"
          r="120"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
      </g>
    </svg>
  );
}
