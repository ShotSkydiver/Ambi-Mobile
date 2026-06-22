import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { AmbiColors } from './contexts/themeContext';

const StyledCheckbox = styled(TouchableOpacity)`
  height: 24px;
  width: 24px;
  border: 1px solid #979797;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Icon = styled(FeatherIcon)`
  margin: 0 auto;
`;

export default function Checkbox({ isActive, onPress }) {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <StyledCheckbox
      onPress={onPress}
      active={isActive}
      style={{
        backgroundColor: isActive
          ? AmbiColors.ambiBlue
          : themeColors.textPrimary,
        borderColor: isActive ? AmbiColors.ambiBlue : themeColors.disabled
      }}
    >
      {isActive && (
        <Icon name="check" color={themeColors.textPrimary} size={20} />
      )}
    </StyledCheckbox>
  );
}

Checkbox.defaultProps = {
  isActive: false,
  onPress: null
};

Checkbox.propTypes = {
  isActive: PropTypes.bool,
  onPress: PropTypes.func
};
