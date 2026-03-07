// src/theme/theme.ts

// Helper function to determine if color is "light" or "dark"
function isColorLight(hexColor: string) {
  // Convert #RRGGBB to decimal
  const c = hexColor.substring(1); // remove #
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);

  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155; // threshold
}

// Function to get proper text color based on background
export function getContrastColor(backgroundColor: string) {
  return isColorLight(backgroundColor) ? '#000000' : '#ffffff';
}

// ---------------- LIGHT & DARK THEMES ----------------
export const lightTheme = {
  primaryColor: '#ffffff',
  backgroundColor: '#ffffff',
  cardBackground: '#ffffff',

  textColor: '#000000',
  userNameColor: '#000000', // dynamic contrast applied later
  borderlineColor: '#000000',

  secondaryColor: '#3498db',
  secondaryText: '#555555',
  errorColor: '#e74c3c',
  successColor: '#2ecc71',
};

export const darkTheme = {
  primaryColor: '#121212',
  backgroundColor: '#1e1e1e',
  cardBackground: '#1e1e1e',

  textColor: '#ffffff',
  userNameColor: '#ffffff',
  borderlineColor: '#ffffff',

  secondaryColor: '#3498db',
  secondaryText: '#cccccc',
  errorColor: '#e74c3c',
  successColor: '#2ecc71',
};