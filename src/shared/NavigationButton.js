import React from 'react';
import { Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import SpacesIcon from './images/groups.svg';

const styles = StyleSheet.create({
  touchableWrapper: {
    alignItems: 'center',
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

const StyledIcon = styled(Icon)`
  padding-left: 16px;
`;

const StyledContent = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const StyledTitle = styled(Text)`
  flex: 1;
  margin-left: 8px;
  font-size: ${({ size }) => (size === 'small' ? 16 : 18)}px;
  font-family: Circular-Bold;
  line-height: ${({ size }) => (size === 'small' ? 20 : 23)}px;
`;

const StyledChevronIcon = styled(Icon)`
  padding-right: 16px;
`;

const StyledCount = styled(Text)`
  flex: 1;
  text-align: right;
  font-size: ${({ size }) => (size === 'small' ? 16 : 18)}px;
  line-height: ${({ size }) => (size === 'small' ? 18 : 20)}px;
  font-family: Circular-Book;
  margin-right: 8px;
`;

const ButtonContent = ({ iconName, size, title, count }) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <StyledContent>
      {iconName !== 'spaces' ? (
        <StyledIcon name={iconName} size={24} color={themeColors.textPrimary} />
      ) : (
        <SpacesIcon
          width={24}
          height={24}
          fill={themeColors.textPrimary}
          style={{ marginLeft: 15 }}
        />
      )}
      <StyledTitle style={{ color: themeColors.textPrimary }} size={size}>
        {title}
      </StyledTitle>
      {count != null && (
        <StyledCount size={size} style={{ color: themeColors.slateGray }}>
          {count}
        </StyledCount>
      )}
      <StyledChevronIcon
        name="chevron-right"
        size={18}
        style={{ color: themeColors.slateGray }}
      />
    </StyledContent>
  );
};

const NavigationButton = ({
  iconName,
  title,
  onPress,
  noBottomBorder,
  size,
  count
}) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <RectButton
      rippleColor={themeColors.bgColorSemiTransparent}
      underlayColor={themeColors.elementBGColor}
      onPress={onPress}
      style={{ paddingRight: 0 }}
    >
      <TouchableHighlight
        onPress={onPress}
        style={[
          styles.touchableWrapper,
          {
            backgroundColor: themeColors.elementBGColor,
            borderBottomWidth: noBottomBorder ? 0 : 0.5,
            borderColor: themeColors.systemBorderColor,
            height: size === 'small' ? 50 : 56
          }
        ]}
      >
        <ButtonContent
          iconName={iconName}
          title={title}
          size={size}
          count={count}
        />
      </TouchableHighlight>
    </RectButton>
  );
};

NavigationButton.defaultProps = {
  size: 'medium'
};

export default NavigationButton;
