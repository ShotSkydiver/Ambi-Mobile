import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RectButton } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { ThemeConstants, AmbiColors } from '../shared/contexts/themeContext';
import { AUTH_ACTION_TYPES } from './redux/actionTypes';
import { IconHeaderButtons, Item } from '../shared/HeaderButtons';

export const ambiApiUrl = 'prod-002.api.ambi.school';
export const ambiHostnameUrl = 'app.ambinetwork.com';
// export const ambiApiUrl = 'qa.api.ambi.school';
// export const ambiHostnameUrl = 'qa.ambi.school';
export const columbiaApiUrl = 'prod.api.ambi.school';
export const columbiaHostnameUrl = 'columbia.ambi.school';

const FieldContainer = styled(View)`
  height: 48px;
  border-radius: 14px;
  border-width: 1px;
  flex-direction: row;
`;

export const FieldInput = styled(TextInput)`
  flex: 1;
  margin-right: 8px;
  font-family: Circular-Book;
  font-size: 15px;
`;

export const BaseText = styled(Text)`
  font-family: Circular-Bold;
  font-size: 17px;
  line-height: 22px;
  text-align: center;
`;

export const TitleText = styled(BaseText)`
  font-size: 32px;
  line-height: 42px;
`;

export const LeftHeaderText = styled(BaseText)`
  font-size: 30px;
  line-height: 34px;
  text-align: left;
  padding-top: 14px;
`;

export const SubtitleText = styled(BaseText)`
  font-size: 20px;
  line-height: 28px;
`;

export const CaptionText = styled(SubtitleText)`
  font-size: 14px;
  padding-horizontal: 24px;
  text-align: left;
`;

export const Unfilled = styled(RectButton)`
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  width: 24px;
  height: 24px;
  border-width: 2px;
`;

export const Filled = styled(View)`
  border-radius: 10px;
  width: 20px;
  height: 20px;
`;

export const Field = ({
  className,
  useIcon,
  isPasswordField,
  containerStyle,
  disabled,
  textInputRef = null,
  ...textInputProps
}) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <FieldContainer
      className={className}
      style={{
        backgroundColor: disabled
          ? themeColors.textPrimaryInactive
          : themeColors.backgroundColor,
        borderColor: themeColors.systemBorderColor,
        ...containerStyle
      }}
    >
      {useIcon && (
        <MaterialIcon
          name={isPasswordField ? 'lock-outline' : 'mail-outline'}
          size={24}
          color={themeColors.slateGray}
          style={{ paddingVertical: 12, marginHorizontal: 12 }}
        />
      )}
      <FieldInput
        ref={textInputRef}
        secureTextEntry={isPasswordField}
        placeholderTextColor={themeColors.textPrimaryInactive}
        selectionColor={AmbiColors.ambiBlue}
        style={{
          color: themeColors.textPrimary,
          opacity: 0.87,
          marginHorizontal: !useIcon ? 16 : 0
        }}
        {...textInputProps}
      />
    </FieldContainer>
  );
};

const ActionButtonContainer = styled(RectButton)`
  height: 48px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

const ActionButtonText = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
`;

export const ActionButton = ({
  title,
  className,
  disabled,
  textStyles,
  containerStyles,
  useWhiteStyle,
  ...touchableProps
}) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const regularBGColor = useWhiteStyle
    ? ThemeConstants.light.backgroundColor
    : AmbiColors.ambiBlue;
  const regularTextColor = useWhiteStyle
    ? AmbiColors.razzmatazz
    : themeColors.body;
  return (
    <ActionButtonContainer
      className={className}
      enabled={!disabled}
      style={{
        backgroundColor: disabled ? themeColors.buttonDisabled : regularBGColor,
        ...containerStyles
      }}
      activeOpacity={0.4}
      rippleColor={AmbiColors.systemBorderColor}
      {...touchableProps}
    >
      <View accessible>
        <ActionButtonText
          style={{
            color: disabled ? ThemeConstants.light.slateGray : regularTextColor,
            ...textStyles
          }}
        >
          {title}
        </ActionButtonText>
      </View>
    </ActionButtonContainer>
  );
};

const LineButtonContainer = styled(RectButton)`
  height: 48px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  flex-direction: row;
`;

const LineButtonText = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
`;

const LineIconButtonText = styled(LineButtonText)`
  line-height: 21px;
  text-align: center;
  flex: 1;
  padding-right: 38px;
