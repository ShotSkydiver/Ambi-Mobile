import { ambiApi } from '../models/AmbiApi';
import uploadFile from '../shared/utils/uploadFile';

const spaceType = {
  CLASS: 'class',
  GROUP: 'group',
  COMMUNITY: 'community'
};

const spaceTypePlural = {
  class: 'classes',
  group: 'groups',
  community: 'communities'
};

class SpacesService {
  static async createSpaceItem(spaceInfo, type) {
    let newSpaceItem;
    try {
      const isGroup = type === spaceType.GROUP;
      const info = {};
      if (isGroup) {
        info.group = spaceInfo;
      }
      newSpaceItem = await ambiApi.postToApi({
        url: `${isGroup ? '/groups' : '/classes'}`,
        body: info
      });
    } catch (err) {
      console.warn(err);
    }
    return newSpaceItem.data;
  }

  static async updateSpaceItem(spaceInfo, type) {
    let updatedSpaceItem;
    try {
      const info = {};
      if (type === spaceType.GROUP) {
        info.group = spaceInfo;
      } else if (type === spaceType.COMMUNITY) {
        info.community = spaceInfo;
      }
      updatedSpaceItem = await ambiApi.postToApi({
        url: `/${spaceTypePlural[type]}/${spaceInfo.id}`,
        body: info
      });
    } catch (err) {
      console.warn(err);
    }
    return updatedSpaceItem.data;
  }

  static async deleteSpace(id, type) {
    let result;
    try {
      result = await ambiApi.deleteFromApi({
        url: `/${spaceTypePlural[type]}/${id}`
      });
    } catch (err) {
      console.warn(err);
    }
    return result.data.success;
  }

  static async deleteSpaceMember(id, type, member) {
    const { id: userId } = member;
    try {
      await ambiApi.deleteFromApi({
        url: `/${spaceTypePlural[type]}/${id}/members/${userId}`
      });
    } catch (err) {
      console.warn(err);
    }
  }

  static async getSpaces(type, page = 1) {
    let spaces;
    try {
      spaces = await ambiApi.getFromApi(`/${type}/?page=${page}&wd=true`);
    } catch (err) {
      console.warn(err);
    }
    return spaces.data;
  }

  static async getSpaceItemById(id, type) {
    let spaceItem;
    try {
      spaceItem = await ambiApi.getFromApi(`/${spaceTypePlural[type]}/${id}`);
    } catch (err) {
      console.warn(err);
    }
    return spaceItem.data;
  }

  static async getSpaceMembers(id, type) {
    let spaceMembers;
    try {
      spaceMembers = await ambiApi.getFromApi(
        `/${spaceTypePlural[type]}/${id}/members`
      );
    } catch (err) {
      console.warn(err);
    }
    return spaceMembers.data;
  }

  static async addMember(id, type, member) {
    let newMember;
    try {
      newMember = await ambiApi.postToApi({
        url: `/${spaceTypePlural[type]}/${id}/members`,
        body: {
          member,
          role: 'member'
        }
      });
    } catch (err) {
      console.warn(err);
    }
    return newMember.data;
  }

  static async uploadMedia(type, file, callbackEvents = {}) {
    let uploadedMedia;
    try {
      uploadedMedia = await uploadFile({
        url: `/${spaceTypePlural[type]}/media`,
        file,
        events: callbackEvents
      });
    } catch (err) {
      console.warn(err);
    }
    return uploadedMedia;
  }

  static async getRelatedSpaces(id) {
    let spaceMembers;
    try {
      spaceMembers = await ambiApi.getFromApi(
        `/communities/${id}/related-spaces`
      );
    } catch (err) {
      console.warn(err);
    }
    return spaceMembers.data;
  }

  static async joinRelatedSpaces(uniqueIdentifier, isPrivate) {
    let result;
    let url = `/groups/${uniqueIdentifier}/join`;
    if (isPrivate) {
      url = `/groups/${uniqueIdentifier}/join/request`;
    }
    try {
      result = await ambiApi.postToApi({
        url,
        body: {}
      });
    } catch (err) {
      console.warn(err);
    }
    return result.data;
  }
}

export default SpacesService;
