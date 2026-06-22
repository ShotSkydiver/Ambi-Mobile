/**
 * ReportPostScreen
 */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';
import styled from 'styled-components';
import i18n from 'format-message';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

// redux

import { flaggedPost } from './redux/actions';

// components
import HRLine from '../shared/HRLine';
import { IS_ANDROID } from '../shared/constants';
import RadioButtonTick from '../shared/RadioButtonTick';
import { IconHeaderButtons, Item } from '../shared/HeaderButtons';

// helpers
import { AmbiColors } from '../shared/contexts/themeContext';
import { upperFirstLetter } from '../shared/utils/helpers';

const SectionWrapper = styled(View)`
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 10px 0px;
  margin: 6px 0;
  max-height: 340px;
`;

const SectionHeader = styled(View)`
  padding: 0 0 8px 16px;
`;
const SectionTitle = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
`;

const Input = styled(TextInput)`
  font-family: Circular-Book;
  font-size: 14px;
  min-height: 100px;
  padding: 14px 0 14px 16px;
`;

const ReasonsList = styled(FlatList)`
  flex: 1;
  padding: 0 16px;
`;

const SingleReason = styled(TouchableOpacity)`
  justify-content: space-between;
  flex-direction: row;
  padding: 12px 10px;
`;

const ReasonName = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const ReportPostScreen = ({ navigation, route }) => {
  const postId = route.params?.postId || route.params?.post?.id;
  const comment = route.params?.comment;
  const commentId = comment?.id || null;
  const typeReport = route.params?.typeComment || 'Post';
  const parentPostCommentId = comment?.parentPostCommentId || null;

  const [selectedReasons, setReasons] = useState([]);
  const [description, setDescription] = useState('');
  const [sendingReport, setSendingReport] = useState(true);
  const reasons = [
    'sexual content',
    'violent content',
    'harassment',
    'hate speech',
    'spam',
    'other'
  ];

  const dispatch = useDispatch();
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <IconHeaderButtons useLeftHeader={false}>
            <Item title="X" iconName="close" onPress={navigation.goBack} />
          </IconHeaderButtons>
        );
      }
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const hasReasons = (selectedReasons || []).length > 0;
        const onReportPost = async () => {
          if (sendingReport) {
            setSendingReport(false);
            await flaggedPost(
              { id: postId },
              {
                postId,
                reasons: selectedReasons,
                commentId,
                description,
                parentPostCommentId
              }
            )(dispatch);
            return Alert.alert(
              i18n(`${upperFirstLetter(typeReport)} successfully reported!`),
              '',
              [{ text: 'OK', onPress: () => navigation.goBack() }],
              { cancelable: false }
            );
          }

          return null;
        };
        return (
          <IconHeaderButtons useLeftHeader>
            <Item
              title="Submit"
              color={hasReasons ? AmbiColors.ambiBlue : themeColors.slateGray}
              onPress={hasReasons ? onReportPost : null}
              disabled={!hasReasons}
              actionable
            />
          </IconHeaderButtons>
        );
      }
    });
  }, [
    postId,
    comment,
    commentId,
    typeReport,
    description,
    sendingReport,
    selectedReasons,
    parentPostCommentId
  ]);

  const updateReasons = reason => {
    let newReasons = selectedReasons;
    if (newReasons.includes(reason)) {
      newReasons = selectedReasons.filter(r => r !== reason);
    } else {
      newReasons = newReasons.concat([reason]);
    }
    setReasons(newReasons);
  };

  const renderReason = ({ item }) => {
    return (
      <SingleReason key={item} onPress={() => updateReasons(item)}>
        <ReasonName style={{ color: themeColors.textPrimary }}>
          {i18n('{item}', { item })}
        </ReasonName>
        <RadioButtonTick
          isChecked={selectedReasons.includes(item)}
          onPress={() => {}}
          theme={themeColors}
        />
      </SingleReason>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: themeColors.body
      }}
      behavior={IS_ANDROID ? 'height' : 'padding'}
    >
      <SafeAreaView
        style={{ backgroundColor: themeColors.backgroundColor, flex: 1 }}
        mode="padding"
        edges={['right', 'bottom', 'left']}
      >
        <SectionWrapper style={{ backgroundColor: themeColors.body }}>
          <SectionHeader>
            <SectionTitle style={{ color: themeColors.darkGreenColor }}>
              {i18n('Why is this content being reported?')}
            </SectionTitle>
          </SectionHeader>
          <HRLine opacity={0.8} />
          <ReasonsList
            data={reasons}
            renderItem={renderReason}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
          />
        </SectionWrapper>
        {selectedReasons.includes('other') && (
          <SectionWrapper
            style={{ maxHeight: 200, backgroundColor: themeColors.body }}
          >
            <SectionHeader>
              <SectionTitle style={{ color: themeColors.darkGreenColor }}>
                {i18n('Describe your issue')}
              </SectionTitle>
            </SectionHeader>
            <HRLine />
            <Input
              multiline
              placeholder={i18n('Describe your issue in detail...')}
              onChangeText={setDescription}
              placeholderTextColor={themeColors.slateGray}
              style={{
                color: themeColors.textPrimary
              }}
            />
          </SectionWrapper>
        )}
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          animated
          translucent
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ReportPostScreen;