`;

export const LineButton = ({
  title,
  disabled,
  containerStyles,
  textStyles,
  useWhiteStyle,
  useIcon,
  ...touchableProps
}) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const regularBorderColor = useWhiteStyle
    ? ThemeConstants.light.backgroundColor
    : AmbiColors.ambiBlue;
  const regularTextColor = useWhiteStyle
    ? ThemeConstants.dark.textPrimary
    : AmbiColors.ambiBlue;
  return (
    <LineButtonContainer
      enabled={!disabled}
      style={{
        borderColor: disabled ? themeColors.buttonDisabled : regularBorderColor,
        ...containerStyles
      }}
      activeOpacity={0.6}
      rippleColor={
        containerStyles ? containerStyles.borderColor : regularBorderColor
      }
      underlayColor={
        containerStyles ? containerStyles.borderColor : regularBorderColor
      }
      {...touchableProps}
    >
      {useIcon && (
        <MaterialIcon
          name={useIcon}
          size={22}
          color={disabled ? themeColors.buttonDisabled : AmbiColors.ambiBlue}
          style={{ paddingVertical: 12, paddingLeft: 16 }}
        />
      )}
      <LineButtonText
        as={useIcon ? LineIconButtonText : LineButtonText}
        style={{
          color: disabled ? themeColors.buttonDisabled : regularTextColor,
          ...textStyles
        }}
      >
        {title}
      </LineButtonText>
    </LineButtonContainer>
  );
};

const LineSeparatorWrapper = styled(View)`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin: 18px 0;
`;

const LineSeparatorContainer = styled(View)`
  border-bottom-width: 1.5px;
  opacity: ${({ opacity }) => opacity || 0.8};
  flex: 1;
  padding-top: 4px;
`;

const LineSeparatorText = styled(Text)`
  font-family: Circular-Bold;
  font-size: 15px;
  letter-spacing: 0.4px;
  padding: 0 4px;
`;

export const LineSeparator = ({ opacity = 0.8, fullWidth = false }) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <LineSeparatorWrapper
      style={{
        paddingHorizontal: fullWidth ? 0 : 16
      }}
    >
      <LineSeparatorContainer
        style={{ borderBottomColor: themeColors.systemBorderColor }}
        opacity={opacity}
      />
      <LineSeparatorText style={{ color: themeColors.slateGray }}>
        {' '}
        or{' '}
      </LineSeparatorText>
      <LineSeparatorContainer
        style={{ borderBottomColor: themeColors.systemBorderColor }}
        opacity={opacity}
      />
    </LineSeparatorWrapper>
  );
};

export const LeftHeaderButton = ({ route, navigation, shouldCloseScreen }) => {
  const dispatch = useDispatch();

  const handleNavigateBack = async () => {
    const shouldResetErrors = route.params?.resetErrors || false;
    if (shouldResetErrors) {
      await dispatch({
        type: AUTH_ACTION_TYPES.RESET_ALL_ERRORS
      });
      navigation.setParams({
        resetErrors: false
      });
    }
    if (shouldCloseScreen) {
      navigation.pop();
    } else {
      navigation.goBack();
    }
  };

  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <IconHeaderButtons useLeftHeader>
      <Item
        iconName={shouldCloseScreen ? 'close' : 'arrow-back'}
        color={themeColors.textPrimary}
        onPress={handleNavigateBack}
      />
    </IconHeaderButtons>
  );
};

export const Spacer = styled(View)`
  height: ${({ height }) => height || 0};
  width: ${({ width }) => width || 0};
`;

// atleast one uppercase, one lowercase, one number, one special character and min length of 8 .
export function validatePassword(inputPassword) {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,14}$/g;
  return regex.test(inputPassword);
}

export const emailIsColumbia = email => {
  const emailDomain = email.split('@').pop();
  return emailDomain.includes('columbia');
  // return ['columbia.edu', 'gsb.columbia.edu'].includes(emailDomain);
};

export const authConnectionsAllowed = ['google-oauth2', 'apple'];

export const columbiaSubdomains = {
  'ieore-columbia': 'Industrial Engineering & Operations Research (IEORE)',
  'sps-columbia': 'School of Professional Studies',
  'seas-columbia': 'School of Engineering & Applied Science'
};
