import { useEffect, useRef, useState } from 'react';

/**
 * Wraps children in a div that fades+slides up when it enters the viewport.
 * @param {string}  className  – extra classes on the wrapper div
 * @param {number}  delay      – transition delay in ms (for stagger effects)
 * @param {string}  as         – HTML tag to render ('div' by default)
 */
const ScrollReveal = ({ children, className = '', delay = 0, as: Tag = 'div' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
