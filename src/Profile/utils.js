import { DEFAULT_PROFILE_PIC } from '../shared/constants';

export const normalizeDisplayName = item => {
  if (item.firstName || item.lastName) {
    return `${item.firstName} ${item.lastName}`.trim();
  } else if (item.displayName) {
    return `${item.displayName}`;
  }

  return item.email;
};

export const normalizeProfile = (profile = {}) => ({
  ...profile,
  displayName: normalizeDisplayName(profile)
});

export const normalizeUser = (user = {}) => {
  const profile = normalizeProfile(user?.profile || user);
  const {
    avatarMedia,
    avatarUrl,
    displayName,
    firstName,
    lastName,
    coverBannerUrl,
    coverBannerMedia
  } = profile;
  const userAvatarMedia =
    typeof avatarMedia === 'string' ? JSON.parse(avatarMedia) : avatarMedia;
  return {
    ...profile,
    avatarUrl: avatarUrl || user.avatarUrl || DEFAULT_PROFILE_PIC,
    avatarMedia:
      userAvatarMedia &&
      userAvatarMedia.links &&
      (userAvatarMedia.links.image_80_80 || userAvatarMedia.links.content),
    coverBannerUrl:
      (coverBannerMedia &&
        coverBannerMedia.links &&
        (coverBannerMedia.links.image_656_250 ||
          coverBannerMedia.links.content)) ||
      coverBannerUrl ||
      user.coverBannerUrl,
    displayName: displayName || normalizeDisplayName(user),
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName
  };
};
