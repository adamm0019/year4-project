import React, { useEffect, useRef } from 'react';
import { createStyles } from '@mantine/styles';

const useStyles = createStyles(() => ({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    '&.active': {
      opacity: 1,
    }
  }
}));

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

interface LanguageParticlesProps {
  active: boolean;
  color?: string;
}

export const LanguageParticles: React.FC<LanguageParticlesProps> = ({ active, color = '#4DABF7' }) => {
  const { classes } = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrame = useRef<number>();

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Create particles
    const createParticles = () => {
      particles.current = [];
      const particleCount = 50;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const speed = Math.random() * 2 + 1;
        particles.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha *= 0.96;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        if (particle.alpha < 0.01) {
          particles.current.splice(index, 1);
        }
      });

      if (particles.current.length > 0) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [active, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`${classes.canvas} ${active ? 'active' : ''}`}
    />
  );
};
