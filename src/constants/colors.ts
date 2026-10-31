export const Palette = {
  primaryYellow: '#F5CB58',   // Main Gold/Yellow accent
  lightCream: '#F3E9B5',      // Soft Yellow/Cream input & tag fill
  brandOrange: '#E95322',     // Primary Action Orange / Discount / Buttons
  lightPeach: '#FFDECF',      // Soft Coral / Light Peach accent
  darkBrown: '#391713',       // Main Typography & Dark Accent
  background: '#F8F8F8',      // Main App Background
  white: '#FFFFFF',
  grayText: '#8D7B79',
  lightGray: '#EFEFEF',
  cardShadow: 'rgba(57, 23, 19, 0.08)',
  errorRed: '#D32F2F',
  successGreen: '#2E7D32',
};

// V3 Semantic Tokens for Dark & Light Mode
export const SemanticColors = {
  light: {
    background: '#F8F8F8',
    surface: '#FFFFFF',
    textPrimary: '#391713',
    textSecondary: 'rgba(57, 23, 19, 0.60)',
    border: '#EDE3CF',
    accent: '#E95322',
    gold: '#F5CB58',
    cream: '#F3E9B5',
  },
  dark: {
    background: '#1A0F0D',
    surface: '#2A1A17',
    textPrimary: '#FFF3E8',
    textSecondary: 'rgba(255, 243, 232, 0.65)',
    border: '#44302B',
    accent: '#FF6A3D',
    gold: '#F5CB58',
    cream: '#3D2D24',
  },
} as const;
