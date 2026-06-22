import { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';

function useAppTheme(dependencyArray = []) {
  const appTheme = useTheme();
  const { legacy: themeColors } = appTheme;
  useEffect(() => {
    // if (IS_ANDROID) {
    //   const barStyle = appTheme.dark ? 'Light' : 'Dark';
    //   const theme = appTheme.dark ? 'dark' : 'light';
    //   ImmersiveMode.setBarColor(ThemeConstants[theme].backgroundColor, false);
    //   ImmersiveMode.setBarColor(ThemeConstants[theme].backgroundColor, true);
    //   ImmersiveMode.setStatusBarStyle(barStyle);
    // }
  }, [appTheme, ...dependencyArray]);
  return { appTheme, themeColors };
}

export default useAppTheme;
