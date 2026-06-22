import React, { forwardRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import i18n from 'format-message';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { useTheme } from '@react-navigation/native';

// constants
import { AmbiColors } from '../shared/contexts/themeContext';

const { ambiBlue: colorBlue, ambiWhite: colorWhite } = AmbiColors;

// TODO: Figure out what languages besides English should see for
// headers. A single character may not be enough for other
// languages. One option is to use moment's `weekdaysMin`, which
// would be two-characters for each language, already done for us.
LocaleConfig.defaultLocale = 'en';
const localeData = moment.localeData(LocaleConfig.defaultLocale);
LocaleConfig.locales.en = {
  monthNames: localeData.months(),
  monthNamesShort: localeData.monthsShort(),
  dayNames: localeData.weekdays(),
  dayNamesShort: localeData.weekdaysShort().map(w => w[0]),
  today: i18n('Today')
};

const CalendarListContainer = styled(View)`
  height: 280px;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-color: #ddd;
`;

const CalendarListDropdown = forwardRef(
  ({ onVisibleMonthsChange, onDayPress }, ref) => {
    const selectedMonth = useSelector(state => state.calendar.selectedMonth);
    const selectedDay = useSelector(state => state.calendar.selectedDay);

    const theme = useTheme();
    const {
      legacy: { textPrimary: colorTextPrimary, backgroundColor }
    } = theme;

    return (
      <CalendarListContainer>
        <CalendarList
          ref={ref}
          horizontal
          onVisibleMonthsChange={onVisibleMonthsChange}
          pagingEnabled
          hideExtraDays={false}
          onDayPress={onDayPress}
          current={selectedMonth}
          markedDates={{
            [selectedDay.dateString]: { selected: true }
          }}
          theme={{
            calendarBackground: backgroundColor,
            'stylesheet.calendar.header': {
              header: {
                height: 0
              },
              week: {
                marginTop: 16,
                flexDirection: 'row',
                justifyContent: 'space-around'
              },
              dayHeader: {
                width: 32,
                color: AmbiColors.ambiLightBlue,
                fontSize: 14,
                marginTop: 2,
                textAlign: 'center',
                fontFamily: 'Circular-Book',
                marginBottom: 7
              }
            },
            'stylesheet.day.basic': {
              text: {
                color: colorTextPrimary,
                fontSize: 16,
                marginTop: Platform.OS === 'android' ? 4 : 6,
                fontFamily: 'Circular-Book',
                backgroundColor: 'transparent'
              },
              alignedText: {
                marginTop: Platform.OS === 'android' ? 4 : 6
              },
              selected: {
                borderRadius: 16,
                backgroundColor: colorBlue
              },
              selectedText: {
                color: colorWhite,
                backgroundColor: 'transparent'
              },
              today: {
                borderRadius: 16,
                backgroundColor: 'rgba(2, 158, 226, 0.2)'
              },
              todayText: {
                color: colorBlue,
                backgroundColor: 'transparent'
              },
              disabledText: {
                color: '#8A90A2'
              }
            }
          }}
        />
      </CalendarListContainer>
    );
  }
);

CalendarListDropdown.displayName = 'CalendarListDropdown';

export default CalendarListDropdown;
