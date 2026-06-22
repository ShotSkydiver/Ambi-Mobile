import {
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native';
import styled from 'styled-components';
import { AmbiColors } from '../shared/contexts/themeContext';
import { SubtitleText } from './shared';
import { IS_ANDROID } from '../shared/constants';

export const Container = styled(View)`
  flex: 1;
  justify-content: space-between;
  position: relative;
  background-color: ${({ backgroundColor }) => backgroundColor || '#ffffff'};
`;

export const KeyboardContainer = styled(KeyboardAvoidingView)`
  flex: 1;
  justify-content: space-between;
  position: relative;
  background-color: ${({ backgroundColor }) => backgroundColor || '#ffffff'};
`;

export const Wrapper = styled(View)`
  flex: 1;
  padding-horizontal: 24px;
`;

export const Row = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const ConnectionBlock = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 58px;
  width: 280px;
  border: ${({ isActive }) =>
    isActive ? `1px solid #029ee2` : `1px solid #e6eaf2`};
  border-radius: 12px;
  background-color: #ffffff;
  margin: 32px 14px 32px 0;
  elevation: 2;
`;

export const SocialIcon = styled(Image)`
  width: 32px;
  height: 32px;
  padding: 4px;
  margin-right: 12px;
`;

export const InfoText = styled(SubtitleText)`
  color: ${({ color }) => color};
  font-size: 17px;
  line-height: 21px;
  font-family: Circular-Book;
  margin-bottom: 10px;
`;

export const LinkText = styled(Text)`
  color: #029ee2;
  font-family: Circular-Bold;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 20px;
`;

export const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.legacy.error};
  font-family: Circular-Book;
  font-size: 15px;
  line-height: 18px;
  padding-horizontal: 8px;
  margin-bottom: 8px;
`;

export const NotRecognizedText = styled(ErrorText);

export const MagicEmailIcon = styled(Image)`
  width: 145px;
  height: 98px;
  margin: 22px auto;
`;

export const CodeFieldText = styled(Text)`
  color: ${({ color }) => color};
  border-color: ${({ isFocused }) =>
    isFocused ? AmbiColors.ambiBlue : '#CED1D9'};
`;

export const codeStyles = theme => {
  return StyleSheet.create({
    cell: {
      backgroundColor: IS_ANDROID ? theme.backgroundColor : 'transparent',
      borderRadius: 10,
      borderWidth: 1,
      color: theme.textPrimary,
      // Android
      elevation: 3,
      fontFamily: 'Circular-Bold',
      fontSize: 32,
      height: 90,
      lineHeight: 90,
      marginHorizontal: 8,
      // iOS
      shadowColor: theme.textPrimary,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.18,
      shadowRadius: 2.22,
      textAlign: 'center',
      width: 72
    },
    codeFiledRoot: {
      backgroundColor: theme.backgroundColor,
      justifyContent: 'center',
      marginTop: 24
    }
  });
};

export const LockIconBackground = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width || '80px'};
  height: ${({ height }) => height || '80px'};
  border-radius: ${({ rounded }) => (rounded ? '100px' : '40px')};
  background-color: #22a671;
  margin: 0 auto;
`;

export const ConnectionBackground = styled(View)`
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border-width: 1px;
  margin: 0 8px;
`;

export const UnlinkAccountButton = styled(View)`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  bottom: 0;
  border: 1px solid #e8e8e9;
  border-radius: 16px;
  elevation: 2;
  shadow-offset: 0px 1px;
  shadow-color: #1d2129;
  shadow-opacity: 0.22px;
  shadow-radius: 2.22px;
`;

export const BottomContainer = styled(TouchableOpacity)`
  justify-content: center;
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const BottomButton = styled(BottomContainer)`
  height: 48px;
  border: 1px solid #707689;
  border-radius: 12px;
  background-color: #707689;
  left: 24px;
  right: 24px;
  bottom: 20px;
`;
