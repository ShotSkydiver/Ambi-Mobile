import {
  SET_NEW_SELECTED_DAY,
  SET_NEW_SELECTED_MONTH,
  TODAY_SELECTED,
  CALENDAR_DROPDOWN_TOGGLED,
  LOAD_CALENDARS,
  LOAD_EVENTS,
  LOAD_EVENTS_ERROR,
  CALENDAR_RESET
} from './actions';

// Initially selected day is today's date
const todayDateString = new Date().toISOString().split('T')[0];

const calendarInitialState = {
  allCalendars: {
    personal: [],
    classes: [],
    groups: [],
    communities: []
  },
  loading: true,
  events: {},
  selectedDay: { dateString: todayDateString },
  selectedMonth: { dateString: todayDateString },
  todayDaySelected: true,
  calendarDropdownOpen: false
};

export function dateToString(time) {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}

export function mapEvents(allEvents) {
  const mappedEvents = {};
  for (let i = 0; i < allEvents.length; i++) {
    const eventDate = allEvents[i].startDatetime;
    const eventDateStr = dateToString(eventDate);
    const eventToDisplay = {
      height: Math.max(50, Math.floor(Math.random() * 150)),
      ...allEvents[i]
    };
    if (!mappedEvents[eventDateStr]) {
      mappedEvents[eventDateStr] = [{ ...eventToDisplay, isFirst: true }];
    } else {
      mappedEvents[eventDateStr].push(eventToDisplay);
    }
  }
  return mappedEvents;
}

export function CalendarReducer(state = calendarInitialState, action) {
  switch (action.type) {
    case LOAD_CALENDARS:
      return { ...state, allCalendars: action.response.data };
    case LOAD_EVENTS:
      return {
        ...state,
        events: { ...mapEvents(action.response.data) },
        loading: false
      };
    case LOAD_EVENTS_ERROR:
      return {
        ...state,
        loading: false
      };
    case SET_NEW_SELECTED_DAY: {
      return {
        ...state,
        selectedDay: action.day,
        selectedMonth: action.day,
        todayDaySelected: action.day.dateString === todayDateString
      };
    }
    case SET_NEW_SELECTED_MONTH: {
      return {
        ...state,
        selectedMonth: action.day
      };
    }
    case TODAY_SELECTED: {
      const { selectedDay, selectedMonth } = state;
      if (
        selectedDay.dateString === todayDateString &&
        selectedMonth.dateString === todayDateString
      ) {
        return state;
      }
      return {
        ...state,
        selectedDay: { dateString: todayDateString },
        selectedMonth: { dateString: todayDateString },
        todayDaySelected: true
      };
    }
    case CALENDAR_DROPDOWN_TOGGLED: {
      return {
        ...state,
        calendarDropdownOpen: !state.calendarDropdownOpen
      };
    }
    case CALENDAR_RESET: {
      return { ...calendarInitialState };
    }
    default:
      return state;
  }
}
