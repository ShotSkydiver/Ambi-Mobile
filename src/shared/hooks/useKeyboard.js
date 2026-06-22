import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

function useKeyboard() {
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const showKeyboard = () => {
    setIsKeyboardActive(true);
  };
  const hideKeyboard = () => {
    setIsKeyboardActive(false);
  };
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      'keyboardDidShow',
      showKeyboard
    );
    const keyboardHideListener = Keyboard.addListener(
      'keyboardDidHide',
      hideKeyboard
    );
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [hideKeyboard, showKeyboard]);
  return { Keyboard, isKeyboardActive };
}

export default useKeyboard;
