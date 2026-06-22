import { ambiApi } from '../../models/AmbiApi';

export const LOAD_CALENDARS = 'LOAD_CALENDARS';
export const LOAD_EVENTS = 'LOAD_EVENTS';
export const LOAD_EVENTS_ERROR = 'LOAD_EVENTS_ERROR';
export const SET_NEW_SELECTED_DAY = 'SET_NEW_SELECTED_DAY';
export const SET_NEW_SELECTED_MONTH = 'SET_NEW_SELECTED_MONTH';
export const TODAY_SELECTED = 'TODAY_SELECTED';
export const CALENDAR_RESET = 'CALENDAR_RESET';
export const CALENDAR_DROPDOWN_TOGGLED = 'CALENDAR_DROPDOWN_TOGGLED';

export function loadCalendarsAndEvents() {
  return async dispatch => {
    try {
      const response = await ambiApi.getFromApi('/calendar');
      if (response && response.data) {
        dispatch({
          type: LOAD_CALENDARS,
          response
        });
        const { personal, classes, groups, communities } = response.data;
        const calendarIds = [
          ...personal,
          ...classes,
          ...groups,
          ...communities
        ].map(({ id }) => id);
        const eventsResponse = await ambiApi.getFromApi(
          `/calendar/events?calendarIds=${calendarIds}`
        );
        if (eventsResponse && eventsResponse.data) {
          dispatch({
            type: LOAD_EVENTS,
            response: eventsResponse
          });
        } else {
          dispatch({ type: LOAD_EVENTS_ERROR });
        }
      }
    } catch (err) {
      console.warn('error loading calendars: ', err);
      dispatch({ type: LOAD_EVENTS_ERROR });
    }
  };
}

export function setNewSelectedDay(day) {
  return {
    type: SET_NEW_SELECTED_DAY,
    day
  };
}

export function setNewSelectedMonth(day) {
  return {
    type: SET_NEW_SELECTED_MONTH,
    day
  };
}

export function todaySelected() {
  return {
    type: TODAY_SELECTED
  };
}

export function calendarDropdownToggled() {
  return {
    type: CALENDAR_DROPDOWN_TOGGLED
  };
}

export function calendarReset() {
  return {
    type: CALENDAR_RESET
  };
}
