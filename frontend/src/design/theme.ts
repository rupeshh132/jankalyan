export const theme = {
  typography: {
    fonts: {
      heading: "'Plus Jakarta Sans', sans-serif",
      body: "'Inter', sans-serif",
    },
    weights: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
  },
  colors: {
    // Source of truth mapping to CSS variables
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    destructive: "hsl(var(--destructive))",
    muted: "hsl(var(--muted))",
    accent: "hsl(var(--accent))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    info: "hsl(var(--info))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    card: "hsl(var(--card))",
    border: "hsl(var(--border))",
  },
};
