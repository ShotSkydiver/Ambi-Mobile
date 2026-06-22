import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import HRLine from '../shared/HRLine';
import GoogleIcon from '../Auth/images/google-oauth2.svg';
import AppleIcon from '../Auth/images/apple.svg';

export const connectionInfoMapping = {
  'google-oauth2': { icon: GoogleIcon, name: 'Google' },
  apple: { icon: AppleIcon, name: 'Apple' }
};

export const SettingsContainer = styled(View)`
  flex: 1;
`;

export const SettingsItem = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  max-height: 66px;
  padding: 24px 20px;
  margin-bottom: 7px;
  border: 1px solid;
`;

export const SettingsItemTitle = styled(Text)`
  font-family: Circular-Bold;
  font-size: 14px;
  line-height: 18px;
  margin-left: 8px;
`;

export const SingleSectionContainer = styled(View)`
  flex: 1;
  height: 100%;
  background-color: ${({ themeColors }) =>
    themeColors ? themeColors.body : '#ffffff'};
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
`;

export const HeadingContainer = styled(View)`
  background-color: ${({ themeColors }) =>
    themeColors ? themeColors.body : '#ffffff'};
  height: 50px;
  padding: 8px 16px;
`;

export const HeaderTitle = styled(Text)`
  font-family: Circular-Bold;
  color: ${({ themeColors }) =>
    themeColors ? themeColors.textPrimary : '#ffffff'};
  font-size: 18px;
  margin: ${({ margin }) => margin || '0px'};
`;

export const SeparatorContainer = styled(View)`
  padding-horizontal: 0px;
`;

export const SectionContent = styled(View)`
  flex: 1;
  height: 100%;
  padding: 16px;
`;

export const ListItemContainer = styled(View)`
  height: 56px;
`;

export const ListItemWrapper = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  padding: 0 4%;
  align-items: center;
`;

export const ListItemLeft = styled(View)`
  flex: 1;
  flex-direction: row;
`;

export const ItemTitle = styled(Text)`
  color: ${({ themeColors }) =>
    themeColors ? themeColors.slateGray : '#ffffff'};
  font-family: Circular-Book;
  font-size: 17px;
  line-height: 24px;
`;

export const LinkText = styled(Text)`
  color: #029ee2;
  font-family: Circular-Book;
  font-size: 16px;
  line-height: 20px;
`;

export const Row = styled(View)`
  flex: 1;
  flex-direction: row;
`;

export const RowSpaced = styled(Row)`
  justify-content: space-between;
`;

export const Input = styled(TextInput)`
  font-family: Circular-Book;
  font-size: 14px;
  height: 76px;
  padding: 18px 0 18px 16px;
  background-color: #ffffff;
  border-color: ${({ borderColor }) => borderColor || '#ffffff'};
  color: ${({ color }) => color || '#ffffff'};
`;

export const Spacer = styled(View)`
  height: ${({ height }) => height || '0px'};
  width: ${({ width }) => width || '0px'};
`;

export const SeparatorComponent = () => (
  <SeparatorContainer>
    <HRLine fullWidth style={{ marginVertical: 4 }} />
  </SeparatorContainer>
);
