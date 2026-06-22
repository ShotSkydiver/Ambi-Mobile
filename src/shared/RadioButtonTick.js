import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AmbiColors } from './contexts/themeContext';

const RadioButtonTick = styled(View)`
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  border: 1px solid #979797;
  border-radius: 50px;
`;

const radioButton = ({ isChecked, onPress, theme }) => {
  const radioButtonTick = (
    <RadioButtonTick
      onPress={onPress}
      style={{
        backgroundColor: isChecked ? AmbiColors.ambiBlue : theme.buttonDisabled,
        borderColor: isChecked ? AmbiColors.ambiBlue : theme.disabled
      }}
    >
      {isChecked && (
        <FeatherIcon
          name="check"
          size={18}
          color={theme.elementBGColor}
          style={{ height: 18, width: 18 }}
        />
      )}
    </RadioButtonTick>
  );
  radioButtonTick.displayName = 'RadioButtonTick';
  return radioButtonTick;
};

export default ({ isChecked, onPress, theme }) => {
  return radioButton({ isChecked, onPress, theme });
};
