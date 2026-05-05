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
    socialButtonsRoot: {
      gap: "0.75rem",
    },
    socialButtonsBlockButton: {
      backgroundColor: "var(--bg-elevated)",
      borderColor: "var(--border-default)",
      color: "var(--text-primary)",
    },
    socialButtonsBlockButtonText: {
      color: "var(--text-primary)",
    },
    socialButtonsIconButton: {
      backgroundColor: "var(--bg-elevated)",
      borderColor: "var(--border-default)",
      color: "var(--text-primary)",
    },
    dividerText: {
      color: "var(--text-muted)",
    },
  },
} as const;
