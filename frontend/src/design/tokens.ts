export const tokens = {
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    base: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },
  radius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
    xl: "calc(var(--radius) + 4px)",
    "2xl": "calc(var(--radius) + 8px)",
    full: "9999px",
  },
  shadows: {
    soft: "0 2px 10px rgba(0, 0, 0, 0.05)",
    card: "0 4px 20px rgba(0, 0, 0, 0.06)",
    hover: "0 8px 30px rgba(0, 0, 0, 0.08)",
    modal: "0 20px 40px rgba(0, 0, 0, 0.12)",
    dropdown: "0 10px 25px rgba(0, 0, 0, 0.1)",
  },
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    header: 50,
    dropdown: 100,
    overlay: 200,
    modal: 300,
    toast: 400,
    tooltip: 500,
  }
};
