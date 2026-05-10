import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Confetti = ({ colors, type = 'default' }) => {
  useEffect(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    
    const frame = () => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return;

      if (type === 'savage') {
        // Flame-like particles
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#ff4500', '#ff8c00']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#ff4500', '#ff8c00']
        });
      } else if (type === 'emotional') {
        // Floating hearts/petals effect (slow and gentle)
        confetti({
          particleCount: 1,
          startVelocity: 0,
          ticks: 200,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          },
          colors: colors || ['#ff69b4', '#ffb6c1', '#ffffff'],
          shapes: ['circle'],
          gravity: 0.3,
          scalar: Math.random() * 1 + 0.5,
          drift: Math.random() * 2 - 1
        });
      } else {
        // Classic burst
        const particleCount = 2;
        confetti({
          particleCount,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: colors || ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
          spread: 80,
          gravity: 1.2
        });
      }

      requestAnimationFrame(frame);
    };

    frame();
  }, [colors, type]);

  return null;
};

export default Confetti;
