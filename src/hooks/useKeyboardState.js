/**
 * KeyboardState
 */
/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

let showListener = null;
let hideListener = null;

const useKeyboardState = () => {
  const [status, setStatus] = useState('hidde');

  const _onShow = () => {
    setStatus('shown');
  };

  const _onHide = () => {
    setStatus('hidden');
  };

  useEffect(() => {
    showListener = Keyboard.addListener('keyboardDidShow', _onShow);
    hideListener = Keyboard.addListener('keyboardDidHide', _onHide);

    return () => {
      if (showListener) {
        showListener.remove();
      }

      if (hideListener) {
        hideListener.remove();
      }
    };
  }, []);

  return { status };
};

export default useKeyboardState;
