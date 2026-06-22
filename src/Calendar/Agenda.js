/**
 * Agenda
 */
/* eslint-disable no-underscore-dangle */
import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';
import { Agenda } from 'react-native-calendars';
import i18n from 'format-message';
import moment from 'moment';

// components
import Event from './Event';

// constants
import { AmbiColors } from '../shared/contexts/themeContext';

const { ambiBlue: colorBlue, ambiDarkPurple: colorDarkPurple } = AmbiColors;
const today = new Date().toISOString().split('T')[0];
const todayDate = moment(today);

const CalendarAgendaContainer = styled(View)`
  flex: 1;
  flex-shrink: 0;
`;

const EmptyDate = styled(View)`
  flex: 1;
  margin-top: 24px;
  justify-content: center;
`;

const EmptyDateText = styled(Text)`
  font-size: 14px;
  font-family: Circular-Medium;
`;

const Empty = styled(View)`
  height: 100%;
  align-self: center;
  justify-content: center;
`;

const StyledDay = styled(View)`
  width: 56px;
  margin-top: 18px;
  align-self: flex-start;
  align-items: center;
  flex-direction: column;
`;

const StyledDayOfWeek = styled(Text)`
  color: ${({ color }) => color || colorDarkPurple};
  font-size: 14px;
  text-align: center;
  font-family: Circular-Bold;
  line-height: 24px;
  text-transform: uppercase;
`;

const StyledDayOfMonth = styled(Text)`
  color: ${({ color }) => color || colorDarkPurple};
  font-size: 22px;
  text-align: center;
  font-family: Circular-Bold;
  line-height: 24px;
`;

const CalendarAgenda = forwardRef(
  ({ onDayChange, onLoadItemsForMonth, events }, ref) => {
    const theme = useTheme();
    const {
      legacy: { body: colorBody, textPrimary: colorTextPrimary }
    } = theme;

    const _rowHasChanged = (r1, r2) => {
      return r1.title !== r2.title;
    };

    const _getColorDayOfWeek = type => {
      switch (type) {
        case 'today':
          return colorBlue;
        case 'future':
          return colorDarkPurple;
        case 'past':
          return colorDarkPurple;
        default:
          return colorDarkPurple;
      }
    };

    const _getColorDayOfMonth = type => {
      switch (type) {
        case 'today':
          return colorBlue;
        case 'future':
          return colorTextPrimary;
        case 'past':
          return colorDarkPurple;
        default:
          return colorDarkPurple;
      }
    };

    const _renderDay = day => {
      if (!day) {
        return <StyledDay />;
      }
      const date = moment(day.dateString);
      let type = 'past';
      if (day.dateString === today) {
        type = 'today';
      } else if (+date >= +todayDate) {
        type = 'future';
      }
      return (
        <StyledDay>
          <StyledDayOfWeek
            color={_getColorDayOfWeek(type)}
            allowFontScaling={false}
          >
            {i18n.date(date, 'E')}
          </StyledDayOfWeek>
          <StyledDayOfMonth
            color={_getColorDayOfMonth(type)}
            allowFontScaling={false}
          >
            {i18n.date(date, 'd')}
          </StyledDayOfMonth>
        </StyledDay>
      );
    };

    const _renderEvent = (item, firstItem) => (
      <Event event={item} isFirst={firstItem} />
    );

    const _renderEmptyDate = () => {
      return (
        <EmptyDate>
          <EmptyDateText style={{ color: colorTextPrimary }}>
            {i18n('No events planned for today')}
          </EmptyDateText>
        </EmptyDate>
      );
    };

    const _renderEmptyEvents = () => {
      return (
        <Empty>
          <EmptyDateText style={{ color: colorTextPrimary }}>
            {i18n('No events yet..!')}
          </EmptyDateText>
        </Empty>
      );
    };

    return (
      <CalendarAgendaContainer>
        <Agenda
          ref={ref}
          items={events}
          theme={{
            'stylesheet.agenda.main': {
              header: {
                opacity: 0,
                height: 0
              },
              weekdays: {
                height: 0,
                padding: 0
              },
              weekday: {
                height: 0,
                opacity: 0
              },
              reservations: {
                backgroundColor: colorBody
              }
            },

            'stylesheet.agenda.list': {
              dayNum: {
                fontWeight: 'bold'
              },
              dayText: {
                fontWeight: 'bold'
              }
            },
            agendaDayTextColor: colorTextPrimary,
            agendaDayNumColor: colorTextPrimary,
            agendaTodayColor: colorBlue
          }}
          loadItemsForMonth={onLoadItemsForMonth}
          selected={today}
          renderItem={_renderEvent}
          renderEmptyDate={_renderEmptyDate}
          renderEmptyData={_renderEmptyEvents}
          rowHasChanged={_rowHasChanged}
          onDayChange={onDayChange}
          renderDay={_renderDay}
        />
      </CalendarAgendaContainer>
    );
  }
);

CalendarAgenda.displayName = 'CalendarAgenda';

export default CalendarAgenda;
