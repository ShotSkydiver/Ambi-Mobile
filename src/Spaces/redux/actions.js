import SpacesService from '../SpacesService';
import UserService from '../../Profile/UserService';

import { normalizeById, normalizeByStringId } from '../../shared/utils/helpers';

export const UPDATE_CURRENT_SPACE = 'UPDATE_CURRENT_SPACE';
export const UPDATE_SPACES = 'UPDATE_SPACES';
export const DELETE_SPACE = 'DELETE_SPACE';
export const DELETE_SPACE_MEMBER = 'DELETE_SPACE_MEMBER';
export const TOGGLE_LOADING_SCREEN = 'TOGGLE_LOADING_SCREEN';
export const UPDATE_CLASSES = 'UPDATE_CLASSES';
export const UPDATE_GROUPS = 'UPDATE_GROUPS';
export const UPDATE_COMMUNITIES = 'UPDATE_COMMUNITIES';

const urlToSpace = {
  classes: {
    name: 'class',
    actionType: UPDATE_CLASSES
  },
  groups: {
    name: 'group',
    actionType: UPDATE_GROUPS
  },
  communities: {
    name: 'community',
    actionType: UPDATE_COMMUNITIES
  }
};

const getAnySpace = async (apiUrl, page) => {
  const list = await SpacesService.getSpaces(apiUrl, page);
  return list.map(space => ({ ...space, type: urlToSpace[apiUrl].name }));
};

export function actionGetAnySpace(apiUrl, page = 1) {
  return async dispatch => {
    try {
      const spaceList = await getAnySpace(apiUrl, page);
      return spaceList.length > 0
        ? dispatch({
            type: urlToSpace[apiUrl].actionType,
            [apiUrl]: normalizeByStringId(spaceList)
          })
        : null;
    } catch (err) {
      console.warn(err);
    }
    return null;
  };
}

export function updateSpaces() {
  return async dispatch => {
    try {
      // get classes
      const classes = await getAnySpace('classes');
      dispatch({ type: UPDATE_SPACES, classes: normalizeById(classes) });

      // get group
      const groups = await getAnySpace('groups');
      dispatch({ type: UPDATE_SPACES, groups: normalizeById(groups) });

      // get communities
      const communities = await getAnySpace('communities');
      dispatch({
        type: UPDATE_SPACES,
        communities: normalizeById(communities)
      });
    } catch (err) {
      console.warn(err);
    }
    return null;
  };
}

export function updateCurrentSpace(spaceInfo, updateWithApi = false) {
  return async dispatch => {
    try {
      const { type } = spaceInfo;
      if (updateWithApi) {
        await SpacesService.updateSpaceItem(spaceInfo, type);
      }
      await dispatch({
        type: UPDATE_CURRENT_SPACE,
        spaceInfo
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function createSpace(spaceInfo, type = 'group') {
  return async dispatch => {
    let newSpace;
    try {
      const uploadedBanner = spaceInfo.coverBannerMedia
        ? await SpacesService.uploadMedia(
            type,
            spaceInfo.coverBannerMedia,
            `${spaceInfo.name}-bannerUrl`
          )
        : null;
      const updatedSpaceInfo = {
        ...spaceInfo,
        coverBannerMediaId:
          uploadedBanner && uploadedBanner.data ? uploadedBanner.data.id : null
      };
      newSpace = await SpacesService.createSpaceItem(updatedSpaceInfo, type);
      const isGroup = type === 'group';
      newSpace.type = isGroup ? 'group' : 'class';
      await dispatch(updateCurrentSpace(newSpace));
    } catch (err) {
      console.error(err);
    }
    return newSpace;
  };
}

// Todo: Delete/hide posts related to this space once deleted.
export function deleteSpace(spaceId, type) {
  return async dispatch => {
    try {
      const isDeleted = await SpacesService.deleteSpace(spaceId, type);
      if (isDeleted) {
        return dispatch({
          type: DELETE_SPACE,
          spaceId,
          spaceType: type
        });
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };
}

export function deleteSpaceMember(spaceId, type, member) {
  return async dispatch => {
    try {
      await SpacesService.deleteSpaceMember(spaceId, type, member);
      return dispatch({
        type: DELETE_SPACE_MEMBER,
        spaceId,
        spaceType: type
      });
    } catch (err) {
      console.error(err);
    }
    return null;
  };
}

export function getSpaceMembers(spaceInfo, type = 'group') {
  return async dispatch => {
    try {
      if (!spaceInfo.members) {
        const members = await SpacesService.getSpaceMembers(spaceInfo.id, type);
        dispatch(
          updateCurrentSpace({
            ...spaceInfo,
            members,
            membersCount: members.length
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function addMemberToSpace(spaceInfo, type = 'group', member) {
  return async dispatch => {
    try {
      let newMember = await SpacesService.addMember(
        spaceInfo.id,
        type.toLowerCase(),
        {
          ...member,
          userId: member.id
        }
      );
      if (!newMember.user.firstName) {
        const user = await UserService.getUserById(newMember.user.id);
        newMember = { ...newMember, user };
      }
      const updatedSpace = {
        ...spaceInfo,
        members: [newMember, ...spaceInfo.members],
        membersCount: spaceInfo.membersCount + 1
      };
      dispatch(updateCurrentSpace(updatedSpace));
    } catch (err) {
      console.error(err);
    }
  };
}

export function getRelatedSpaces(spaceInfo) {
  return async dispatch => {
    try {
      if (spaceInfo && spaceInfo.id) {
        const data = await SpacesService.getRelatedSpaces(spaceInfo.id);
        const { membersCount, relatedSpaces } = data;
        dispatch(
          updateCurrentSpace({
            ...spaceInfo,
            relatedSpaces,
            relatedSpacesCount: relatedSpaces.length,
            membersCountRelatedSpaces: membersCount
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
}
