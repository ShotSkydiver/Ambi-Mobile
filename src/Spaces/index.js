import React, { useEffect, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  SectionList,
  KeyboardAvoidingView,
  Text,
  StatusBar
} from 'react-native';
import styled from 'styled-components';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';

import { updateSpaces, actionGetAnySpace } from './redux/actions';
import {
  getAllClasses,
  getAllGroups,
  getAllCommunities
} from './redux/selectors';
import SearchBar from '../shared/SearchBar';
import SpacesListItem from './SpacesListItem';
import HRLine from '../shared/HRLine';
import EmptyState from '../shared/EmptyState';
import { DEVICE_HEIGHT, IS_ANDROID } from '../shared/constants';

const Container = styled(View)`
  flex: 1;
`;
const SpacesSectionsContainer = styled(View)`
  flex: 1;
  margin-top: ${({ marginTop }) => marginTop};
`;

const SpaceList = styled(SectionList)`
  flex: 1;
  padding: 0 16px;
`;

const SpacesSectionHeader = styled(View)`
  flex: 1;
  flex-shrink: 0;
  flex-direction: row;
  justify-content: space-between;
  margin: 16px 0 8px 0;
`;

const HeaderTitle = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const HeaderLink = styled(HeaderTitle)`
  font-family: Circular-Book;
`;

const Spaces = memo(({ navigation, route }) => {
  const dispatch = useDispatch();
  const classes = useSelector(getAllClasses);
  const groups = useSelector(getAllGroups);
  const communities = useSelector(getAllCommunities);
  const [classesToShow, setClasses] = useState(classes);
  const [groupsToShow, setGroups] = useState(groups);
  const [communitiesToShow, setCommunities] = useState(communities);
  const [searchString, setSearchString] = useState('');
  const [page, setPage] = useState({
    Communities: 1,
    Classes: 1,
    Groups: 1
  });

  const actionsNextPage = {
    Communities: nextPage => actionGetAnySpace('communities', nextPage)(dispatch), // prettier-ignore
    Classes: nextPage => actionGetAnySpace('classes', nextPage)(dispatch),
    Groups: nextPage => actionGetAnySpace('groups', nextPage)(dispatch)
  };

  const isSpacesMain = route.name === 'Spaces';
  const spaceSearchText = route.name.replace(/^\w/, c => c.toLowerCase());

  const hideViewAll = route.params?.hideViewAll || false;

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  useEffect(() => {
    if (route.name === 'Spaces') {
      updateSpaces()(dispatch);
    }
  }, []);

  useEffect(() => {
    const spacesFilter = s => s.name.toLowerCase().includes(searchString);
    if (searchString.length === 0) {
      setClasses(classes);
      setGroups(groups);
      setCommunities(communities);
    } else {
      setClasses(classes.filter(spacesFilter));
      setGroups(groups.filter(spacesFilter));
      setCommunities(communities.filter(spacesFilter));
    }
  }, [searchString, classes, groups, communities]);

  const onSearchText = text => setSearchString(text.toLowerCase());

  //  new react-native-screens native iOS search bar
  // useEffect(() => {
  //   navigation.setOptions({
  //     searchBar: {
  //       placeholder: 'Interesting places...',
  //       onChangeText: (event) => setSearch(event.nativeEvent.text),
  //       obscureBackground: false,
  //       autoCapitalize: 'none',
  //       hideWhenScrolling: false,
  //     },
  //   });
  // }, [navigation, search]);

  const navigateToSpaceItem = (item, navigation) => () => {
    navigation.navigate('Space', {
      spaceItem: item
    });
  };

  const renderSectionHeader = ({ section }) =>
    !hideViewAll ? (
      <SpacesSectionHeader>
        <HeaderTitle style={{ color: themeColors.slateGray }}>
          {section.title}
        </HeaderTitle>
        <HeaderLink
          style={{ color: themeColors.slateGray }}
          onPress={() =>
            navigation.navigate(section.title, { hideViewAll: true })
          }
        >
          View All
        </HeaderLink>
      </SpacesSectionHeader>
    ) : null;

  const renderItem = ({ item }) => (
    <SpacesListItem
      data={item}
      navigate={navigateToSpaceItem(item, navigation)}
      key={item.id}
    />
  );

  const getSections = () => {
    const groupsSection = {
      title: i18n('Groups'),
      data: hideViewAll ? groupsToShow : groupsToShow.slice(0, 5)
    };
    const classesSection = {
      title: i18n('Classes'),
      data: hideViewAll ? classesToShow : classesToShow.slice(0, 5)
    };
    const communitiesSection = {
      title: i18n('Communities'),
      data: hideViewAll ? communitiesToShow : communitiesToShow.slice(0, 5)
    };

    let sections = [];
    if (isSpacesMain) {
      sections = sections.concat([
        communitiesSection,
        classesSection,
        groupsSection
      ]);
    } else if (route.name === 'Communities') {
      sections.push(communitiesSection);
    } else if (route.name === 'Classes') {
      sections.push(classesSection);
    } else {
      sections.push(groupsSection);
    }
    return sections.filter(item => item.data && item.data.length);
  };

  const getNextPage = async type => {
    const nextPage = page[type] + 1;
    const data = await actionsNextPage[type](nextPage);
    setPage({ ...page, [type]: data ? nextPage : page[type] });
  };
  const nextPageBySection = async () => {
    !isSpacesMain && getNextPage(route.name);
  };

  const itemSeparator = () => <HRLine opacity={0.8} fullWidth />;

  return (
    <Container style={{ backgroundColor: themeColors.body }}>
      <SearchBar
        placeholder={i18n(`Search ${spaceSearchText}`)}
        onChangeText={onSearchText}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={!IS_ANDROID ? 'padding' : null}
      >
        <SpacesSectionsContainer
          marginTop={hideViewAll ? '2px' : '0px'}
          style={{ backgroundColor: themeColors.body }}
        >
          {!(
            classesToShow.length === 0 &&
            groupsToShow.length === 0 &&
            communitiesToShow.length === 0
          ) ? (
            <SpaceList
              keyboardDismissMode="on-drag"
              contentInsetAdjustmentBehavior="automatic"
              sections={getSections()}
              renderSectionHeader={renderSectionHeader}
              renderSectionFooter={itemSeparator}
              ItemSeparatorComponent={itemSeparator}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
              keyExtractor={(item, index) =>
                item.id
                  ? `parentId-${item.idParentSpace}-id-${item.id}`
                  : `${index}`
              }
              onEndReached={nextPageBySection}
              onEndReachedThreshold="0.5"
            />
          ) : (
            <EmptyState
              style={{ marginBottom: DEVICE_HEIGHT / 4 }}
              title={i18n('No Spaces found')}
              hasLink
              caption={i18n(
                'Looks like you’re not part of any groups or classes'
              )}
              linkText={i18n('Create Group')}
              onPress={() =>
                navigation.navigate('NativeModalNavigator', {
                  screen: 'CreateGroupScreen'
                })
              }
            />
          )}
        </SpacesSectionsContainer>
      </KeyboardAvoidingView>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.backgroundColor}
        animated
      />
    </Container>
  );
});

Spaces.displayName = 'Spaces';

export default Spaces;
