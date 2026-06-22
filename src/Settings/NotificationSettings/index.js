import React from 'react';
import { useSelector } from 'react-redux';

import useAppTheme from '../../shared/hooks/useAppTheme';
import SettingsOption from '../SettingsOption';
import SettingsSection from '../SingleSection';
import { SettingsContainer } from '../shared';

const NotificationSettings = ({ navigation, isFocused }) => {
  const currentUser = useSelector(state => state.auth.user);
  const { themeColors } = useAppTheme([isFocused]);

  const settings = [
    {
      title: 'Enable push notifications',
      action: 'switch',
      initialValue: currentUser.pushNotificationsEnabled
    }
  ];

  return (
    <SettingsContainer style={{ backgroundColor: themeColors.body }}>
      <SettingsSection themeColors={themeColors} title="Push Notifications">
        {settings.map(item => (
          <SettingsOption
            item={item}
            key={item.title}
            navigation={navigation}
            themeColors={themeColors}
          />
        ))}
      </SettingsSection>
    </SettingsContainer>
  );
};

export default NotificationSettings;
