export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--text-primary)",
    colorBackground: "var(--bg-surface)",
    colorForeground: "var(--text-primary)",
    colorMutedForeground: "var(--text-secondary)",
    colorInput: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorNeutral: "var(--border-default)",
    colorBorder: "var(--border-default)",
    borderRadius: "1rem",
  },
  options: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  elements: {
    rootBox: {
      width: "100%",
    },
    card: {
      backgroundColor: "color-mix(in srgb, var(--bg-surface) 90%, #06070d 10%)",
      border: "1px solid var(--border-default)",
      boxShadow: "0 30px 90px rgba(0, 0, 0, 0.56)",
      borderRadius: "1.2rem",
      overflow: "hidden",
    },
    headerTitle: {
      color: "var(--text-primary)",
      fontSize: "2.05rem",
      fontWeight: "620",
      letterSpacing: "-0.02em",
    },
    headerSubtitle: {
      color: "var(--text-secondary)",
      fontSize: "1rem",
    },
    socialButtonsRoot: {
      gap: "0.75rem",
    },
    socialButtonsBlockButton: {
      backgroundColor: "var(--bg-elevated)",
      borderColor: "var(--border-default)",
      color: "var(--text-primary)",
      minHeight: "2.85rem",
    },
    socialButtonsBlockButtonText: {
      color: "var(--text-primary)",
      fontSize: "0.98rem",
    },
    socialButtonsIconButton: {
      backgroundColor: "var(--bg-elevated)",
      borderColor: "var(--border-default)",
      color: "var(--text-primary)",
    },
    dividerLine: {
      backgroundColor: "var(--border-default)",
    },
    dividerText: {
      color: "var(--text-muted)",
    },
    formFieldLabel: {
      color: "var(--text-primary)",
      fontWeight: "530",
      fontSize: "0.95rem",
    },
    formFieldInput: {
      backgroundColor: "var(--bg-elevated)",
      borderColor: "var(--border-default)",
      color: "var(--text-primary)",
      minHeight: "2.85rem",
    },
    formButtonPrimary: {
      background: "linear-gradient(90deg, #28d6e7 0%, #08c3d7 100%)",
      border: "0",
      color: "#031219",
      fontWeight: "640",
      minHeight: "2.9rem",
      boxShadow: "none",
    },
    footer: {
      background: "color-mix(in srgb, var(--bg-surface) 72%, var(--bg-elevated) 28%)",
      borderTop: "1px solid var(--border-default)",
      paddingBottom: "1.2rem",
    },
    footerActionText: {
      color: "var(--text-secondary)",
    },
    footerActionLink: {
      color: "var(--accent-primary)",
    },
  },
} as const;
