import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import useAppTheme from '../../shared/hooks/useAppTheme';
import SingleSection from '../SingleSection';
import {
  LinkText,
  ItemTitle,
  Row,
  RowSpaced,
  connectionInfoMapping
} from '../shared';

const LinkedLoginSection = ({
  navigateTo,
  linkedLogins,
  removeLinkedLogin
}) => {
  const { themeColors } = useAppTheme();
  const handleRemoveLinkedLogin = link => () => {
    const methodTitle = link.profileData
      ? link.profileData.email
      : link.connection;
    return Alert.alert(
      'Remove Linked Login?',
      `Remove this linked login method (${methodTitle})?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.warn('Cancel pressed'),
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: removeLinkedLogin(link),
          style: 'destructive'
        }
      ],
      {
        cancelable: true
      }
    );
  };
  return (
    <SingleSection themeColors={themeColors} title="Linked Login Methods">
      {linkedLogins.map(link => {
        const { connection, profileData, user_id: userId } = link;
        const { icon: LinkIcon, name } = connectionInfoMapping[connection];
        const email = profileData ? profileData.email : name;
        return (
          <RowSpaced key={userId} style={{ marginBottom: 8 }}>
            <Row>
              <LinkIcon width={24} height={24} fill={themeColors.textPrimary} />
              <ItemTitle style={{ marginLeft: 16 }} themeColors={themeColors}>
                {email || name}
              </ItemTitle>
            </Row>
            <TouchableOpacity onPress={handleRemoveLinkedLogin(link)}>
              <LinkText>remove</LinkText>
            </TouchableOpacity>
          </RowSpaced>
        );
      })}
      <TouchableOpacity
        style={{ marginTop: 8 }}
        onPress={navigateTo('AddLinkedLogins')}
      >
        <LinkText>+Add Linked Login Method</LinkText>
      </TouchableOpacity>
    </SingleSection>
  );
};

export default LinkedLoginSection;
