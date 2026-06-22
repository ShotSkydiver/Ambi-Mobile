import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch } from 'react-native';

import UserService from '../Profile/UserService';
import { changeNotificationStatus } from '../Auth/redux/actions';

import {
  ListItemContainer,
  ListItemLeft,
  ListItemWrapper,
  ItemTitle
} from './shared';
import HRLine from '../shared/HRLine';

const SettingsOption = ({ item, showHRLine, themeColors }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const { id: userId, pushNotificationsEnabled } = currentUser;

  const handlePushToggle = newValue => {
    changeNotificationStatus(newValue)(dispatch);
    UserService.updateUserPushNotifsSetting(userId, newValue).catch(err => {
      console.warn(err); // Todo: add a toast instead of this. Better ux that way.
      changeNotificationStatus(!newValue)(dispatch);
    });
  };

  return (
    <ListItemContainer>
      <ListItemWrapper>
        <ListItemLeft>
          <ItemTitle style={{ color: themeColors.textPrimary }}>
            {item.title}
          </ItemTitle>
        </ListItemLeft>
        {item.action === 'switch' && (
          <Switch
            value={pushNotificationsEnabled}
            onValueChange={handlePushToggle}
          />
        )}
      </ListItemWrapper>
      {showHRLine && <HRLine style={{ marginVertical: 4 }} />}
    </ListItemContainer>
  );
};

SettingsOption.defaultProps = {
  showHRLine: true,
  navigation: null
};

SettingsOption.propTypes = {
  showHRLine: PropTypes.bool,
  item: PropTypes.shape({}).isRequired,
  navigation: PropTypes.shape({})
};

export default SettingsOption;
