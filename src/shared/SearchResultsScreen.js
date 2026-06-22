import React from 'react';
import { View, Text, SectionList } from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18n from 'format-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

import SpacesService from '../Spaces/SpacesService';
import UserRow from './UserRow';
import SpacesListItem from '../Spaces/SpacesListItem';
import HRLine from './HRLine';
import User from '../PropTypes/User';

const resultsType = {
  ALL: 'all',
  USERS: 'users',
  SPACES: 'spaces'
};

const ListWrapper = styled(View)`
  flex: 1;
  padding: 16px;
`;

const HeaderTitleContainer = styled(View)`
  align-self: stretch;
  padding-vertical: 8px;
`;

const HeaderTitle = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const EmptyResultText = styled(Text)`
  font-family: circular;
  font-size: 16px;
  line-height: 20px;
  margin-top: 16;
`;

const SearchResultsScreen = ({
  users,
  groups,
  classes,
  communities,
  navigation,
  spaces
}) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const getSpaceByIdAndNavigate = async (spaceId, type) => {
    try {
      let spaceItem =
        spaces.groups[spaceId] ||
        spaces.classes[spaceId] ||
        spaces.communities[spaceId];
      if (!spaceItem) {
        spaceItem = await SpacesService.getSpaceItemById(spaceId, type);
        spaceItem.type = type;
      }
      navigation.navigate('Space', { spaceItem });
    } catch (err) {
      console.error(err);
    }
  };

  const renderItem = (item, type) => {
    if (type === resultsType.USERS) {
      return (
        <UserRow
          theme={themeColors}
          usePadding
          user={item.result}
          navigation={navigation}
        />
      );
    }
    return (
      <SpacesListItem
        data={item.result || item}
        navigate={() =>
          getSpaceByIdAndNavigate(
            item.result ? item.result.id : item.id,
            item.type
          )
        }
      />
    );
  };

  const renderEmptyComponent = () => {
    return (
      <>
        <HeaderTitleContainer
          style={{ backgroundColor: themeColors.elementBGColor }}
        >
          <HeaderTitle style={{ color: themeColors.slateGray }}>
            {i18n('No results')}
          </HeaderTitle>
        </HeaderTitleContainer>
        <HRLine fullWidth />
        <EmptyResultText style={{ color: themeColors.darkGreenColor }}>
          {i18n('Nothing was found for your search...')}
        </EmptyResultText>
      </>
    );
  };

  const renderHeader = title => (
    <HeaderTitleContainer
      style={{ backgroundColor: themeColors.elementBGColor }}
    >
      <HeaderTitle style={{ color: themeColors.slateGray }}>
        {i18n(title)}
      </HeaderTitle>
    </HeaderTitleContainer>
  );

  const getSearchSections = () => {
    return [
      { title: i18n('Users'), data: users, type: resultsType.USERS },
      {
        title: i18n('Spaces'),
        data: [...classes, ...groups, ...communities],
        type: resultsType.SPACES
      }
    ].filter(item => item.data && item.data.length);
  };

  const sectionSectionResults = getSearchSections();
  const insets = useSafeAreaInsets();

  return (
    <ListWrapper
      style={{
        paddingTop: insets.top + 52,
        backgroundColor: themeColors.elementBGColor
      }}
    >
      <SectionList
        sections={sectionSectionResults}
        renderItem={({ item, section }) => renderItem(item, section.type)}
        renderSectionHeader={({ section }) => renderHeader(section.title)}
        ListEmptyComponent={renderEmptyComponent}
        ItemSeparatorComponent={() => <HRLine fullWidth />}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
      />
    </ListWrapper>
  );
};

SearchResultsScreen.defaultProps = {
  users: {},
  groups: [],
  classes: [],
  communities: []
};

SearchResultsScreen.propTypes = {
  users: PropTypes.arrayOf(User),
  groups: PropTypes.arrayOf(PropTypes.shape({})),
  classes: PropTypes.arrayOf(PropTypes.shape({})),
  communities: PropTypes.arrayOf(PropTypes.shape({}))
};

const mapStateToProps = state => ({
  spaces: state.spaces
});

export default connect(mapStateToProps, null)(SearchResultsScreen);
