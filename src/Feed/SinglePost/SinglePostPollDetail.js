/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import styled from 'styled-components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { IconHeaderButtons, Item } from '../../shared/HeaderButtons';
import { getPostInfo } from '../FeedService';
import HRLine from '../../shared/HRLine';

const Container = styled(View)`
  flex: 1;
  padding: 0px 24px;
`;

const ItemText = styled(Item)`
  margin-left: -5px;
`;

const PollModalContainer = styled(FlatList)`
  flex: 1;
  height: 10%;
`;

const HeaderRespondents = styled(View)``;

const HeaderRespondentsTitle = styled(Text)`
  margin: 15px 0px;
`;

const RespondentText = styled(Text)`
  font-family: Circular-Medium;
  font-size: 14px;
  line-height: 18px;
`;

const Bold = styled(Text)`
  font-family: Circular;
  font-weight: 900;
`;

const AvatarImage = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
`;

const UserContainer = styled(View)`
  margin-top: 30px;
  flex: 1;
  flex-direction: row;
`;

const UserInfo = styled(View)`
  flex: 1;
  margin-left: 16px;
`;

const UserName = styled(Text)`
  font-family: Circular;
  font-size: 14px;
  line-height: 18px;
  font-weight: 900;
`;

const PillContainer = styled(View)`
  margin-top: 4px;
`;

const PillText = styled(Text)`
  padding-right: 5px;
  padding-left: 5px;
  height: 18px;
  border-radius: 8.5px;
  overflow: hidden;
  background-color: #e4f4fc;
  font-family: Circular-Book;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  align-self: flex-start;
`;

const SinglePostPollDetail = ({ navigation, route }) => {
  const postId = route.params?.postId;
  const optionSelected = route.params?.optionSelected;
  const { id: idOptionSelected, text: textOptionSelected } = optionSelected;
  const [pollUsers, setPollUsers] = useState([]);
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const getPost = async () => {
    const post = await getPostInfo(postId);
    const {
      postPollsJson: { votesWithUserData }
    } = post;
    setPollUsers(votesWithUserData[idOptionSelected]);
  };

  useEffect(() => {
    getPost();
  }, [postId]);

  navigation.setOptions({
    headerLeft: () => {
      return (
        <IconHeaderButtons useLeftHeader={false}>
          <Item
            title="Back"
            iconName="chevron-left"
            onPress={() => navigation.pop()}
            color={themeColors.slateGray}
          />
          <ItemText
            title="Back"
            onPress={() => navigation.pop()}
            color={themeColors.slateGray}
          />
        </IconHeaderButtons>
      );
    }
  });

  const renderPollList = ({ item }) => {
    const {
      avatar,
      name,
      role: { title: roleTitle }
    } = item;
    return (
      <UserContainer>
        <AvatarImage
          source={{
            uri: avatar
          }}
        />
        <UserInfo>
          <UserName color={themeColors.darkGreenColor}>{name}</UserName>
          <PillContainer>
            <PillText>{roleTitle}</PillText>
          </PillContainer>
        </UserInfo>
      </UserContainer>
    );
  };

  const filterAlphabetically =
    pollUsers.length > 1
      ? pollUsers.sort((a, b) => a.name.localeCompare(b.name))
      : pollUsers;

  return (
    <Container>
      <SafeAreaView
        style={{ backgroundColor: themeColors.backgroundColor, flex: 1 }}
        mode="padding"
        edges={['right', 'bottom', 'left']}
      >
        <HeaderRespondents>
          <HeaderRespondentsTitle>
            <RespondentText style={{ color: themeColors.slateGray }}>
              Respondents for:
            </RespondentText>{' '}
            <Bold color={themeColors.darkGreenColor}>
              {textOptionSelected} {`(${filterAlphabetically.length} total)`}{' '}
            </Bold>
          </HeaderRespondentsTitle>
        </HeaderRespondents>
        <HRLine fullWidth />
        <PollModalContainer
          data={filterAlphabetically}
          initialNumToRender={10}
          renderItem={renderPollList}
          keyExtractor={(item, index) =>
            item && item.id ? item.id.toString() : index
          }
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Container>
  );
};

export default SinglePostPollDetail;
