export const motion = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    medium: 0.35,
    large: 0.5,
  },
  easing: {
    easeOut: [0.16, 1, 0.3, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: { type: "spring", stiffness: 300, damping: 30 },
  },
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    fadeUp: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    modalAnimation: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  },
};
