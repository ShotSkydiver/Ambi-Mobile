import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';

const Wrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

function CenteredIcon({ name, size, color }) {
  return (
    <Wrapper>
      <FeatherIcon name={name} size={size} color={color} />
    </Wrapper>
  );
}

CenteredIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string
};

CenteredIcon.defaultProps = {
  size: 30,
  color: '#1d212a'
};

export { CenteredIcon as default };
