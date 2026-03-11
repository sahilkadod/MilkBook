// src/theme/theme.ts

function isColorLight(hexColor: string) {
  const c = hexColor.substring(1);
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

export function getContrastColor(backgroundColor: string) {
  return isColorLight(backgroundColor) ? '#000000' : '#ffffff';
}

// ---------------- LIGHT THEME ----------------
export const lightTheme = {
  primaryColor: '#ffffff',
  backgroundColor: '#ffffff',
  cardBackground: '#ffffff',
  inputPicker: '#ffffff',

  textColor: '#000000',
  userNameColor: '#000000',
  borderlineColor: '#000000',

  summaryCardBackground: '#ffffff',
  summaryCardText: '#000000',

  secondaryColor: '#3498db',
  secondaryText: '#555555',
  errorColor: '#e74c3c',
  successColor: '#2ecc71',
};

// ---------------- DARK THEME ----------------
export const darkTheme = {
  primaryColor: '#121212',
  backgroundColor: '#1e1e1e',
  cardBackground: '#1e1e1e',
  inputPicker: '#ffffff',

  textColor: '#ffffff',
  userNameColor: '#ffffff',
  borderlineColor: '#ffffff',

  // 👇 summary card stays white for readability
  summaryCardBackground: '#ffffff',
  summaryCardText: '#000000',

  secondaryColor: '#3498db',
  secondaryText: '#cccccc',
  errorColor: '#e74c3c',
  successColor: '#2ecc71',
};