import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

function StyledText(props) {
  const { style, children } = props;
  const textStyle = [{ fontFamily: 'Circular' }, style];
  return (
    <Text
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      adjustsFontSizeToFit
      numberOfLines={1}
      minimumFontScale={1}
      style={textStyle}
    >
      {children}
    </Text>
  );
}

StyledText.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node
};

StyledText.defaultProps = {
  style: null,
  children: null
};

export { StyledText as default };
