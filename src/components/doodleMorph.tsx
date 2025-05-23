// CONCEPT: 
/* Slowly morphing runes that can be provided per page and per theme */
/* For light theme, the runes will look hand drawn and like living runes, either like doodles or abhorsen-like protection runes */
/* Dark theme is more computer glyphs with a slightly higher contrast, like a subtle glow. Definitely not behind the words though. Kinda Tron, kinda Atlantis */

//TODO: get canvas to stretch full height even past fold

// TODO: Get graph paper and plot out all kinds of fun shapes that have equivalent points :)

// TODO: Figure out color interpolation. Most likely increment values towards each other at some constant rate. How to keep from mud? Incrementing all based on their distance 
// From the target color seems like it could work. First try a flat rate and see. 
// Next, proportional motion,
// Last, see if you can figure out the dominant color and move that value the fastest?

import React, { useEffect, useRef, useCallback } from 'react';

type Point = { x: number; y: number };


  type DoodleInstance = {
    x: number;
    y: number;
    size: number;
    currentPoints: Point[];
    targetPoints: Point[];
    progress: number;
  };
  
  type Config = {
    speed?: number;
    opacity?: number;
    sizeMultiplier?: number;
    minNum?: number;
    maxNum?: number;
  };
  
  
  const defaultConfig: Required<Config> = {
    speed: 0.002,
    opacity: 0.6,
    sizeMultiplier: 0.01,
    minNum: 40,
    maxNum: 150,
  };

export type DoodleFunction = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void;

type Props = {
  doodles: {x:number, y:number}[];
  theme?: 'light' | 'dark'; // Switch up with theme later
  config?: Config;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;


const whatShape = [
    { x: 0, y: -20 },
    { x: 5, y: -50 },
    { x: 200, y: 0 },
    { x: 50, y: 50 },
    { x: 0, y: 10 },
    { x: -45, y: 15 },
    { x: -20, y: 0 },
    { x: -5, y: -5 },
    { x: 0, y: -20 },
    { x: 5, y: -5 },
    { x: 10, y: 4 },
    { x: 5, y: 5 },
    { x: 0, y: 20 },
    { x: -5, y: 5 },
    { x: -20, y: 0 },
    { x: -5, y: -5 },
  ];

const choose = (arr) => {
    const randomIndex = Math.max(0, Math.round(Math.random() * arr.length -1));
    console.log("INDEX")
    console.log(randomIndex)
 
     return arr[randomIndex];ß
 };
 


export const DoodleMorphs: React.FC<Props> = ({ doodles, theme = 'light', config = {} }) => {

  const settings = { ...defaultConfig, ...config };
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const doodlesRef = useRef<DoodleInstance[]>([]);

  
    const initDoodles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const count = Math.max(settings.minNum, Math.min(settings.maxNum, Math.floor(canvas.width * canvas.height * 0.0001)));
      
    doodlesRef.current = Array.from({ length: count }).map(() => {
        // todo exclude text area
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
        currentPoints: choose(doodles),
        targetPoints: choose(doodles)
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
        d.progress += settings.speed; // 🌿 very slow morphing
    
        if (d.progress >= 1) {
          d.progress = 0;
          d.currentPoints = d.targetPoints;
          d.targetPoints = choose(doodles)
         // d.targetPoints = Math.random() > 0.5 ? starShape : flowerShape; //TODO: figure out why the choose doesn't work
        }
    
        // Interpolate points
        const points = d.currentPoints.map((p, i) => ({
          x: lerp(p.x, d.targetPoints[i].x, d.progress),
          y: lerp(p.y, d.targetPoints[i].y, d.progress),
        }));
    
        // Draw shape
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.beginPath();
        ctx.moveTo(points[0].x * d.size * settings.sizeMultiplier, points[0].y * d.size * settings.sizeMultiplier);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x * d.size * settings.sizeMultiplier, points[i].y * d.size * settings.sizeMultiplier);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.stroke();
        ctx.restore();
      });
    
      requestAnimationFrame(animate);
    }, []);
    
  
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
        right: 0,
        bottom: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: settings.opacity
      }}
      aria-hidden="true"
    />
  );
};

