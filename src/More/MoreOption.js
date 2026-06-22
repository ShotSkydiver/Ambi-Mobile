import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import HRLine from '../shared/HRLine';

const ListItemContainer = styled(View)`
  height: 56px;
`;

const ListItemWrapper = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  padding: 0 4%;
  align-items: center;
`;

const ListItemLeft = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const ItemTitle = styled(Text)`
  font-family: Circular-Bold;
  font-size: 17px;
  line-height: 24px;
  margin-left: 10px;
`;

const MoreOption = ({ item, user, showHRLine, navigation, logout }) => {
  const isLogout = item.key === 'Logout';
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <ListItemContainer>
      <ListItemWrapper
        onPress={() =>
          isLogout ? logout() : navigation.navigate(item.key, { user })
        }
      >
        <ListItemLeft>
          {item.icon}
          <ItemTitle
            style={{ color: isLogout ? '#EC4A4A' : themeColors.textPrimary }}
          >
            {item.key}
          </ItemTitle>
        </ListItemLeft>
        <FeatherIcon
          name="chevron-right"
          size={18}
          style={{ color: themeColors.textPrimary }}
        />
      </ListItemWrapper>
      {showHRLine && <HRLine />}
    </ListItemContainer>
  );
};

MoreOption.defaultProps = {
  showHRLine: true
};

MoreOption.propTypes = {
  showHRLine: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  item: PropTypes.object.isRequired
};

export default MoreOption;
