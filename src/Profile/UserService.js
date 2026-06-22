import { ambiApi } from '../models/AmbiApi';

class UserService {
  static async getUserById(userId) {
    try {
      const user = await ambiApi.getFromApi(`/users/${userId}`);
      return user.data;
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  static async updateUserProfile(profile) {
    let updatedProfile;
    try {
      const user = await ambiApi.postToApi({
        url: '/auth/me/profile',
        body: {
          profile
        }
      });
      updatedProfile = user.data.profile;
    } catch (err) {
      console.warn(err);
    }
    return updatedProfile;
  }

  static async getAllUserDevices(userId) {
    let userDevices = { data: null };
    try {
      userDevices = await ambiApi.getFromApi({
        url: `/users/${userId}/devices`
      });
    } catch (err) {
      console.warn(err);
    }
    return userDevices.data;
  }

  static async addNewUserDevice(userId, device) {
    let newDevice = { data: null };
    try {
      newDevice = await ambiApi.postToApi({
        url: `/users/${userId}/devices`,
        body: {
          device
        }
      });
    } catch (err) {
      console.warn(err);
    }
    return newDevice.data;
  }

  static async deleteAllUserDevices(userId) {
    try {
      await ambiApi.deleteFromApi({
        url: `/users/${userId}/devices`
      });
    } catch (err) {
      console.warn(err);
    }
  }

  static async getUserDevice(userId, deviceId) {
    let userDevice;
    try {
      userDevice = await ambiApi.getFromApi({
        url: `/users/${userId}/devices/${deviceId}`
      });
    } catch (err) {
      console.warn(err);
    }
    return userDevice;
  }

  static async getAnyDevice(deviceId) {
    let userDevice = { data: null };
    try {
      userDevice = await ambiApi.getFromApi({
        url: `/users/devices/${deviceId}`
      });
    } catch (err) {
      console.warn(err);
    }
    return userDevice.data;
  }

  static async updateUserDevice(userId, device) {
    let updatedDevice = { data: null };
    try {
      const deviceId = device.uniqueIdentifier;
      updatedDevice = await ambiApi.postToApi({
        url: `/users/${userId}/devices/${deviceId}`,
        body: {
          device
        }
      });
    } catch (err) {
      console.warn(err);
    }
    return updatedDevice.data;
  }

  static async deleteUserDevice(userId, deviceId) {
    let remainingDevices;
    try {
      remainingDevices = await ambiApi.deleteFromApi({
        url: `/users/${userId}/devices/${deviceId}`
      });
    } catch (err) {
      console.warn(err);
    }
    if (remainingDevices) {
      return remainingDevices.data;
    }
    return null;
  }

  static async updateUserPushNotifsSetting(userId, enabled) {
    let updatedUser = { data: null };
    try {
      const shouldEnable = enabled ? 'enable' : 'disable';
      updatedUser = await ambiApi.postToApi({
        url: `/users/${userId}/notifications/${shouldEnable}`
      });
    } catch (err) {
      console.warn(err);
    }
    return updatedUser.data;
  }
}

export default UserService;
