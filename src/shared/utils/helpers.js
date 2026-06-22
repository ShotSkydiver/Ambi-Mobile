import moment from 'moment';
import i18n from 'format-message';
import { User } from '../../models/User';

const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

// A list of the available colors for file highlights
const colors = {
  pink: '#ed1e7a',
  blue: '#02a5f0',
  yellow: '#e9a820',
  green: '#22a671',
  purple: '#8b51f6',
  red: '#d12436',
  orange: '#fb8903',
  aqua: '#05c4eb',
  gray: '#8a90a2'
};

// Map file extensions to file colors
const fileColors = {
  png: colors.pink,
  jpg: colors.pink,
  jpeg: colors.pink,
  gif: colors.pink,
  tif: colors.pink,
  tiff: colors.pink,

  doc: colors.blue,
  docx: colors.blue,
  pages: colors.blue,
  txt: colors.blue,
  document: '#4285F4',

  ppt: colors.yellow,
  pptx: colors.yellow,
  key: colors.yellow,
  presentation: '#f4b400',

  xls: colors.green,
  xlsm: colors.green,
  xlsx: colors.green,
  spreadsheet: '#0f9d58',

  mov: colors.purple,
  mp4: colors.purple,
  mp3: colors.purple,
  flac: colors.purple,
  aac: colors.purple,
  avi: colors.purple,

  pdf: colors.red,

  ai: colors.orange,
  sketch: colors.orange,

  psd: colors.aqua,

  js: colors.gray,
  html: colors.gray,
  ps: colors.gray,
  zip: colors.gray
};

export function getFileColor(extension) {
  if (!extension) {
    return colors.red;
  }
  return fileColors[extension.toLowerCase()] || colors.red;
}

export function getFileExtension(filename) {
  const splitParts = `${filename}`.split('.');
  return splitParts[splitParts.length - 1];
}

export function getFilenameColor(filename) {
  if (!filename || typeof filename !== 'string') {
    return colors.red;
  }
  const splitParts = filename.split('.');
  return getFileColor(splitParts[splitParts.length - 1]);
}

export function determineIfOnline(
  lastUpdateDatetime,
  lastDisconnectionDatetime
) {
  // If we've seen them in the last 5 minutes.
  if (
    lastUpdateDatetime &&
    (!lastDisconnectionDatetime ||
      lastUpdateDatetime >= lastDisconnectionDatetime) &&
    moment.utc().diff(lastUpdateDatetime, i18n('seconds')) <= 60 * 5
  ) {
    return true;
  }
  return false;
}

// Taken from pretty-bytes, but put here to avoid extra dependencies

function toLocaleString(number, locale) {
  let result = number;
  if (typeof locale === 'string') {
    result = number.toLocaleString(locale);
  } else if (locale === true) {
    result = number.toLocaleString();
  }
  return result;
}

export function formatBytes(bytes, options) {
  if (!Number.isFinite(bytes)) {
    throw new TypeError(
      `${i18n('Expected a finite number, got')} ${typeof bytes}: ${bytes}`
    );
  }
  let returnBytes = bytes;
  const returnOptions = { ...options };
  if (returnOptions.signed && returnBytes === 0) {
    return ' 0 B';
  }
  const isNegative = returnBytes < 0;
  const prefix = isNegative ? '-' : returnOptions.signed ? '+' : '';
  if (isNegative) {
    returnBytes = -returnBytes;
  }
  if (returnBytes < 1) {
    const numberString = toLocaleString(returnBytes, returnOptions.locale);
    return `${prefix + numberString} B`;
  }
  const exponent = Math.min(
    Math.floor(Math.log10(returnBytes) / 3),
    UNITS.length - 1
  );
  returnBytes = Number((returnBytes / 1000 ** exponent).toPrecision(3));
  const numberString = toLocaleString(returnBytes, returnOptions.locale);
  const unit = UNITS[exponent];
  return `${prefix + numberString} ${unit}`;
}

export function normalizeById(arrayOfObjects) {
  const normalized = {};
  if (arrayOfObjects && arrayOfObjects.length > 0) {
    arrayOfObjects.forEach(obj => {
      normalized[obj.id] = obj;
    });
  }
  return normalized;
}

export function normalizeByStringId(arrayOfObjects) {
  const normalized = {};
  if (arrayOfObjects && arrayOfObjects.length > 0) {
    arrayOfObjects.forEach(obj => {
      normalized[`_${obj.id}`] = obj;
    });
  }
  return normalized;
}

export function removeDuplicates(arr, key = 'id') {
  const map = new Map();
  arr.map(el => {
    if (!map.has(el[key])) {
      map.set(el[key], el);
    }
    return map;
  });
  return [...map.values()];
}

