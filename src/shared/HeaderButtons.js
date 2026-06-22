import * as React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import { useTheme } from '@react-navigation/native';
import AzIcon from './images/icon_az.svg';

// Note: react-native-vector-icon/Ionicon based icons are not displaying on android when used with
// react-native-header-buttons. Reason's unknown. So let's use MaterialIcons instead from now.

const IconHeaderButton = props => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const IconRight = props.useMaterialCommunityIcons
    ? MaterialCommunityIcon
    : MaterialIcon;

  return (
    <HeaderButton
      color={themeColors.textPrimary}
      {...props}
      onPress={props.disabled ? undefined : props.onPress}
      buttonStyle={{
        opacity: props.disabled ? 0.6 : 1,
        fontWeight: props.actionable ? '600' : '400',
        marginHorizontal: props.manualInset ? 16 : 2
      }}
      IconComponent={props.useIconAz ? AzIcon : IconRight}
      iconSize={25}
    />
  );
};

export const IconHeaderButtons = ({ useLeftHeader = true, ...props }) => {
  return (
    <HeaderButtons
      left={useLeftHeader}
      HeaderButtonComponent={IconHeaderButton}
      {...props}
    />
  );
};

export {
  Item,
  HiddenItem,
  OverflowMenu
} from 'react-navigation-header-buttons';
