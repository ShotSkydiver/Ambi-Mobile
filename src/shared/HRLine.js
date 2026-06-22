import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';

const HRLine = styled(View)`
  opacity: ${({ opacity }) => opacity || '0.8'};
  border-bottom-width: ${({ thickness }) => thickness || '0.5'}px;
`;

const HR = ({ color, thickness, opacity, fullWidth, styles }) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const lineColor = color || themeColors.systemBorderColor;
  return (
    <View style={{ paddingHorizontal: fullWidth ? 0 : 16 }}>
      <HRLine
        style={{ ...styles, borderBottomColor: lineColor }}
        color={lineColor}
        thickness={thickness}
        opacity={opacity}
      />
    </View>
  );
};

HR.defaultProps = {
  color: null,
  opacity: 0.8,
  fullWidth: false,
  thickness: 0.5
};

HR.propTypes = {
  opacity: PropTypes.number,
  fullWidth: PropTypes.bool,
  color: PropTypes.string,
  thickness: PropTypes.number
};

export default HR;
