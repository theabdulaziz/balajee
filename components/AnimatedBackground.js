'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Warehouse workflow particles
    class WorkflowParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = -100;
        this.y = Math.random() * canvas.height;
        this.size = 20 + Math.random() * 30;
        this.speed = 0.3 + Math.random() * 0.5;
        this.stage = Math.floor(Math.random() * 4); // 0: cart, 1: pallet, 2: wrap, 3: truck
        this.opacity = 0.15 + Math.random() * 0.15;
      }

      update() {
        this.x += this.speed;
        if (this.x > canvas.width + 100) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.getColor();
        ctx.fillStyle = this.getColor();
        ctx.lineWidth = 2;

        // Draw different icons based on stage
        switch (this.stage) {
          case 0: // Shopping cart
            this.drawCart();
            break;
          case 1: // Pallet jack
            this.drawPallet();
            break;
          case 2: // Wrap
            this.drawWrap();
            break;
          case 3: // Truck
            this.drawTruck();
            break;
        }

        ctx.restore();
      }

      getColor() {
        const colors = [
          'rgba(220, 38, 127, 0.8)',  // Pink-red
          'rgba(138, 43, 226, 0.8)',  // Blue-violet
          'rgba(255, 255, 255, 0.8)', // White
          'rgba(186, 85, 211, 0.8)',  // Medium orchid
        ];
        return colors[this.stage];
      }

      drawCart() {
        const x = this.x;
        const y = this.y;
        const s = this.size;

        // Cart body
        ctx.beginPath();
        ctx.rect(x, y, s * 1.2, s * 0.8);
        ctx.stroke();

        // Cart handle
        ctx.beginPath();
        ctx.moveTo(x + s * 1.2, y + s * 0.2);
        ctx.lineTo(x + s * 1.5, y);
        ctx.stroke();

        // Wheels
        ctx.beginPath();
        ctx.arc(x + s * 0.3, y + s, s * 0.15, 0, Math.PI * 2);
        ctx.arc(x + s * 0.9, y + s, s * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }

      drawPallet() {
        const x = this.x;
        const y = this.y;
        const s = this.size;

        // Pallet base
        ctx.beginPath();
        ctx.rect(x, y + s * 0.5, s * 1.5, s * 0.3);
        ctx.stroke();

        // Boxes on pallet
        ctx.beginPath();
        ctx.rect(x + s * 0.2, y, s * 0.4, s * 0.5);
        ctx.rect(x + s * 0.7, y, s * 0.4, s * 0.5);
        ctx.stroke();

        // Wheels
        ctx.beginPath();
        ctx.arc(x + s * 0.3, y + s * 0.9, s * 0.1, 0, Math.PI * 2);
        ctx.arc(x + s * 1.2, y + s * 0.9, s * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }

      drawWrap() {
        const x = this.x;
        const y = this.y;
        const s = this.size;

        // Box
        ctx.beginPath();
        ctx.rect(x, y, s, s);
        ctx.stroke();

        // Wrapping lines
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(x, y + (i * s / 3));
          ctx.lineTo(x + s, y + (i * s / 3));
          ctx.stroke();
        }
      }

      drawTruck() {
        const x = this.x;
        const y = this.y;
        const s = this.size;

        // Truck body
        ctx.beginPath();
        ctx.rect(x, y, s * 2, s);
        ctx.stroke();

        // Truck cab
        ctx.beginPath();
        ctx.rect(x + s * 2, y + s * 0.2, s * 0.8, s * 0.8);
        ctx.stroke();

        // Wheels
        ctx.beginPath();
        ctx.arc(x + s * 0.4, y + s * 1.1, s * 0.2, 0, Math.PI * 2);
        ctx.arc(x + s * 1.6, y + s * 1.1, s * 0.2, 0, Math.PI * 2);
        ctx.arc(x + s * 2.4, y + s * 1.1, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < 15; i++) {
      particles.push(new WorkflowParticle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
