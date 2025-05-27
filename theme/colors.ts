import { Platform } from 'react-native';

const IOS_SYSTEM_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: 'rgb(245, 242, 234)', // Cream White background
    grey5: 'rgb(245, 242, 234)',
    grey4: 'rgb(140, 131, 117)', // Warm Gray
    grey3: 'rgb(140, 131, 117)',
    grey2: 'rgb(140, 131, 117)',
    grey: 'rgb(140, 131, 117)',
    background: 'rgb(245, 242, 234)',
    foreground: 'rgb(30, 30, 30)', // Charcoal
    root: 'rgb(245, 242, 234)',
    card: 'rgb(245, 242, 234)',
    destructive: 'rgb(255, 56, 43)',
    primary: 'rgb(203, 161, 53)', // Antique Gold
  },
  dark: {
    grey6: 'rgb(30, 30, 30)',
    grey5: 'rgb(30, 30, 30)',
    grey4: 'rgb(140, 131, 117)',
    grey3: 'rgb(140, 131, 117)',
    grey2: 'rgb(140, 131, 117)',
    grey: 'rgb(140, 131, 117)',
    background: 'rgb(30, 30, 30)',
    foreground: 'rgb(245, 242, 234)',
    root: 'rgb(30, 30, 30)',
    card: 'rgb(30, 30, 30)',
    destructive: 'rgb(254, 67, 54)',
    primary: 'rgb(203, 161, 53)', // Antique Gold
  },
};


const ANDROID_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: 'rgb(245, 242, 234)',
    grey5: 'rgb(215, 217, 228)',
    grey4: 'rgb(140, 131, 117)',
    grey3: 'rgb(113, 119, 134)',
    grey2: 'rgb(65, 71, 84)',
    grey: 'rgb(24, 28, 35)',
    background: 'rgb(245, 242, 234)',
    foreground: 'rgb(30, 30, 30)',
    root: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    destructive: 'rgb(186, 26, 26)',
    primary: 'rgb(203, 161, 53)',
  },
  dark: {
    grey6: 'rgb(16, 19, 27)',
    grey5: 'rgb(39, 42, 50)',
    grey4: 'rgb(49, 53, 61)',
    grey3: 'rgb(54, 57, 66)',
    grey2: 'rgb(139, 144, 160)',
    grey: 'rgb(193, 198, 215)',
    background: 'rgb(30, 30, 30)',
    foreground: 'rgb(245, 242, 234)',
    root: 'rgb(0, 0, 0)',
    card: 'rgb(0, 0, 0)',
    destructive: 'rgb(147, 0, 10)',
    primary: 'rgb(203, 161, 53)', 
  },
} as const;

const COLORS = Platform.OS === 'ios' ? IOS_SYSTEM_COLORS : ANDROID_COLORS;

export { COLORS };