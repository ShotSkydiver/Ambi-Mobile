import React, { useEffect, useState } from 'react';
import { View, SectionList, KeyboardAvoidingView } from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import i18n from 'format-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useIsFocused } from '@react-navigation/native';

import UserRow, { SectionHeader } from '../../shared/UserRow';
import { FullScreenLoader } from '../../shared/Loader';
import SearchBar from '../../shared/SearchBar';
import HRLine from '../../shared/HRLine';
import { IS_ANDROID } from '../../shared/constants';
import { getSpaceMembers } from '../redux/actions';

const UsersContainer = styled(View)`
  flex: 1;
  padding: 0 16px;
`;

const adminRoles = ['admin', 'owner', 'ta', 'faculty'];

const SpaceMembers = ({ navigation, currentSpaceInView, typeSort }) => {
  const isFocused = useIsFocused();
  const [admins, setAdmins] = useState([]);
  const dispatch = useDispatch();
  const [membersAlpha, setMembersAlpha] = useState({});
  const [userIdToSearchKeywords, setUserIdToSearchKeywords] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showLoader, toggleLoader] = useState(true);
  const { members } = currentSpaceInView;
  const sectionsData = [];

  const filterFromSearch = users => {
    if (searchKeyword) {
      return users.filter(user =>
        userIdToSearchKeywords[user.id].includes(searchKeyword.toLowerCase())
      );
    }
    return users;
  };

  const transformMembers = () => {
    const spaceAdmins = [];
    const spaceMembers = [];
    const spaceMembersAlpha = {};
    const spaceKeywords = {};
    const initialMembers = { ...currentSpaceInView };
    const types = { 'last-name': 'lastName', 'first-name': 'firstName' };

    if (typeSort.order === 'asc') {
      initialMembers.members.sort((a, b) => {
        const textA = a.user[types[typeSort.sortBy]]
          ? a.user[types[typeSort.sortBy]].charAt(0).toUpperCase()
          : a.user.displayName;
        const textB = b.user[types[typeSort.sortBy]]
          ? b.user[types[typeSort.sortBy]].charAt(0).toUpperCase()
          : b.user.displayName;
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
    }

    if (typeSort.order === 'desc') {
      initialMembers.members.sort((a, b) => {
        const textA = a.user[types[typeSort.sortBy]]
          ? a.user[types[typeSort.sortBy]].charAt(0).toUpperCase()
          : a.user.displayName;
        const textB = b.user[types[typeSort.sortBy]]
          ? b.user[types[typeSort.sortBy]].charAt(0).toUpperCase()
          : b.user.displayName;
        return textA > textB ? -1 : textA < textB ? 1 : 0;
      });
    }

    initialMembers.members.forEach(m => {
      const { alias } = m.role;
      if (adminRoles.includes(alias)) {
        spaceAdmins.push(m);
      } else {
        let nameToUse;
        if (typeSort.sortBy === 'first-name') {
          nameToUse =
            m.user.firstName || m.user.displayName || m.user.profile.firstName;
        } else if (typeSort.sortBy === 'last-name') {
          nameToUse =
            m.user.lastName || m.user.displayName || m.user.profile.lastName;
        }
        const firstLetter = nameToUse ? nameToUse[0].toUpperCase() : '?';
        spaceMembers.push(m);
        if (spaceMembersAlpha[firstLetter] === undefined) {
          spaceMembersAlpha[firstLetter] = [m];
        } else {
          spaceMembersAlpha[firstLetter].push(m);
        }
      }
      const searchKeywords =
        `${m.role.alias} ${m.role.title} ${m.user.displayName} ${m.user.firstName} ${m.user.lastName}`.toLowerCase();
      spaceKeywords[m.id] = searchKeywords;
    });
    sectionsData.push({
      data: spaceAdmins,
      title: `${i18n('Admins')}`,
      key: 'admins'
    });
    Object.keys(spaceMembersAlpha).forEach(letter => {
      sectionsData.push({
        data: spaceMembersAlpha[letter],
        title: letter,
        key: letter
      });
    });

    setAdmins(spaceAdmins);
    setMembersAlpha(spaceMembersAlpha);
    setUserIdToSearchKeywords(spaceKeywords);
  };

  const getSpaceInfo = async () => {
    if (!members) {
      await getSpaceMembers(
        currentSpaceInView,
        currentSpaceInView.type
      )(dispatch);
    }
    toggleLoader(false);
  };

  useEffect(() => {
    if (isFocused) {
      getSpaceInfo();
    }
    if (currentSpaceInView.members) {
      transformMembers();
    }
  }, [isFocused, currentSpaceInView, typeSort]);

  const filteredAdmins = filterFromSearch(admins);
  const newMembers = {};
  Object.keys(membersAlpha).forEach(key => {
    newMembers[key] = filterFromSearch(membersAlpha[key]);
  });

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.body }}>
      <SearchBar
        placeholder={i18n('Search')}
        value={searchKeyword}
        onChange={({ nativeEvent }) => {
          setSearchKeyword(nativeEvent.text);
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={!IS_ANDROID ? 'padding' : null}
        keyboardVerticalOffset={insets.top}
      >
        <UsersContainer>
          {showLoader && <FullScreenLoader />}
          <SectionList
            keyboardDismissMode="on-drag"
            style={{ flex: 1, marginVertical: 16 }}
            stickySectionHeadersEnabled
            showsVerticalScrollIndicator
            ItemSeparatorComponent={() => <HRLine opacity={0.8} fullWidth />}
            renderSectionFooter={({ section }) =>
              filteredAdmins.length &&
              newMembers.length &&
              section.key === 'admins' ? (
                <HRLine style={{ marginBottom: 14 }} opacity={0.8} fullWidth />
              ) : null
            }
            renderItem={({ item: membership }) => (
              <UserRow
                user={membership.user}
                key={membership.id}
                badge={membership.role ? membership.role.alias : null}
                navigation={navigation}
                theme={themeColors}
                usePadding
              />
            )}
            renderSectionHeader={({ section }) =>
              section.data.length ? (
                <SectionHeader
                  style={{
                    color: themeColors.slateGray,
                    backgroundColor: themeColors.body,
                    paddingVertical: 8
                  }}
                >
                  {section.title}
                </SectionHeader>
              ) : null
            }
            keyExtractor={(user, index) =>
              user.id ? user.id.toString() : index
            }
            sections={[
              {
                data: filteredAdmins,
                title: `${i18n('Admins')}`,
                key: 'admins'
              },
              ...Object.keys(newMembers).map(k => {
                return {
                  data: newMembers[k],
                  title: `${k}`,
                  key: `${k}`
                };
              })
            ]}
          />
        </UsersContainer>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SpaceMembers;
