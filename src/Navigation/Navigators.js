import { Animated } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

export const NativeStack = createNativeStackNavigator();
export const Stack = createStackNavigator();

// Credit: react-navigation createStackNavigator docs
export const SlideTransition = ({
  current,
  next,
  inverted,
  layouts: { screen }
}) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        })
      : 0
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3 // Fully unfocused
              ],
              extrapolate: 'clamp'
            }),
            inverted
          )
        }
      ]
    }
  };
};
