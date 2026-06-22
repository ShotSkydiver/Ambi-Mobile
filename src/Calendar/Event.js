import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const EventContainer = styled(RectButton)`
  height: 66px;
  margin-right: 16px;
  border-radius: 8px;
  background-color: ${({ bgColor }) => bgColor};
  margin-top: ${props => (props.isFirst ? '24px' : '8px')};
`;

const EventWrapper = styled(View)`
  padding: 12px 16px;
`;

const EventTitle = styled(Text)`
  color: #1c2129;
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const EventTimeLocation = styled(Text)`
  color: #1c2129;
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 18px;
`;

const Event = ({ event, isFirst }) => {
  const navigation = useNavigation();
  const {
    title,
    color: { hexValue },
    startDatetime
  } = event;
  const getEventTimeLocation = () =>
    new Date(startDatetime).toISOString().split('T')[0];
  const navigateToEvent = () => {
    navigation.navigate('SingleEventScreen', { event });
  };
  return (
    <EventContainer
      bgColor={hexValue}
      isFirst={isFirst}
      onPress={navigateToEvent}
    >
      <EventWrapper>
        <EventTitle>{title}</EventTitle>
        <EventTimeLocation>{getEventTimeLocation()}</EventTimeLocation>
      </EventWrapper>
    </EventContainer>
  );
};

Event.displayName = 'Event';

Event.propTypes = {
  event: PropTypes.shape({}).isRequired
};

function areEqual(prevProps, nextProps) {
  return prevProps.event.uniqueIdentifier === nextProps.event.uniqueIdentifier;
}

export default memo(Event, areEqual);
