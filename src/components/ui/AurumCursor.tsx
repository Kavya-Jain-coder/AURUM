'use client';

import { useEffect, useRef, useState } from 'react';
import { useUiStore } from '@/store/uiStore';

/**
 * Custom AURUM cursor
 * Outer ring: 36px gold border, follows mouse with 80ms lag (lerp 0.12)
 * Inner dot: 6px solid gold, follows mouse exactly
 * Hidden on touch devices
 */
export function AurumCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cursorVariant = useUiStore((s) => s.cursorVariant);
  const isMobile = useUiStore((s) => s.isMobile);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse position with lerp
  const mousePos = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation loop for outer ring lag
    let animId: number;
    const animate = () => {
      // Outer ring follows with lag (lerp factor 0.12)
      outerPos.current.x += (mousePos.current.x - outerPos.current.x) * 0.12;
      outerPos.current.y += (mousePos.current.y - outerPos.current.y) * 0.12;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPos.current.x}px, ${outerPos.current.y}px) translate(-50%, -50%)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    // Hover detection for cursor variants
    const handleHoverStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        useUiStore.getState().setCursorVariant('link');
      }
    };

    const handleHoverEnd = () => {
      useUiStore.getState().setCursorVariant('default');
    };

    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
      cancelAnimationFrame(animId);
    };
  }, [isMobile, isVisible]);

  if (isMobile) return null;

  // Cursor variant styles
  const isHover = cursorVariant !== 'default';
  const size = isHover ? 60 : 12;

  return (
    <>
      {/* Outer difference circle */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'white',
          mixBlendMode: 'difference',
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // The translation needs to offset by half the current size, but since size is dynamic, 
          // we handle the centering using a nested div or CSS transform origin.
          // Wait, outerPos is calculated assuming size 36 (offset 18). 
          // We must update the animation loop to use dynamic offset, OR we just set top/left and use transform: translate(-50%, -50%).
        }}
      >
        {cursorVariant === 'model' && (
          <span className="text-black text-[8px] font-accent tracking-label uppercase opacity-50 mix-blend-difference">
            ROTATE
          </span>
        )}
      </div>

      {/* Inner precise dot (only visible when hovering to keep precision) */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'white',
          mixBlendMode: 'difference',
          zIndex: 9999,
          opacity: isVisible && isHover ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </>
  );
}
