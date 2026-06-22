/**
 * CommentUserHead
 */
import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';

// components
import Pill from '../shared/Pill';
import Avatar from '../shared/Avatars';

const Container = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const ContainerBody = styled(View)`
  flex: 1;
  margin-left: 8px;
  border-radius: 8px;
  padding-vertical: 10px;
  padding-horizontal: 12px;
  background-color: ${({ bgColor }) => bgColor || '#e6eaf2'};
`;

const Content = styled(View)``;

const UserData = styled(View)``;

const UserName = styled(Text)`
  font-size: 14px;
  font-family: Circular-Bold;
  line-height: 18px;
  margin-bottom: 2px;
`;

const PillRole = styled(View)`
  flex: 1;
  flex-shrink: 0;
  flex-direction: row;
`;

const CommentUserHead = ({ user, children, showRole, onNavigate }) => {
  const theme = useTheme();
  const {
    legacy: { textPrimary: colorTextPrimary, commentBGColor }
  } = theme;

  const { role, avatarMedia, avatarUrl, firstName, lastName } = user;
  const { title: roleName = 'User', color: roleColor = '' } = role || {};
  const userAvatarUrl = avatarMedia ? avatarMedia.links.content : avatarUrl;

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Avatar url={userAvatarUrl} size={30} onPress={onNavigate} />
      <ContainerBody bgColor={commentBGColor}>
        <UserData>
          <UserName style={{ color: colorTextPrimary }} onPress={onNavigate}>
            {firstName} {lastName}
          </UserName>
          {showRole && (
            <PillRole>
              <Pill role={roleName} roleColor={roleColor} />
            </PillRole>
          )}
        </UserData>
        {children && <Content>{children}</Content>}
      </ContainerBody>
    </Container>
  );
};

CommentUserHead.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.shape({
      title: PropTypes.string,
      color: PropTypes.string
    }),
    avatarMedia: PropTypes.shape({
      links: PropTypes.shape({
        content: PropTypes.string
      })
    }),
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string
  }),
  showRole: PropTypes.bool,

  // action
  onNavigate: PropTypes.func
};

CommentUserHead.defaultProps = {
  user: null,
  showRole: false,

  // action
  onNavigate: () => {}
};

export default CommentUserHead;
