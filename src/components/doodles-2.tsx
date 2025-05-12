import React, { useEffect, useRef, useCallback } from 'react';

type DoodleInstance = {
    x: number;
    y: number;
    size: number;
    targetX: number;
    targetY: number;
    targetSize: number;
    progress: number; // 0 to 1
    draw: DoodleFunction;
  };
  

export type DoodleFunction = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void;

type Props = {
  doodles: DoodleFunction[]; // list of doodle drawing algorithms
  theme?: 'light' | 'dark';   // optional future themes
};

export const Doodles: React.FC<Props> = ({ doodles, theme = 'light' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const doodlesRef = useRef<DoodleInstance[]>([]);

    const initDoodles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const count = Math.max(20, Math.min(150, Math.floor(canvas.width * canvas.height * 0.0001)));

    doodlesRef.current = Array.from({ length: count }).map(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 20 + 10;
        return {
        x,
        y,
        size,
        targetX: Math.random() * canvas.width,
        targetY: Math.random() * canvas.height,
        targetSize: Math.random() * 20 + 10,
        progress: 0,
        draw: doodles[Math.floor(Math.random() * doodles.length)],
        };
    });
    }, [doodles]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
      
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
      
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        doodlesRef.current.forEach((d) => {
          // interpolate position and size
          d.x += (d.targetX - d.x) * 0.01;
          d.y += (d.targetY - d.y) * 0.01;
          d.size += (d.targetSize - d.size) * 0.01;
          d.progress += 0.01;
      
          // when close to target, pick new one
          if (d.progress >= 1) {
            d.targetX = Math.random() * canvas.width;
            d.targetY = Math.random() * canvas.height;
            d.targetSize = Math.random() * 20 + 10;
            d.progress = 0;
          }
      
          ctx.save();
          d.draw(ctx, d.x, d.y, d.size);
          ctx.restore();
        });
      
        requestAnimationFrame(animate);
      }, []);
      


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

  useEffect(() => {
    initDoodles();
    animate();
  
    window.addEventListener('resize', initDoodles);
    return () => window.removeEventListener('resize', initDoodles);
  }, [initDoodles, animate]);
  

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

