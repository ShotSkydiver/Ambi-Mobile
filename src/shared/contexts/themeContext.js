import { createContext } from 'react';
import { StyleSheet } from 'react-native';

const ThemeContext = createContext(null);

const ThemeConstants = {
  light: {
    body: '#f7f7fa',
    bodyTransparent: '#f7f7fa66',
    backgroundColor: '#f8f8fb',
    bgColorSemiTransparent: '#f8f8fb66',
    onboardingBGColor: '#F0F9FC',
    elementBGColor: '#ffffff',
    textPrimary: '#000',
    chatText: '#ffffff',
    textPrimaryInactive: 'rgba(0,0,0,0.60)',
    textDisabled: '#9da4b0',
    buttonDisabled: '#C7CBD2',
    textInputBG: 'rgba(0,0,0,0.87)',
    systemBorderColor: 'rgba(60,60,67,0.29)',
    unreadNotificationBG: 'rgba(2,158,226,0.03)', // rgb(2, 158, 226)
    homeHeader: '#029ee2',
    slateGray: '#707689',
    darkGreenColor: '#1d2129',
    searchBG: 'rgba(142,142,147,0.12)',
    chatMessageBG: '#ececec',
    charcoal: '#2f3746',
    disabled: '#ced1d9',
    imageBGColor: '#e6eaf2',
    error: '#BA0101',
    shadowBorder: 'rgba(0, 0, 0, 0.05)',
    sortColor: '#898E9D',
    commentBGColor: '#e6eaf2'
  },
  dark: {
    body: '#000',
    bodyTransparent: '#00000066',
    backgroundColor: '#121212',
    bgColorSemiTransparent: '#12121266',
    onboardingBGColor: '#121212',
    elementBGColor: '#1a1a1a', // #2a2a2a
    textPrimary: '#fff',
    chatText: '#000000',
    textPrimaryInactive: 'rgba(255,255,255,0.60)',
    textDisabled: '#9da4b0',
    buttonDisabled: '#C7CBD2',
    textInputBG: 'rgba(255,255,255,0.12)',
    systemBorderColor: 'rgba(84,84,88,0.65)',
    unreadNotificationBG: 'rgba(2,158,226,0.09)',
    homeHeader: '#121212',
    slateGray: '#e5e6ea',
    darkGreenColor: '#f7f7fa',
    searchBG: '#2a2a2a',
    chatMessageBG: '#1d2129',
    charcoal: '#e5e6ea',
    disabled: '#ebecef',
    imageBGColor: '#121212',
    error: '#cf6679',
    shadowBorder: 'rgba(255, 255, 255, 0.05);',
    commentBGColor: '#121212'
  },
  'no-preference': {}
};

ThemeConstants['no-preference'] = ThemeConstants.light;

const AmbiColors = {
  ambiBlue: '#029ee2',
  ambiLightBlue: '#00a5f1',
  ambiDarkPurple: '#707689',
  ambiGray: '#e6eaf2',
  ambiWhite: '#ffffff',
  razzmatazz: '#ED1E7A',
  positive: '#22a671',
  focusMode: '#8b51f6',
  warning: '#e9a820',
  destructive: '#9B344D',
  transparent: '#fafafa00'
};

const ShadowStyles = StyleSheet.create({
  buttonsAndText: {
    elevation: 3,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 1.98,
    shadowRadius: 0.62
  }
});

const AmbiLightTheme = {
  dark: false,
  colors: {
    primary: AmbiColors.ambiBlue,
    background: ThemeConstants.light.body,
    card: ThemeConstants.light.backgroundColor,
    text: ThemeConstants.light.textPrimary,
    border: ThemeConstants.light.systemBorderColor,
    notification: AmbiColors.razzmatazz
  },
  legacy: ThemeConstants.light
};

const AmbiDarkTheme = {
  dark: true,
  colors: {
    primary: AmbiColors.ambiBlue,
    background: ThemeConstants.dark.body,
    card: ThemeConstants.dark.backgroundColor,
    text: ThemeConstants.dark.textPrimary,
    border: ThemeConstants.dark.systemBorderColor,
    notification: AmbiColors.razzmatazz
  },
  legacy: ThemeConstants.dark
};

export default ThemeContext;
export {
  ThemeConstants,
  AmbiColors,
  AmbiLightTheme,
  AmbiDarkTheme,
  ShadowStyles
};
