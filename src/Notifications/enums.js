export const NOTIFICATION_TYPES = {
  UPDATE_NOTIFICATIONS: 'NOTIFICATIONS/UPDATE',
  UPDATE_TOTAL_UNREAD_COUNT: 'NOTIFICATIONS/UPDATE_TOTAL_UNREAD_COUNT',
  MARK_AS_READ: 'NOTIFICATIONS/MARK_AS_READ',
  MARK_ALL_AS_READ: 'NOTIFICATIONS/MARK_ALL_AS_READ',
  MARK_AS_HIDDEN: 'NOTIFICATIONS/MARK_AS_HIDDEN',
  LOADING: 'NOTIFICATIONS/LOADING'
};

export const NOTIFICATION_KIND = {
  onboarding: 'onboarding',
  post_like: 'post_like',
  post_comment: 'post_comment',
  post_created_group: 'post_created_group',
  post_created_class: 'post_created_class',
  post_created_community: 'post_created_community',
  post_created_user: 'post_created_user',
  added_to_community: 'added_to_community',
  added_to_community_by_domain: 'added_to_community_by_domain',
  added_to_group: 'added_to_group',
  requested_to_join_community: 'requested_to_join_community',
  requested_to_join_group: 'requested_to_join_group',
  event_added: 'event_added',
  event_accepted: 'event_accepted',
  event_user_added: 'event_user_added',
  event_user_added_to_space: 'event_user_added_to_space',
  role_change: 'role_change',
  space_announcement: 'space_announcement',
  group_announcement: 'group_announcement',
  class_announcement: 'class_announcement',
  space_accepted_invite: 'space_accepted_invite',
  space_invite: 'space_invite',
  space_remove: 'space_remove',
  added_to_notebook: 'added_to_notebook',
  notebook_invitation: 'notebook_invite',
  notebook_removal: 'notebook_removal',
  notebook_accepted_invite: 'notebook_accepted_invite',
  post_created_individual: 'post_created_individual',
  moderation_post_report: 'moderation_post_report',
  moderation_post_report_to_user: 'moderation_post_report_to_user',
  moderation_escalated_report: 'moderation_escalated_report',

  // action resolve moderation
  moderation_dismissed_post_report: 'moderation_dismissed_post_report',
  moderation_deleted_post_report: 'moderation_deleted_post_report',
  moderation_removed_author_report: 'moderation_removed_author_report',
  moderation_restricted_author_report: 'moderation_restricted_author_report'
};

export const NOTIFICATION_DIRECTED_TO = {
  calendarEvent: 'calendarEvent',
  chatChannel: 'chatChannel',
  community: 'community',
  communityRole: 'communityRole',
  class: 'class',
  classRole: 'classRole',
  group: 'group',
  groupRole: 'groupRole',
  post: 'post',
  postComment: 'postComment',
  user: 'user',
  freeform: 'freeform',
  unknown: 'unknown'
};
