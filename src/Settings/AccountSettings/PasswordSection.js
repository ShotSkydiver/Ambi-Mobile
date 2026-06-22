import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';

import SingleSection from '../SingleSection';
import { Row, RowSpaced, ItemTitle, LinkText } from '../shared';

import { AmbiColors } from '../../shared/contexts/themeContext';
import useAppTheme from '../../shared/hooks/useAppTheme';

const PasswordSection = ({ hasPassword, navigateTo }) => {
  const auth = useSelector(state => state.auth);
  const currentUser = auth.user;
  const { themeColors } = useAppTheme();

  const navigateToSetPassword = () => {
    navigateTo('SetPasswordScreen', { currentUser })();
  };

  return (
    <SingleSection themeColors={themeColors} title="Password">
      <RowSpaced>
        <Row>
          <FeatherIcon name="lock" size={18} color={AmbiColors.ambiBlue} />
          {!hasPassword ? (
            <ItemTitle
              style={{ marginLeft: 16, color: themeColors.textPrimary }}
            >
              No Password Set
            </ItemTitle>
          ) : (
            <LinkText
              style={{ marginLeft: 16, color: themeColors.textPrimary }}
            >
              Password Set
            </LinkText>
          )}
        </Row>

        {hasPassword ? (
          <TouchableOpacity
            onPress={navigateTo('SetPasswordScreen', {
              hasPasswordAlready: hasPassword
            })}
            style={{ marginRight: 8 }}
          >
            <LinkText>edit</LinkText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={navigateToSetPassword}>
            <LinkText>+Add Password</LinkText>
          </TouchableOpacity>
        )}
      </RowSpaced>
    </SingleSection>
  );
};

export default PasswordSection;
