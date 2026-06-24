import React, { useEffect, useRef } from 'react';
import { useGame } from '@/lib/GameContext';

export default function ParticleBackground() {
  const { theme } = useGame();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = theme.id === 'matrix' ? 60 : 30;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: theme.id === 'matrix' ? Math.random() * 1.5 + 0.5 : (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      char: theme.id === 'matrix' ? String.fromCharCode(0x30A0 + Math.random() * 96) : null,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        if (p.char) {
          ctx.font = `${10 + p.size * 4}px monospace`;
          ctx.fillStyle = `${theme.particle}${Math.round(p.opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fillText(p.char, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${theme.particle}${Math.round(p.opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        }
      });
      
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}