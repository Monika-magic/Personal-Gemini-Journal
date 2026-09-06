import React, { useEffect, useRef, useState } from "react";
import { DiaryThemeId } from "../../types";
import { DIARY_THEMES } from "../../data/themes";

interface ThemeEnvironmentProps {
  themeId: DiaryThemeId;
  children: React.ReactNode;
  reducedMotion?: boolean;
  className?: string;
}

export const ThemeEnvironment: React.FC<ThemeEnvironmentProps> = ({
  themeId,
  children,
  reducedMotion = false,
  className = "",
}) => {
  const currentTheme = DIARY_THEMES[themeId] || DIARY_THEMES.classic;

  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden transition-colors duration-700 ${currentTheme.environment.bgCanvas} ${className}`}
    >
      {/* Background Atmosphere Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Ambient Radial Lighting */}
        <div
          className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full blur-[120px] transition-colors duration-1000 ${currentTheme.environment.glowOne}`}
        />
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] rounded-full blur-[140px] transition-colors duration-1000 ${currentTheme.environment.glowTwo}`}
        />

        {/* Dynamic Living Environment Simulations */}
        {themeId === "ocean" && (
          <OceanWavesCanvas reducedMotion={reducedMotion} />
        )}
        {themeId === "galaxy" && (
          <GalaxyNightCanvas reducedMotion={reducedMotion} />
        )}
        {themeId === "windy_leaves" && (
          <WindyLeavesCanvas layer="behind" reducedMotion={reducedMotion} />
        )}
        {themeId === "peacock" && (
          <PeacockFeathersEnvironment reducedMotion={reducedMotion} />
        )}
        {themeId === "classic" && (
          <ClassicStudyAtmosphere />
        )}
      </div>

      {/* Main Content (Diary Book / Cover) - Sits in the Primary Center Layer */}
      <div className="relative z-10 w-full h-full flex flex-col min-h-0">
        {children}
      </div>

      {/* Foreground Environmental Elements (e.g. subtle leaves drifting in front of diary) */}
      {themeId === "windy_leaves" && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <WindyLeavesCanvas layer="front" reducedMotion={reducedMotion} />
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   1. CLASSIC STUDY ATMOSPHERE
   ========================================================================= */
const ClassicStudyAtmosphere: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Warm natural desk vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(139,69,19,0.06)_100%)]" />
      {/* Soft warm sunbeam accent */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
    </div>
  );
};

/* =========================================================================
   2. PEACOCK FEATHERS ENVIRONMENT (Strictly Non-Religious Natural Aesthetic)
   ========================================================================= */
const PeacockFeathersEnvironment: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Deep teal / emerald ambient glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,61,58,0.3)_0%,rgba(6,24,23,0.85)_100%)]" />

      {/* Iridescent luxury light ribbons in corners */}
      <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-teal-600/15 via-emerald-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Realistic Left Peacock Feather (Resting beside the diary with fine natural barbs) */}
      <div
        className={`hidden lg:block absolute left-2 xl:left-8 top-1/2 -translate-y-1/2 w-48 xl:w-60 h-[520px] filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] pointer-events-none transition-transform duration-1000 ${
          reducedMotion ? "" : "animate-[pulse_9s_ease-in-out_infinite]"
        }`}
      >
        <svg viewBox="0 0 160 480" className="w-full h-full transform -rotate-12 opacity-85">
          <defs>
            {/* Peacock Eyelet Central Gradient */}
            <radialGradient id="peacock-pupil" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="45%" stopColor="#1C2541" />
              <stop offset="70%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0284C7" />
            </radialGradient>
            {/* Iridescent Turquoise Halo */}
            <radialGradient id="peacock-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="55%" stopColor="#0D9488" />
              <stop offset="85%" stopColor="#059669" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
            {/* Golden Copper Outer Ring */}
            <radialGradient id="peacock-gold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#B45309" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
            </radialGradient>
            {/* Feather Shaft Gradient */}
            <linearGradient id="feather-shaft" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4D4D8" />
              <stop offset="50%" stopColor="#A1A1AA" />
              <stop offset="100%" stopColor="#52525B" />
            </linearGradient>
          </defs>

          {/* Central Quill Shaft (Rachis) */}
          <path
            d="M 80 470 Q 78 250 82 20"
            stroke="url(#feather-shaft)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Fine Feather Barbs radiating left & right */}
          {Array.from({ length: 42 }).map((_, i) => {
            const y = 50 + i * 9.5;
            const length = Math.sin((i / 42) * Math.PI) * 48 + 14;
            const curve = (i - 20) * 0.4;
            return (
              <g key={i}>
                {/* Left Barb */}
                <path
                  d={`M 80 ${y} Q ${80 - length * 0.5} ${y - curve} ${80 - length} ${y + 8}`}
                  stroke={i % 3 === 0 ? "#059669" : i % 3 === 1 ? "#0D9488" : "#0284C7"}
                  strokeWidth="1.2"
                  strokeOpacity={0.75}
                  fill="none"
                />
                {/* Right Barb */}
                <path
                  d={`M 80 ${y} Q ${80 + length * 0.5} ${y - curve} ${80 + length} ${y + 8}`}
                  stroke={i % 3 === 0 ? "#059669" : i % 3 === 1 ? "#0284C7" : "#0D9488"}
                  strokeWidth="1.2"
                  strokeOpacity={0.75}
                  fill="none"
                />
              </g>
            );
          })}

          {/* Golden Eyelet Ring Outer */}
          <ellipse cx="81" cy="90" rx="30" ry="38" fill="url(#peacock-gold)" />
          {/* Iridescent Turquoise / Green Inner Halo */}
          <ellipse cx="81" cy="92" rx="22" ry="28" fill="url(#peacock-halo)" />
          {/* Royal Blue / Indigo Heart Pupil */}
          <path
            d="M 81 78 C 92 78 95 90 92 100 C 89 108 81 114 81 114 C 81 114 73 108 70 100 C 67 90 70 78 81 78 Z"
            fill="url(#peacock-pupil)"
          />
          {/* Specular Highlight on Pupil */}
          <ellipse cx="85" cy="88" rx="4" ry="6" fill="#67E8F9" opacity="0.6" />
        </svg>
      </div>

      {/* Subtle Right Feather Tip resting softly beside bottom right */}
      <div className="hidden lg:block absolute right-0 bottom-4 w-40 h-72 opacity-60 filter drop-shadow-lg pointer-events-none transform rotate-45">
        <svg viewBox="0 0 120 280" className="w-full h-full">
          <path d="M 60 270 Q 58 140 60 10" stroke="#CBD5E1" strokeWidth="2.5" fill="none" />
          {Array.from({ length: 24 }).map((_, i) => (
            <path
              key={i}
              d={`M 60 ${20 + i * 10} Q ${60 - (i % 2 === 0 ? 35 : -35)} ${20 + i * 10 - 5} ${
                60 - (i % 2 === 0 ? 45 : -45)
              } ${20 + i * 10 + 6}`}
              stroke="#0D9488"
              strokeWidth="1.2"
              strokeOpacity="0.6"
              fill="none"
            />
          ))}
          <ellipse cx="60" cy="50" rx="20" ry="24" fill="url(#peacock-halo)" />
          <circle cx="60" cy="50" r="10" fill="#1E3A8A" />
        </svg>
      </div>
    </div>
  );
};

/* =========================================================================
   3. OCEAN CALM PROCEDURAL CANVAS (Realistic Continuous Waves & Sunlight)
   ========================================================================= */
const OceanWavesCanvas: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawWave = (
      baseY: number,
      amplitude: number,
      frequency: number,
      speed: number,
      color: string,
      foamColor: string
    ) => {
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 6) {
        // Multi-harmonic realistic wave formulation avoiding simple repetitiveness
        const y =
          baseY +
          Math.sin(x * frequency + time * speed) * amplitude +
          Math.sin(x * frequency * 0.45 - time * speed * 0.7) * (amplitude * 0.35) +
          Math.cos(x * 0.003 + time * speed * 0.3) * (amplitude * 0.2);

        if (x === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Delicate foam line on wave crest
      ctx.strokeStyle = foamColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const h = canvas.height;
      const horizonY = h * 0.38;

      // Soft sunlit ocean horizon gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, "#082F49");
      skyGrad.addColorStop(0.6, "#0C4A6E");
      skyGrad.addColorStop(1, "#0369A1");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, horizonY);

      // Sunlight horizon glow reflection
      const sunGrad = ctx.createRadialGradient(
        canvas.width * 0.5,
        horizonY - 10,
        5,
        canvas.width * 0.5,
        horizonY + 30,
        canvas.width * 0.4
      );
      sunGrad.addColorStop(0, "rgba(254, 240, 138, 0.3)");
      sunGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.15)");
      sunGrad.addColorStop(1, "transparent");
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, horizonY - 40, canvas.width, 180);

      // Draw 4 organic layers of rolling ocean waves from background to foreground
      drawWave(
        horizonY + 20,
        8,
        0.007,
        reducedMotion ? 0.002 : 0.012,
        "rgba(3, 105, 161, 0.85)",
        "rgba(186, 230, 253, 0.35)"
      );

      drawWave(
        horizonY + 70,
        14,
        0.005,
        reducedMotion ? 0.003 : 0.018,
        "rgba(2, 132, 199, 0.8)",
        "rgba(224, 242, 254, 0.5)"
      );

      drawWave(
        horizonY + 140,
        22,
        0.004,
        reducedMotion ? 0.004 : 0.024,
        "rgba(14, 116, 144, 0.85)",
        "rgba(255, 255, 255, 0.55)"
      );

      drawWave(
        horizonY + 230,
        30,
        0.003,
        reducedMotion ? 0.005 : 0.03,
        "rgba(8, 47, 73, 0.95)",
        "rgba(255, 255, 255, 0.7)"
      );

      time += 1;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
    />
  );
};

/* =========================================================================
   4. GALAXY NIGHT PROCEDURAL CANVAS (Realistic Twinkling Stars & Nebula)
   ========================================================================= */
const GalaxyNightCanvas: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate realistic multi-magnitude stars
    const starCount = Math.min(140, Math.floor((canvas.width * canvas.height) / 7000));
    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.6 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: (Math.random() * 0.03 + 0.008) * (reducedMotion ? 0.2 : 1),
      twinkleOffset: Math.random() * Math.PI * 2,
      color:
        Math.random() > 0.8
          ? "#A5B4FC" // cool blue star
          : Math.random() > 0.6
          ? "#FDE68A" // warm gold star
          : "#FFFFFF", // white star
    }));

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Distant deep cosmic nebula clouds
      const nebula1 = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.25,
        10,
        canvas.width * 0.3,
        canvas.height * 0.25,
        canvas.width * 0.45
      );
      nebula1.addColorStop(0, "rgba(49, 46, 129, 0.22)");
      nebula1.addColorStop(0.5, "rgba(67, 56, 202, 0.1)");
      nebula1.addColorStop(1, "transparent");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebula2 = ctx.createRadialGradient(
        canvas.width * 0.75,
        canvas.height * 0.7,
        10,
        canvas.width * 0.75,
        canvas.height * 0.7,
        canvas.width * 0.5
      );
      nebula2.addColorStop(0, "rgba(88, 28, 135, 0.18)");
      nebula2.addColorStop(0.6, "rgba(124, 58, 237, 0.08)");
      nebula2.addColorStop(1, "transparent");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render realistic stars with soft sinusoidal twinkle
      for (const s of stars) {
        const pulse = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset);
        const currentAlpha = Math.max(0.15, Math.min(1, s.baseAlpha + pulse * 0.35));

        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle soft diffraction ring for brightest stars
        if (s.radius > 1.4 && currentAlpha > 0.75) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = currentAlpha * 0.4;
          ctx.beginPath();
          ctx.moveTo(s.x - 3.5, s.y);
          ctx.lineTo(s.x + 3.5, s.y);
          ctx.moveTo(s.x, s.y - 3.5);
          ctx.lineTo(s.x, s.y + 3.5);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      frame++;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

/* =========================================================================
   5. WINDY LEAVES ORGANIC PARTICLE ENGINE (Drifting Foliage in Natural Motion)
   ========================================================================= */
interface LeafParticle {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  oscillation: number;
  oscillationSpeed: number;
  color: string;
  shape: "maple" | "oak" | "beech";
  isForeground: boolean;
}

const WindyLeavesCanvas: React.FC<{
  layer: "front" | "behind";
  reducedMotion: boolean;
}> = ({ layer, reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "#D97706", // Amber
      "#B45309", // Warm Russet
      "#9A3412", // Autumn Crimson
      "#78350F", // Deep Chestnut
      "#CA8A04", // Golden Oak
    ];

    const leafShapes: ("maple" | "oak" | "beech")[] = ["maple", "oak", "beech"];

    // Total leaves: distributed between behind and front
    const count = layer === "front" ? 7 : 16;

    const leaves: LeafParticle[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * (canvas.width + 200) - 100,
      y: Math.random() * canvas.height,
      size: (Math.random() * 12 + 14) * (layer === "front" ? 1.2 : 0.9),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() * 2 - 1) * (reducedMotion ? 0.3 : 1.2),
      speedX: (Math.random() * 1.8 + 1.2) * (reducedMotion ? 0.2 : 1),
      speedY: (Math.random() * 0.9 + 0.4) * (reducedMotion ? 0.2 : 1),
      oscillation: Math.random() * Math.PI * 2,
      oscillationSpeed: Math.random() * 0.04 + 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: leafShapes[Math.floor(Math.random() * leafShapes.length)],
      isForeground: layer === "front",
    }));

    // Draw single realistic leaf vector on canvas
    const drawLeaf = (leaf: LeafParticle) => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate((leaf.rotation * Math.PI) / 180);

      ctx.fillStyle = leaf.color;
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();

      const s = leaf.size;

      if (leaf.shape === "oak") {
        // Rounded lobes
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.6, -s * 0.6, s * 0.8, s * 0.2, 0, s);
        ctx.bezierCurveTo(-s * 0.8, s * 0.2, -s * 0.6, -s * 0.6, 0, -s);
      } else if (leaf.shape === "maple") {
        // Pointed 3-part leaf
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.4, -s * 0.4);
        ctx.lineTo(s * 0.9, -s * 0.2);
        ctx.lineTo(s * 0.4, s * 0.3);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.4, s * 0.3);
        ctx.lineTo(-s * 0.9, -s * 0.2);
        ctx.lineTo(-s * 0.4, -s * 0.4);
        ctx.closePath();
      } else {
        // Delicate oval beech leaf
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(s * 0.5, 0, 0, s);
        ctx.quadraticCurveTo(-s * 0.5, 0, 0, -s);
      }

      ctx.fill();
      ctx.stroke();

      // Delicate central leaf vein
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.lineTo(0, s * 0.8);
      ctx.stroke();

      ctx.restore();
    };

    let gustTimer = 0;
    let gustVelocity = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Occasional natural wind gust modulation
      gustTimer++;
      if (gustTimer > 350 && !reducedMotion) {
        gustVelocity = Math.sin((gustTimer - 350) * 0.05) * 1.6;
        if (gustTimer > 480) {
          gustTimer = 0;
          gustVelocity = 0;
        }
      }

      for (const leaf of leaves) {
        leaf.oscillation += leaf.oscillationSpeed;
        const windDrift = Math.sin(leaf.oscillation) * 0.9;

        leaf.x += leaf.speedX + windDrift + gustVelocity;
        leaf.y += leaf.speedY;
        leaf.rotation += leaf.rotationSpeed;

        // Wrap around seamlessly off-screen
        if (leaf.x > canvas.width + 60) {
          leaf.x = -60;
          leaf.y = Math.random() * canvas.height;
        }
        if (leaf.y > canvas.height + 60) {
          leaf.y = -60;
          leaf.x = Math.random() * canvas.width;
        }

        drawLeaf(leaf);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [layer, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${
        layer === "front" ? "opacity-75" : "opacity-90"
      }`}
    />
  );
};
