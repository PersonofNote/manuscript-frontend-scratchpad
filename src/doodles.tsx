import React, { useEffect, useRef, useCallback } from 'react';

export type DoodleFunction = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void;

type Props = {
  doodles: DoodleFunction[]; // list of doodle drawing algorithms
  theme?: 'light' | 'dark';   // optional future themes
};

export const Doodles: React.FC<Props> = ({ doodles, theme = 'light' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Responsive density logic
    const baseDensity = 0.0001; // doodles per pixel
    const rawCount = canvas.width * canvas.height * baseDensity;
  
    // Clamp between 20 and 150 doodles
    const count = Math.max(20, Math.min(150, Math.floor(rawCount)));
  
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 20 + 10;
      const doodle = doodles[Math.floor(Math.random() * doodles.length)];
      ctx.save();
      doodle(ctx, x, y, size);
      ctx.restore();
    }
  }, [doodles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };
  
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  
    let intervalId: number | undefined;
  
    if (!prefersReducedMotion) {
      // 🔥 Slow redraw every N milliseconds
      intervalId = window.setInterval(() => {
        draw();
      }, 3000 + Math.random() * 2000);
    }
  
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [draw, theme]);
  

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};
