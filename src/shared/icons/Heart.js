import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/FontAwesome5';

const Heart = ({ filled, size, color }) => (
  <Icon name="heart" size={size} solid={filled} color={color} />
);

Heart.propTypes = {
  size: PropTypes.number,
  filled: PropTypes.bool,
  color: PropTypes.string
};

Heart.defaultProps = {
  size: 16,
  color: '#ED1E7A',
  filled: false
};

export default Heart;
