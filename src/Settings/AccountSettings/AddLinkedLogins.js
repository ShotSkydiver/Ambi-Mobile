import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAppTheme from '../../shared/hooks/useAppTheme';

import {
  SettingsContainer as Container,
  SettingsItem as LinkItem,
  HeaderTitle,
  connectionInfoMapping
} from '../shared';
import { authConnectionsAllowed, Spacer } from '../../Auth/shared';
import RadioButton from '../../shared/RadioButton';
import { FullScreenLoader } from '../../shared/Loader';

function AddLinkedLoginsScreen({ navigation }) {
  const auth = useSelector(state => state.auth);
  const { linkingAccount } = auth;
  const [selectedConnection, setSelectedConnection] = useState(null);
  const { themeColors } = useAppTheme();

  const loginWithConnectionAndLinkUser = () => async () => {
    // await login(
    //   navigation,
    //   auth.auth0,
    //   auth.audience,
    //   connectionName,
    //   true
    // )(dispatch);
    navigation.navigate('AccountSettings');
  };

  useEffect(() => {
    navigation.setParams({
      selectedConnection,
      handleAddConnection: loginWithConnectionAndLinkUser(selectedConnection)
    });
  }, [selectedConnection]);

  const handleSelectConnection = connectionName => async () => {
    setSelectedConnection(connectionName);
  };

  return (
    <Container style={{ backgroundColor: themeColors.body }}>
      <Spacer height="12px" />
      <HeaderTitle margin="0 16px" style={{ color: themeColors.textPrimary }}>
        Select linked login provider
      </HeaderTitle>
      <Spacer height="16px" />
      {authConnectionsAllowed.map(connection => {
        const { icon: LinkIcon, name } = connectionInfoMapping[connection];
        return (
          <LinkItem
            key={connection}
            onPress={handleSelectConnection(connection)}
            style={{
              borderColor: themeColors.shadowBorder
            }}
          >
            <LinkIcon width={24} height={24} fill={themeColors.textPrimary} />
            <HeaderTitle
              style={{
                textAlign: 'center',
                height: 24,
                color: themeColors.textPrimary
              }}
              margin="0 0 0 16px"
            >
              {name}
            </HeaderTitle>
            <RadioButton
              style={{ marginLeft: 'auto' }}
              onPress={handleSelectConnection(connection)}
              isActive={selectedConnection === connection}
            />
          </LinkItem>
        );
      })}
      {linkingAccount && <FullScreenLoader />}
    </Container>
  );
}

AddLinkedLoginsScreen.displayName = 'Add Linked Logins Settings Screen';
export default AddLinkedLoginsScreen;
