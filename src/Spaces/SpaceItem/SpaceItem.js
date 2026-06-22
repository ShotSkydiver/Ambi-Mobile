/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';
import i18n from 'format-message';
import { IconHeaderButtons, Item } from '../../shared/HeaderButtons';
import SpaceAbout from './SpaceAbout';
import SpaceMembers from './SpaceMembers';
import BottomSheet from '../../shared/BottomSheet';
import RelatedSpacesList from '../RelatedSpaces/RelatedSpacesList';

const SpaceContainer = styled(View)`
  flex-shrink: 0;
  flex: 1;
`;

const SpaceItem = ({ navigation, route }) => {
  const currentSpaceInView = useSelector(
    state => state.spaces.currentSpaceInView
  );
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [typeSort, setTypeSort] = useState({
    sortBy: 'first-name',
    order: 'asc'
  });

  const toggleActionSheet = () => {
    setShowFilterSheet(!showFilterSheet);
  };

  const handleOptionClick = sort => {
    setTypeSort(sort);
    toggleActionSheet();
  };

  const sortTypeOptionsforUserNames = [
    {
      title: i18n('last name, a-z'),
      onPress: () => handleOptionClick({ sortBy: 'last-name', order: 'asc' }),
      iconMaterial: 'sort-alphabetical-ascending'
    },
    {
      title: i18n('last name, z-a'),
      onPress: () => handleOptionClick({ sortBy: 'last-name', order: 'desc' }),
      iconMaterial: 'sort-alphabetical-descending'
    },
    {
      title: i18n('first name, a-z'),
      onPress: () => handleOptionClick({ sortBy: 'first-name', order: 'asc' }),
      iconMaterial: 'sort-alphabetical-ascending'
    },
    {
      title: i18n('first name, z-a'),
      onPress: () => handleOptionClick({ sortBy: 'first-name', order: 'desc' }),
      iconMaterial: 'sort-alphabetical-descending'
    }
  ];

  const sortTypeOptionsForListNames = [
    {
      title: i18n('Alphabetically, a-z'),
      onPress: () => handleOptionClick({ order: 'asc' }),
      iconMaterial: 'sort-alphabetical-ascending'
    },
    {
      title: i18n('Alphabetically, z-a'),
      onPress: () => handleOptionClick({ order: 'desc' }),
      iconMaterial: 'sort-alphabetical-descending'
    }
  ];

  const type = route.params?.type || 'class';
  const isCommunity = type === 'community';

  useEffect(() => {
    navigation.setParams({
      toggleActionSheet
    });
  }, []);

  const getBottomSheet = sortOption => {
    return (
      <BottomSheet
        visible={showFilterSheet}
        title={i18n('Sort By')}
        options={sortOption}
        toggle={toggleActionSheet}
      />
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <IconHeaderButtons>
            {isCommunity && route.name === 'Members' && (
              <Item
                title="Sort"
                iconName="sort-alphabetical-variant"
                color={themeColors.textPrimary}
                onPress={toggleActionSheet}
                useMaterialCommunityIcons
                manualInset
              />
            )}
          </IconHeaderButtons>
        );
      }
    });
  }, []);

  return (
    <SpaceContainer
      style={{
        backgroundColor: themeColors.body,
        paddingTop: route.name === 'About' ? 24 : 0
      }}
    >
      {route.name === 'About' && (
        <SpaceAbout
          spaceInfo={currentSpaceInView}
          navigation={navigation}
          route={route}
        />
      )}
      {route.name === 'Members' && (
        <>
          <SpaceMembers
            currentSpaceInView={currentSpaceInView}
            navigation={navigation}
            typeSort={typeSort}
            route={route}
          />
          {getBottomSheet(sortTypeOptionsforUserNames)}
        </>
      )}
      {route.name === 'Related Spaces' && (
        <>
          <RelatedSpacesList
            currentSpaceInView={currentSpaceInView}
            navigation={navigation}
            typeSort={typeSort}
          />
          {getBottomSheet(sortTypeOptionsForListNames)}
        </>
      )}
    </SpaceContainer>
  );
};

export default SpaceItem;
