import {
  UPDATE_CURRENT_SPACE,
  UPDATE_SPACES,
  DELETE_SPACE,
  DELETE_SPACE_MEMBER,
  UPDATE_CLASSES,
  UPDATE_GROUPS,
  UPDATE_COMMUNITIES
} from './actions';

const initialState = {
  currentSpaceInView: {},
  classes: {},
  groups: {},
  communities: {}
};

export function spacesReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SPACES:
      return {
        ...state,
        classes: action.classes || state.classes,
        groups: action.groups || state.groups,
        communities: action.communities || state.communities
      };

    case UPDATE_CURRENT_SPACE:
      const { spaceInfo } = action;
      const { id, type } = spaceInfo;
      const newState = {
        ...state,
        currentSpaceInView: spaceInfo
      };
      if (type === 'group') {
        newState.groups[id] = spaceInfo;
      } else if (type === 'class') {
        newState.classes[id] = spaceInfo;
      } else {
        newState.communities[id] = spaceInfo;
      }
      return newState;

    case UPDATE_CLASSES:
      // remove repetitive elements
      const newClasses = {};
      Object.keys(action.classes).forEach(key => {
        if (!state.classes[key]) {
          newClasses[key] = { ...action.classes[key] };
        }
      });

      return {
        ...state,
        classes: {
          ...state.classes,
          ...newClasses
        }
      };

    case UPDATE_GROUPS:
      // remove repetitive elements
      const newGroups = {};
      Object.keys(action.groups).forEach(key => {
        if (!state.groups[key]) {
          newGroups[key] = { ...action.groups[key] };
        }
      });

      return {
        ...state,
        groups: {
          ...state.groups,
          ...newGroups
        }
      };

    case UPDATE_COMMUNITIES:
      // remove repetitive elements
      const newCommunities = {};
      Object.keys(action.communities).forEach(key => {
        if (!state.communities[key]) {
          newCommunities[key] = { ...action.communities[key] };
        }
      });

      return {
        ...state,
        communities: {
          ...state.communities,
          ...newCommunities
        }
      };

    case DELETE_SPACE: {
      const isGroup = action.spaceType === 'group';
      const spaces = isGroup ? state.groups : state.classes;
      delete spaces[action.spaceId];
      return {
        ...state,
        currentSpaceInView: {},
        [isGroup ? 'groups' : 'classes']: spaces
      };
    }

    case DELETE_SPACE_MEMBER: {
      const isGroup = action.spaceType === 'group';
      const spaces = isGroup ? state.groups : state.communities;
      delete spaces[action.spaceId];
      return {
        ...state,
        currentSpaceInView: {},
        [isGroup ? 'groups' : 'communities']: spaces
      };
    }
    default:
      return state;
  }
}
