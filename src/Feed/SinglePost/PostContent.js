import React, { memo } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import Hyperlink from 'react-native-hyperlink';
import { useTheme } from '@react-navigation/native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import ImageGrid from './PostImageGrid';
import VideoAttachments from './VideoAttachments';
import FileAttachments from './FileAttachments';
import SinglePostPoll from './SinglePostPoll';
import LinkPreview from '../../shared/LinkPreview';
import HtmlRenderer from '../../shared/HtmlRenderer';

const PostContentContainer = styled(View)`
  padding: 16px 0 28px 0;
`;

const PostContentText = styled(Text)`
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 20px;
`;

const PostContent = ({ post, navigation, currentUser, togglePostVote }) => {
  const { postAttachments, poll, attributes, linkPreviewAttributes, content } =
    post;
  const hasLinkPreview = Object.keys(linkPreviewAttributes).length > 0;
  const imageAttachments = (postAttachments || []).filter(a =>
    a.contentType.includes('image/')
  );
  const videoAttachments = (postAttachments || []).filter(a =>
    a.contentType.includes('video/')
  );
  const fileAttachments = (postAttachments || []).filter(a =>
    a.contentType.includes('application/')
  );

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <PostContentContainer>
      {attributes && attributes.canvasId ? (
        <HtmlRenderer content={content} />
      ) : (
        <Hyperlink
          linkStyle={{ color: '#337ab7' }}
          onPress={url => {
            InAppBrowser.open(url);
          }}
        >
          <PostContentText
            selectable
            style={{ color: themeColors.textPrimary }}
          >
            {content}
          </PostContentText>
        </Hyperlink>
      )}
      {hasLinkPreview && (
        <LinkPreview
          linkPreviewProps={{
            ...linkPreviewAttributes,
            image: linkPreviewAttributes?.image?.filename
              ? postAttachments[0]?.links?.content
              : linkPreviewAttributes.image
          }}
          isCreatedPreview
          navigation={navigation}
        />
      )}
      {!hasLinkPreview && imageAttachments && imageAttachments.length > 0 && (
        <View style={{ flex: 1 }}>
          <ImageGrid images={imageAttachments} navigation={navigation} />
        </View>
      )}
      {!hasLinkPreview && videoAttachments && videoAttachments.length > 0 && (
        <VideoAttachments
          attachments={videoAttachments}
          onAttachmentPress={attachment =>
            navigation.navigate('NativeModalNavigator', {
              screen: 'VideoViewer',
              params: {
                post,
                attachment
              }
            })
          }
        />
      )}
      {fileAttachments && fileAttachments.length > 0 && (
        <FileAttachments
          fileAttachments={fileAttachments}
          navigation={navigation}
        />
      )}
      {poll && (
        <SinglePostPoll
          poll={poll}
          currentUser={currentUser}
          togglePostVote={togglePostVote}
          navigation={navigation}
          postId={post.uniqueIdentifier}
        />
      )}
    </PostContentContainer>
  );
};

function areEqual(prevProps, nextProps) {
  return prevProps.post === nextProps.post;
}

export default memo(PostContent, areEqual);
