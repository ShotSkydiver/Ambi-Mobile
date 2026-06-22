export const newsfeedType = {
  GENERAL: 'general',
  PERSONAL: 'personal',
  BROADCASTS: 'broadcasts',
  GROUP: 'group',
  CLASS: 'class',
  COMMUNITY: 'community',
  OTHER_USER: 'other_user',
  RSS: 'rss-feeds',
  FLAGGED: 'flagged'
};

export const permissionScopeName = {
  [newsfeedType.GENERAL]: 'individual',
  [newsfeedType.PERSONAL]: 'individual',
  [newsfeedType.OTHER_USER]: 'individual',
  [newsfeedType.CLASS]: 'class',
  [newsfeedType.GROUP]: 'group',
  [newsfeedType.COMMUNITY]: 'community'
};
