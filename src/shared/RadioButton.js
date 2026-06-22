import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { AmbiColors } from './contexts/themeContext';

const RadioButton = styled(TouchableOpacity)`
  height: 22px;
  width: 22px;
  border: 2px solid #979797;
  border-color: ${({ active }) => (active ? AmbiColors.ambiBlue : '#979797')};
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;

const CheckedCircle = styled(View)`
  height: 12px;
  width: 12px;
  background-color: ${AmbiColors.ambiBlue};
  border: 1px solid ${AmbiColors.ambiBlue};
  border-radius: 10px;
`;

const radioButton = ({ isActive, onPress, style }) => {
  const buttonComponent = (
    <RadioButton style={style} onPress={onPress} active={isActive}>
      {isActive && <CheckedCircle />}
    </RadioButton>
  );
  buttonComponent.displayName = 'RadioButton';
  return buttonComponent;
};

export default ({ isActive, onPress, style }) => {
  return radioButton({ isActive, onPress, style });
};
