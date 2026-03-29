"use client";

export default function LiquidBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#080812]" />

      {/* Orb 1 — violet, top-left */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          top: "-100px",
          left: "-150px",
          background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
          animation: "orb-drift-1 18s ease-in-out infinite",
        }}
      />

      {/* Orb 2 — indigo, bottom-right */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-15"
        style={{
          bottom: "-200px",
          right: "-200px",
          background: "radial-gradient(circle, #4338ca 0%, transparent 70%)",
          animation: "orb-drift-2 22s ease-in-out infinite",
        }}
      />

      {/* Orb 3 — blue-violet, center */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          top: "40%",
          left: "40%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)",
          animation: "orb-drift-3 28s ease-in-out infinite",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Very subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
