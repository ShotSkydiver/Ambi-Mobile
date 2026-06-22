import { createContext } from 'react';
import { Animated } from 'react-native';

const HeaderScrollContext = createContext({
  scrollAnim: null,
  offsetAnim: null
});

const buildInitialValue = () => {
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  return {
    scrollAnim,
    offsetAnim
  };
};

export default HeaderScrollContext;
export { buildInitialValue };
