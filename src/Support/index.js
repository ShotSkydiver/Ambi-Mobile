/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StatusBar
} from 'react-native';
import styled from 'styled-components';
import i18n from 'format-message';
import { useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import RNPhotoLibraryAssets from 'react-native-photo-library-assets';
import { v4 as uuid } from 'uuid';

import { User } from '../models/User';
import uploadFile from '../shared/utils/uploadFile';
import BottomSheet from '../shared/BottomSheet';
import { FullScreenLoader } from '../shared/Loader';
import HRLine from '../shared/HRLine';
import { AmbiColors } from '../shared/contexts/themeContext';
import { IconHeaderButtons, Item } from '../shared/HeaderButtons';

const SupportContainer = styled(View)`
  flex: 1;
`;

const SectionHeader = styled(View)`
  padding: 0 0px 8px 16px;
`;
const SectionTitle = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
`;

const SectionWrapper = styled(View)`
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 10px 0px;
  min-height: 90px;
  margin: 6px 0;
`;

const SectionContent = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 4px 16px;
`;

const ContentText = styled(Text)`
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 18px;
`;

const PlaceholderText = styled(ContentText)``;

const Input = styled(TextInput)`
  font-family: Circular-Book;
  font-size: 14px;
  min-height: 100px;
  padding: 14px 0 4px 16px;
`;

// Todo: these two variables below should not be pushed to git.
// check secret-scripts folder on how to hide these and push them to deploy process.
const AMBI_EMAIL_API =
  'https://ocjkogj6gc.execute-api.us-east-1.amazonaws.com/production/email/send';

function Support({ navigation }) {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const currentUser = useSelector(state => new User(state.auth.user));
  const [showActionSheet, setActionSheet] = useState(false);
  const [selectedIssueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [uploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (screenshot) {
        ImagePicker.clean();
      }
    };
  }, []);

  const renderAlert = message => {
    return Alert.alert(
      message,
      '',
      [{ text: 'OK', onPress: () => navigation.navigate('More') }],
      {
        cancelable: false
      }
    );
  };

  const toggleActionSheet = () => {
    setActionSheet(!showActionSheet);
  };

  const handleOptionClick = title => {
    setIssueType(title);
    toggleActionSheet();
  };

  const issueTypeOptions = [
    {
      title: i18n('I just have a question'),
      onPress: () => handleOptionClick(issueTypeOptions[0].title)
    },
    {
      title: i18n('I want to report a bug I noticed'),
      onPress: () => handleOptionClick(issueTypeOptions[1].title)
    },
    {
      title: i18n('A bug is affecting me, but it is not urgent'),
      onPress: () => handleOptionClick(issueTypeOptions[2].title)
    },
    {
      title: i18n('I cannot work until this issue is fixed'),
      onPress: () => handleOptionClick(issueTypeOptions[3].title)
    },
    {
      title: i18n('I have an emergency issue!'),
      onPress: () => handleOptionClick(issueTypeOptions[4].title)
    }
  ];

  const uploadScreenshot = async supportScreenshot => {
    try {
      await uploadFile({
        url: '/users/media', // Note: this should be something like support/media but that doesn't exist in api yet.
        file: supportScreenshot,
        events: {
          onUploadLoaded: () => {
            setIsUploadingScreenshot(true);
          },
          onUploadStarted: () => {},
          onUploadProgress: () => {},
          onUploadError: () => {},
          onUploadFinished: ({ result }) => {
            setIsUploadingScreenshot(false);
            setScreenshotUrl(result.data.links.content);
          }
        }
      });
    } catch (err) {
      setIsUploadingScreenshot(false);
      console.warn('error updating user profile: ', err);
    }
  };

  const openImagePicker = async () => {
    try {
      const selectedScreenshot = await ImagePicker.openPicker({
        cropping: true,
        smartAlbums: [
          'UserLibrary',
          'Favorites',
          'RecentlyAdded',
          'Videos',
          'SelfPortraits',
          'LivePhotos',
          'DepthEffect',
          'Panoramas',
          'Bursts',
          'Screenshots',
          'LongExposure',
          'Animated',
          'Generic',
          'AllHidden',
          'Regular',
          'PhotoStream',
          'CloudShared'
        ],
        mediaType: 'photo',
        sortOrder: 'asc',
        waitAnimationEnd: false
      });

      if (selectedScreenshot) {
        const imageUri = await RNPhotoLibraryAssets.getImageForAsset(
          selectedScreenshot.localIdentifier
        );
        const processedScreenshot = {
          ...selectedScreenshot,
          path: imageUri,
          filename: selectedScreenshot.filename || selectedScreenshot.name,
          type: selectedScreenshot.type || selectedScreenshot.mime,
          uniqueIdentifier: uuid()
        };

        setScreenshot(processedScreenshot);
        await uploadScreenshot(processedScreenshot);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const submitTicket = async () => {
    setSubmitting(true);
    const formObj = {
      email: currentUser.email,
      name: currentUser.getName(),
      isMobileSupportTicket: true,
      issueType: selectedIssueType,
      issueDescription,
      screenshotUrl
    };
    try {
      await fetch(AMBI_EMAIL_API, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObj)
      });
      setSubmitting(false);
      renderAlert('Ticket successfully submitted!');
    } catch (err) {
      console.warn('error submitting support ticket: ', err);
      setSubmitting(false);
      renderAlert('Error sending support ticket to ambi. Please try again!');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const hasIssue =
          selectedIssueType.length > 0 && issueDescription.length > 0;
        const onPress = () => {
          return hasIssue && !submitting ? submitTicket() : null;
        };
        return (
          <IconHeaderButtons useLeftHeader>
            <Item
              title="Send"
              color={
                hasIssue && !submitting
                  ? AmbiColors.ambiBlue
                  : themeColors.slateGray
              }
              onPress={onPress}
              disabled={!hasIssue || submitting}
              actionable
            />
          </IconHeaderButtons>
        );
      }
    });
  }, [
    selectedIssueType,
    issueDescription,
    screenshot,
    screenshotUrl,
    submitting
  ]);

  return (
    <SupportContainer style={{ backgroundColor: themeColors.body }}>
      <SectionWrapper style={{ backgroundColor: themeColors.elementBGColor }}>
        <SectionHeader>
          <SectionTitle style={{ color: themeColors.textPrimary }}>
            {i18n('Issue Type')}
          </SectionTitle>
        </SectionHeader>
        <HRLine opacity={0.8} />
        <SectionContent onPress={toggleActionSheet}>
          {selectedIssueType.length > 0 && (
            <ContentText style={{ color: themeColors.darkGreenColor }}>
              {selectedIssueType}
            </ContentText>
          )}
          {selectedIssueType.length === 0 && (
            <PlaceholderText style={{ color: themeColors.slateGray }}>
              Select an issue type
            </PlaceholderText>
          )}
          <FeatherIcon
            name="chevron-right"
            color={themeColors.slateGray}
            size={18}
          />
        </SectionContent>
      </SectionWrapper>

      <SectionWrapper style={{ backgroundColor: themeColors.elementBGColor }}>
        <SectionHeader>
          <SectionTitle style={{ color: themeColors.textPrimary }}>
            {i18n('Describe your issue')}
          </SectionTitle>
        </SectionHeader>
        <HRLine opacity={0.8} />
        <Input
          multiline
          placeholder={i18n('Describe your issue in detail...')}
          placeholderTextColor={themeColors.slateGray}
          onChangeText={setIssueDescription}
          style={{ color: themeColors.textPrimary }}
        />
      </SectionWrapper>

      <SectionWrapper style={{ backgroundColor: themeColors.elementBGColor }}>
        <SectionHeader>
          <SectionTitle style={{ color: themeColors.darkGreenColor }}>
            {i18n('Attach')}
          </SectionTitle>
        </SectionHeader>
        <HRLine opacity={0.8} />
        <SectionContent onPress={openImagePicker}>
          {screenshot && screenshot.filename && (
            <ContentText style={{ color: themeColors.darkGreenColor }}>
              {screenshot.filename}
            </ContentText>
          )}
          {!screenshot && (
            <PlaceholderText style={{ color: themeColors.slateGray }}>
              Attach a screenshot (optional)
            </PlaceholderText>
          )}
          <FeatherIcon
            name="paperclip"
            color={themeColors.slateGray}
            size={18}
          />
        </SectionContent>
      </SectionWrapper>

      {submitting && <FullScreenLoader text="submitting ticket..." />}
      {uploadingScreenshot && (
        <FullScreenLoader text="uploading screenshot..." />
      )}
      <BottomSheet
        visible={showActionSheet}
        title="Issue Type"
        options={issueTypeOptions}
        toggle={toggleActionSheet}
      />
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
      />
    </SupportContainer>
  );
}

export default Support;
