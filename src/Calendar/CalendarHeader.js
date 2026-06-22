import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import i18n from 'format-message';
import { useDispatch, useSelector } from 'react-redux';

// components
import FeatherIcon from 'react-native-vector-icons/Feather';

// redux
import {
  todaySelected,
  calendarReset,
  calendarDropdownToggled
} from './redux/actions';

const HeaderTitleButton = styled(TouchableOpacity)`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const HeaderText = styled(Text)`
  color: #030303;
  font-size: 17px;
  font-family: Circular-Bold;
`;

const TodayButtonIcon = styled(TouchableOpacity)``;

/**
 * HeaderLeft component
 */
export const HeaderLeft = ({ style, navigation, themeColors }) => {
  const dispatch = useDispatch();
  return (
    <HeaderTitleButton
      onPress={() => {
        navigation.goBack();
        dispatch(calendarReset());
      }}
      style={style}
    >
      <FeatherIcon
        name="chevron-left"
        size={17}
        style={{ color: themeColors.textPrimary }}
      />
      <HeaderText style={{ color: themeColors.textPrimary }}>
        {i18n('More')}
      </HeaderText>
    </HeaderTitleButton>
  );
};

HeaderLeft.propTypes = {
  style: PropTypes.shape(),
  navigation: PropTypes.shape().isRequired,
  themeColors: PropTypes.shape({
    textPrimary: PropTypes.string
  }).isRequired
};

HeaderLeft.defaultProps = {
  style: {}
};

/**
 * HeaderCenter component
 */
export const HeaderCenter = ({ style, themeColors }) => {
  const dispatch = useDispatch();
  const selectedMonth = useSelector(state => state.calendar.selectedMonth);
  const [calendarMonthDisplay, setCalendarMonth] = useState(true);
  return (
    <HeaderTitleButton
      style={{ ...style, paddingTop: 5 }}
      onPress={() => {
        setCalendarMonth(!calendarMonthDisplay);
        dispatch(calendarDropdownToggled());
      }}
    >
      <HeaderText style={{ color: themeColors.textPrimary }}>
        {moment(selectedMonth.timestamp).format('MMMM')}
      </HeaderText>
      <FeatherIcon
        name={calendarMonthDisplay ? 'chevron-down' : 'chevron-up'}
        size={17}
        style={{ marginTop: 5, color: themeColors.textPrimary }}
      />
    </HeaderTitleButton>
  );
};

HeaderCenter.propTypes = {
  style: PropTypes.shape(),
  themeColors: PropTypes.shape({
    textPrimary: PropTypes.string
  }).isRequired
};

HeaderCenter.defaultProps = {
  style: {}
};

/**
 * HeaderRight component
 */
export const HeaderRight = ({ style, themeColors }) => {
  const dispatch = useDispatch();
  return (
    <TodayButtonIcon
      style={style}
      onPress={() => {
        dispatch(todaySelected());
      }}
    >
      <FeatherIcon
        name="calendar"
        size={24}
        style={{ color: themeColors.textPrimary }}
      />
    </TodayButtonIcon>
  );
};

HeaderRight.propTypes = {
  style: PropTypes.shape(),
  themeColors: PropTypes.shape({
    textPrimary: PropTypes.string
  }).isRequired
};

HeaderRight.defaultProps = {
  style: {}
};
