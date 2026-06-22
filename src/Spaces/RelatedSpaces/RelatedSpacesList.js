import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  SectionList,
  RefreshControl
} from 'react-native';
import styled from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import i18n from 'format-message';
import SearchBar from '../../shared/SearchBar';
import { IS_ANDROID } from '../../shared/constants';
import RelatedSpacesRow, { SectionHeader } from './RelatedSpacesRow';
import HRLine from '../../shared/HRLine';
import { getRelatedSpaces } from '../redux/actions';
import { AmbiColors } from '../../shared/contexts/themeContext';

const RelatedSpacesContainer = styled(View)`
  flex: 1;
  padding: 0 16px;
`;

const itemSeparator = () => <HRLine opacity={0.8} fullWidth />;

const RelatedSpacesList = ({ currentSpaceInView, typeSort, navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [relatedSpacesObject, setRelatedSpacesObject] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const { relatedSpaces, membersCountRelatedSpaces } = currentSpaceInView;

  useEffect(() => {
    getRelatedSpaces(currentSpaceInView)(dispatch);
  }, []);

  const toUpperCase = string => string.charAt(0).toUpperCase();

  const onRefreshList = async () => {
    setIsRefresh(true);
    await getRelatedSpaces(currentSpaceInView)(dispatch);
    setIsRefresh(false);
  };

  const formatRelatedSpaces = () => {
    let items = [];
    if (relatedSpaces) {
      items = searchKeyword
        ? relatedSpaces.filter(relatedSpace =>
            relatedSpace.name
              .toLowerCase()
              .includes(searchKeyword.toLowerCase())
          )
        : relatedSpaces;

      if (typeSort.order === 'asc') {
        items.sort((a, b) => {
          const textA = toUpperCase(a.name);
          const textB = toUpperCase(b.name);
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      }
      if (typeSort.order === 'desc') {
        items.sort((a, b) => {
          const textA = toUpperCase(a.name);
          const textB = toUpperCase(b.name);
          return textA > textB ? -1 : textA < textB ? 1 : 0;
        });
      }

      const relatedSpacesFormat = [];
      items.forEach(relatedSpace => {
        const index = membersCountRelatedSpaces.findIndex(
          item => item.group_id === relatedSpace.id
        );
        const newRelatedSpace = {
          ...relatedSpace,
          membersCount: membersCountRelatedSpaces[index].count
        };
        const firstLetter =
          newRelatedSpace && newRelatedSpace.name
            ? newRelatedSpace.name[0].toUpperCase()
            : '?';
        if (relatedSpacesFormat[firstLetter] === undefined)
          relatedSpacesFormat[firstLetter] = [newRelatedSpace];
        else relatedSpacesFormat[firstLetter].push(newRelatedSpace);
      });

      setRelatedSpacesObject(relatedSpacesFormat);
    }
  };

  useEffect(() => {
    if (relatedSpaces && membersCountRelatedSpaces) {
      formatRelatedSpaces();
    }
  }, [typeSort, searchKeyword, relatedSpaces]);

  const navigateToRelatedSpaceItem = (item, navigation) => {
    const itemData = { ...item, type: 'group' };
    navigation.navigate('RelatedSpace', {
      spaceItem: itemData,
      parentSpace: currentSpaceInView
    });
  };

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
        <RelatedSpacesContainer>
          <SectionList
            refreshControl={
              <RefreshControl
                refreshing={isRefresh}
                onRefresh={() => onRefreshList()}
                style={{
                  backgroundColor: 'transparent'
                }}
                tintColor={AmbiColors.ambiBlue}
                colors={[AmbiColors.ambiBlue]}
              />
            }
            ItemSeparatorComponent={itemSeparator}
            renderSectionFooter={itemSeparator}
            sections={[
              ...Object.keys(relatedSpacesObject).map(k => {
                return {
                  data: relatedSpacesObject[k],
                  title: `${k}`,
                  key: `${k}`
                };
              })
            ]}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => {
              return (
                <RelatedSpacesRow
                  item={item}
                  onPress={() => navigateToRelatedSpaceItem(item, navigation)}
                />
              );
            }}
            renderSectionHeader={({ section }) =>
              section.data.length && (
                <SectionHeader
                  style={{
                    color: themeColors.textPrimary,
                    backgroundColor: themeColors.body,
                    paddingVertical: 8
                  }}
                >
                  {section.title}
                </SectionHeader>
              )
            }
          />
        </RelatedSpacesContainer>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RelatedSpacesList;