export const getActiveRouteName = currentState => {
  if (!currentState) {
    return null;
  }
  const route = currentState.routes[currentState.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
};

export const parsePostCreatedBy = (createdBy = {}) => {
  let linkTo;
  let uniqueIdentifier;
  let avatarUrl;
  let createdByTitle;
  let color = '';
  let roleTitle = 'user';

  if (createdBy.user) {
    ({ uniqueIdentifier, avatarUrl } = createdBy.user);
    if (createdBy.user.role) {
      roleTitle = createdBy.user.role.title;
      color = createdBy.user.role.color;
    }
    const createdByUser = new User(createdBy.user);
    createdByTitle = createdByUser.getName();
    linkTo = createdByUser.getUrl();
    avatarUrl = createdByUser.getAvatarUrl();
  } else if (createdBy.class) {
    ({ uniqueIdentifier, avatarUrl, color } = createdBy.class);
    createdByTitle = createdBy.class.name;
    linkTo = `/classes/${uniqueIdentifier}`;
  } else if (createdBy.group) {
    ({ uniqueIdentifier, avatarUrl, color } = createdBy.group);
    avatarUrl =
      createdBy.group.coverBannerMedia && createdBy.group.coverBannerMedia.links
        ? createdBy.group.coverBannerMedia.links.content
        : createdBy.group.coverBannerUrl;
    createdByTitle = createdBy.group.name;
    linkTo = `/groups/${uniqueIdentifier}`;
  } else if (createdBy.community) {
    ({ uniqueIdentifier, avatarUrl, color } = createdBy.community);
    avatarUrl =
      createdBy.community.coverBannerMedia &&
      createdBy.community.coverBannerMedia.links
        ? createdBy.community.coverBannerMedia.links.content
        : createdBy.community.coverBannerUrl;
    createdByTitle = createdBy.community.name;
    linkTo = `/communities/${uniqueIdentifier}`;
  }

  const linkToPost = createdBy.user
    ? `${linkTo}/posts`
    : `${linkTo}/discussion/posts`;

  if (!linkTo) {
    console.warn('Post is invalid...linkTo will be incorrect');
    linkTo = '';
  }

  return [
    {
      avatarUrl,
      createdByTitle,
      roleTitle,
      linkTo,
      linkToPost,
      color
    }
  ];
};

export const formatDate = (date, showOnlyTime) => {
  const postedTime = moment(date).format('x');
  const hoursDiff = Math.floor(Math.abs(Date.now() - postedTime) / 3600000);
  const minutesDiff = Math.floor(Math.abs(Date.now() - postedTime) / 60000);
  const calendarFormatArr = moment(date).calendar().split(' ');
  const isCurrentYear = moment(date).isSame(new Date(), 'year');
  const dateFormat = moment(date).format(
    isCurrentYear ? 'MMM Do' : 'MMM Do YYYY'
  );
  const onlyTime = `${calendarFormatArr[calendarFormatArr.length - 2]} ${
    calendarFormatArr[calendarFormatArr.length - 1]
  }`;
  const weekDay = moment(date).format('ddd');
  const dayAfter = moment(Date.now()).subtract(1, 'days');
  let timestampFormat = i18n('{dateFormat}', { dateFormat });

  if (hoursDiff === 0) {
    if (minutesDiff === 0 || (minutesDiff > 0 && minutesDiff < 1)) {
      timestampFormat = showOnlyTime
        ? i18n('{onlyTime}', { onlyTime })
        : i18n('Just now');
    } else if (minutesDiff > 0 && minutesDiff < 60) {
      const minString = minutesDiff > 1 ? 'mins' : 'min';
      timestampFormat = i18n('{minutesDiff} {minString} ago', {
        minutesDiff,
        minString
      });
    }
  } else if (hoursDiff > 0 && hoursDiff <= 5) {
    const hrString = hoursDiff > 1 ? 'hrs' : 'hr';
    timestampFormat = i18n('{hoursDiff} {hrString} ago', {
      hoursDiff,
      hrString
    });
  } else if (
    hoursDiff > 5 &&
    moment(date).weekday() === moment(dayAfter).weekday() &&
    hoursDiff <= 24
  ) {
    timestampFormat = showOnlyTime
      ? i18n('{onlyTime}', { onlyTime })
      : i18n('Yesterday at {onlyTime}', { onlyTime });
  } else if (hoursDiff > 24 && hoursDiff < 120) {
    timestampFormat = i18n('{weekDay} at {onlyTime}', { weekDay, onlyTime });
  }
  return timestampFormat;
};

export const emailIsValidFormat = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const sortByDateCreated = list => {
  return list.sort((a, b) => {
    const keyA = new Date(a.dateCreated);
    const keyB = new Date(b.dateCreated);
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });
};

export function contentIsOnlyEmojis(string) {
  const ranges =
    '(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])';
  const removeEmoji = str => str.replace(new RegExp(ranges, 'g'), '');

  const isOnlyEmojis = str => !removeEmoji(str).length;
  const isEmoji = str => {
    removeEmoji(str);
    if (isOnlyEmojis(str) && str.length > 0) {
      return true;
    }
    return false;
  };
  return isEmoji(string);
}

export const actionResolvedModeration = message => {
  if (message.search(/dismiss|dismissed/) !== -1) {
    return 'dismissed';
  }
  if (message.search(/delete|deleted/) !== -1) {
    return 'deleted';
  }
  if (message.search(/remove|removed/) !== -1) {
    return 'removed';
  }
  if (message.search(/restrict|restricted/) !== -1) {
    return 'restricted';
  }
  return '';
};

/**
 * @param {*} type
 * @return {string} video, image, other
 */
export const getFileType = (extensionType = '') => {
  const [nameTypeExtension] = extensionType.split('/');
  if (['image', 'video'].indexOf(nameTypeExtension) !== -1) {
    return nameTypeExtension;
  }
  return 'other';
};

/*
 * @param {string}
 * @return {string}
 */
export const upperFirstLetter = string =>
  `${string.charAt(0).toUpperCase() + string.slice(1)}`;
