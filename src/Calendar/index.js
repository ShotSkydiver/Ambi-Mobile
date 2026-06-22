/**
 * Calendar
 */
/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StatusBar } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

// components
import CalendarAgenda from './Agenda';
import CalendarListDropdown from './CalendarListDropdown';
import { FullScreenLoader } from '../shared/Loader';
import { HeaderRight, HeaderCenter, HeaderLeft } from './CalendarHeader';

// redux
import {
  setNewSelectedDay as setNewSelectedDayActionCreator,
  setNewSelectedMonth as setNewSelectedMonthActionCreator,
  loadCalendarsAndEvents
} from './redux/actions';
import { dateToString } from './redux/reducer';

const CalendarContainer = styled(View)`
  flex: 1;
`;

const Calendar = ({ navigation }) => {
  const dispatch = useDispatch();
  const setNewSelectedDay = useCallback(
    day => dispatch(setNewSelectedDayActionCreator(day)),
    []
  );
  const setNewSelectedMonth = useCallback(
    day => dispatch(setNewSelectedMonthActionCreator(day)),
    []
  );
  const {
    selectedDay,
    todayDaySelected,
    calendarDropdownOpen,
    events: allEvents,
    loading
  } = useSelector(state => state.calendar);

  const [events, setEvents] = useState(null);
  const calendar = useRef();
  const agenda = useRef();
  const scrollTimeout = useRef();

  const theme = useTheme();
  const {
    legacy: themeColors,
    legacy: { backgroundColor, textPrimary: colorTextPrimary }
  } = theme;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (
        <HeaderCenter navigation={navigation} themeColors={themeColors} />
      ),
      headerStyle: { backgroundColor },
      headerTranslucent: true,
      headerHideShadow: true,
      headerTintColor: colorTextPrimary,
      headerLeft: () => (
        <HeaderLeft
          style={{ marginLeft: 10 }}
          navigation={navigation}
          themeColors={themeColors}
        />
      ),
      headerRight: () => (
        <HeaderRight
          style={{ marginRight: 10 }}
          navigation={navigation}
          themeColors={themeColors}
        />
      ),
      headerBackTitleVisible: false
    });
  }, [navigation, themeColors, backgroundColor, colorTextPrimary]);

  const loadEvents = day => {
    const nextEvents = allEvents;
    for (let i = -15; i < 85; i++) {
      const timeStr = dateToString(day.timestamp + i * 24 * 60 * 60 * 1000);
      const existingEvents = nextEvents[timeStr];
      if (!existingEvents) {
        nextEvents[timeStr] = [];
      } else {
        nextEvents[timeStr] = existingEvents;
      }
    }
    return allEvents;
  };

  useEffect(() => {
    loadCalendarsAndEvents()(dispatch);
  }, []);

  useEffect(() => {
    if (todayDaySelected && agenda && agenda.current) {
      agenda.current.chooseDay(selectedDay, false);
    }
  }, [selectedDay]);

  const handleLoadItemsForMonth = day => {
    setNewSelectedMonth(day);
    setEvents(loadEvents(day));
  };

  // Handles agenda day change
  const handleDayChange = day => {
    setNewSelectedDay(day);
    calendar.current && calendar.current.scrollToDay(day, 0, false);
  };

  // This is directly taken from the source for
  // react-native-calendar, in order to make sure
  // we load data necessary to scroll to on selection.
  const handleVisibleMonthsChange = months => {
    if (events) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        handleLoadItemsForMonth(months[0]);
      }, 200);
    }
  };

  // Handles dropdown calendar day press
  const handleDayPress = day => {
    setNewSelectedDay(day);
    if (agenda && agenda.current) {
      agenda.current.chooseDay(day, false);
    }
  };

  return (
    <CalendarContainer>
      {loading && <FullScreenLoader text="loading..." />}
      {calendarDropdownOpen && (
        <CalendarListDropdown
          ref={calendar}
          onDayPress={handleDayPress}
          onVisibleMonthsChange={handleVisibleMonthsChange}
        />
      )}
      {!loading && (
        <CalendarAgenda
          ref={agenda}
          events={events}
          onDayChange={handleDayChange}
          onLoadItemsForMonth={handleLoadItemsForMonth}
        />
      )}
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
      />
    </CalendarContainer>
  );
};

export default Calendar;
