import React from 'react';
import { Animated, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AmbiColors } from '../shared/contexts/themeContext';

const RightActionButton = styled(RectButton)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const RightActionButtonText = styled(Text)`
  color: #fff;
  font-family: Circular-Bold;
  font-size: 16px;
  padding: 10px;
  text-align: center;
  background-color: transparent;
`;

const SwipeableNotificationRow = ({
  children,
  notification,
  markAsRead,
  markAsHidden,
  swipeableRefs,
  prevOpenedRow,
  setPrevOpened,
  index
}) => {
  const { dateConsumed } = notification;
  const isRead = dateConsumed != null;
  const renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0]
    });
    const pressHandler = () => {
      if (text === 'Mark as read') {
        markAsRead();
      } else if (text === 'Dismiss') {
        markAsHidden();
      }
      if (swipeableRefs[index]) {
        swipeableRefs[index].close();
      }
    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RightActionButton
          style={{ backgroundColor: color }}
          onPress={pressHandler}
        >
          <RightActionButtonText>{text}</RightActionButtonText>
        </RightActionButton>
      </Animated.View>
    );
  };

  const renderRightActions = progress => (
    <View style={{ width: !isRead ? 192 : 96, flexDirection: 'row' }}>
      {!isRead &&
        renderRightAction('Mark as read', AmbiColors.ambiBlue, 192, progress)}
      {renderRightAction('Dismiss', AmbiColors.ambiDarkPurple, 96, progress)}
    </View>
  );

  return (
    <Swipeable
      ref={ref => {
        // eslint-disable-next-line no-param-reassign
        swipeableRefs[index] = ref;
      }}
      friction={1}
      rightThreshold={30}
      overshootFriction={8}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => {
        if (
          prevOpenedRow &&
          prevOpenedRow !== index &&
          swipeableRefs[prevOpenedRow]
        ) {
          swipeableRefs[prevOpenedRow].close();
        }
        if (index !== 0 && swipeableRefs[0]) {
          swipeableRefs[0].close();
        }
        setPrevOpened(index);
      }}
    >
      {children}
    </Swipeable>
  );
};

SwipeableNotificationRow.propTypes = {
  markAsRead: PropTypes.func.isRequired
};

export default SwipeableNotificationRow;
