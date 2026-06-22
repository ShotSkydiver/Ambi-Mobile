import { ambiApi } from './AmbiApi';

class User {
  constructor(response) {
    if (response) {
      this.setFromResponse(response);
    }
    // Cheap cache. Probably better to use LocalStorage.
    this.abilities = {};
  }

  static getUrlFromIdentifier(uniqueIdentifier) {
    return `/users/${uniqueIdentifier}`;
  }

  async fetchObjectAbilities(scope, id) {
    const cacheKey = `${scope}::${id}`;
    const cachedAbilities = this.abilities[cacheKey];
    if (cachedAbilities) return cachedAbilities;

    let response;
    try {
      response = await ambiApi.getFromApi(
        `/users/${this.id}/permissions/${scope}/for/${id}`
      );
    } catch (err) {
      throw err;
    }
    this.abilities[cacheKey] = response.data;
    return response.data;
  }

  async fetchAbilities(scope) {
    const cachedAbilities = this.abilities[scope];
    if (cachedAbilities) return cachedAbilities;

    let response;
    try {
      response = await ambiApi.getFromApi(
        `/users/${this.id}/permissions/${scope}`
      );
    } catch (err) {
      throw err;
    }
    this.abilities[scope] = response.data;
    return response.data;
  }

  setFromResponse(response) {
    Object.assign(this, response);
  }

  getName() {
    if (this.profile && (this.profile.firstName || this.profile.lastName)) {
      return `${this.profile.firstName} ${this.profile.lastName}`.trim();
    }
    if (this.firstName || this.lastName) {
      return `${this.firstName} ${this.lastName}`.trim();
    }
    if (this.displayName) {
      return `${this.displayName}`;
    }
    return this.email;
  }

  getFirstName() {
    if (this.profile && this.profile.firstName) {
      return this.profile.firstName;
    }
    return this.getName();
  }

  getAvatarUrl() {
    const avatarMedia = this.profile
      ? this.profile.avatarMedia
      : this.avatarMedia;
    if (avatarMedia && avatarMedia.links) {
      return avatarMedia.links.content;
    }
    if (this.profile && this.profile.avatarUrl) {
      return this.profile.avatarUrl;
    }
    if (this.avatarUrl) {
      return this.avatarUrl;
    }
    return null;
  }

  getUniqueIdentifier() {
    if (this.uniqueIdentifier) {
      return this.uniqueIdentifier;
    }
    if (!this.clientMemberships || this.clientMemberships.length === 0) {
      console.warn('User is missing clientMemberships');
      return 'anonymous';
    }
    return this.clientMemberships[0].uniqueIdentifier;
  }

  getUrl() {
    return User.getUrlFromIdentifier(this.getUniqueIdentifier());
  }

  isAdmin() {
    if (!this.clientMemberships || !Array.isArray(this.clientMemberships)) {
      return false;
    }
    return (
      this.clientMemberships.filter(x => x.role && x.role.alias === 'superuser')
        .length > 0
    );
  }

  isRegistered() {
    return (
      this.profile &&
      this.profile.onboarding &&
      this.profile.onboarding.isregistered
    );
  }
}

const CurrentUser = new User();

export { CurrentUser, User };
