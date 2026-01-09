// Convert hex color to HSL values for CSS custom properties
export function hexToHsl(hex: string): string {
  hex = hex.replace(/^#/, '');
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Apply theme colors immediately to CSS custom properties
export function applyThemeToDOM(primary: string, secondary: string) {
  const root = document.documentElement;
  
  const primaryHsl = hexToHsl(primary);
  root.style.setProperty('--primary', primaryHsl);
  root.style.setProperty('--ring', primaryHsl);
  
  // Create a lighter glow variant
  const hex = primary.replace(/^#/, '');
  const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + 30);
  const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + 30);
  const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + 30);
  const glowHex = `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  root.style.setProperty('--primary-glow', hexToHsl(glowHex));
  
  const secondaryHsl = hexToHsl(secondary);
  root.style.setProperty('--secondary', secondaryHsl);
  
  console.log('✅ Theme applied to DOM:', { primary, secondary });
}
