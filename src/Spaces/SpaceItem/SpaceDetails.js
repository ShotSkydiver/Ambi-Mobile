import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { View, StatusBar } from 'react-native';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';

import NavigationButton from '../../shared/NavigationButton';

const Container = styled(View)`
  flex: 1;
`;

const TopSpacer = styled(View)`
  margin-top: 24px;
`;

const TopSpacerRelatedSpaces = styled(View)`
  margin-top: 12px;
`;

const SpaceDetails = ({ navigation, route }) => {
  const type = route.params?.type || 'class';
  const isRelatedSpace = route.params?.isRelatedSpace;
  const isCommunity = type === 'community';
  const spaceTypeTitle = `${isRelatedSpace ? 'Related' : ''}${type.replace(
    /^\w/,
    c => c.toUpperCase()
  )}`;

  const space = useSelector(state => state.spaces.currentSpaceInView);

  const theme = useTheme();
  const showRelatedSpaces = () => {
    navigation.navigate('Related Spaces', { type, space });
  };
  const { legacy: themeColors } = theme;
  return (
    <Container style={{ backgroundColor: themeColors.body }}>
      <TopSpacer>
        <NavigationButton
          title={i18n(`About ${spaceTypeTitle}`)}
          iconName="info"
          onPress={() => {
            navigation.navigate('About', { type, space, isRelatedSpace });
          }}
          noBottomBorder
        />
      </TopSpacer>
      <NavigationButton
        title={i18n(`${isCommunity ? 'Directory' : 'Members'}`)}
        count={space.membersCount}
        iconName="users"
        onPress={() => {
          navigation.navigate('Members', {
            type,
            space,
            title: i18n(`${isCommunity ? 'Directory' : 'Members'}`)
          });
        }}
      />
      {isCommunity && (
        <TopSpacerRelatedSpaces>
          <NavigationButton
            title={i18n(`Related Spaces`)}
            count={space.relatedSpacesCount}
            iconName="spaces"
            onPress={showRelatedSpaces}
          />
        </TopSpacerRelatedSpaces>
      )}
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
        animated
      />
    </Container>
  );
};

export default SpaceDetails;
