import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  base: number;
}

export function StarField(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars: Star[] = [];
    let raf = 0;
    let pointerX = 0;
    let pointerY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let resizeTimer = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const build = () => {
      const density = isMobile ? 26000 : 14000;
      const limit = isMobile ? 40 : 140;
      const count = Math.max(18, Math.min(limit, Math.floor((width * height) / density)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * (isMobile ? 0.6 : 1),
        speed: (0.01 + Math.random() * 0.05) * (isMobile ? 0.6 : 1),
        phase: Math.random() * Math.PI * 2,
        base: 0.22 + Math.random() * 0.45,
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = isMobile ? 0 : Math.sin(time * 0.001 + star.phase) * 0.22;
        const alpha = Math.min(1, Math.max(0.06, star.base + twinkle));
        const depth = star.r / 1.4;
        ctx.fillStyle = `rgba(214, 224, 255, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(star.x + offsetX * depth, star.y + offsetY * depth, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const tick = (time: number) => {
      for (const star of stars) {
        star.y -= star.speed;
        star.x += star.speed * 0.12;
        if (star.y < -2) {
          star.y = height + 2;
          star.x = Math.random() * width;
        }
        if (star.x > width + 2) star.x = -2;
      }
      offsetX += (pointerX - offsetX) * 0.04;
      offsetY += (pointerY - offsetY) * 0.04;
      draw(time);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      stop();
      if (reduced) {
        draw(0);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        build();
        start();
      }, 200);
    };

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) stop();
      else start();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / width - 0.5) * 16;
      pointerY = (event.clientY / height - 0.5) * 16;
    };

    resize();
    build();
    start();

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    if (!isMobile && !reduced) window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [isMobile, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
