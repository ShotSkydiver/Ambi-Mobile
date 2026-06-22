/* eslint-disable func-names */
import i18n from 'format-message';
import moment from 'moment';
import generateId from 'format-message-generate-id/underscored_crc32';

import translations from './locales';

export default function () {
  const fallback = { languageTag: 'en', isRTL: false };

  i18n.setup({
    generateId,
    locale: fallback.languageTag,
    translations,
    formats: {
      time: {
        'h:mm': {
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      date: {
        dddd: {
          weekday: 'long'
        }
      }
    }
  });

  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 'a few seconds',
      ss: '%d seconds',
      m: 'a min',
      mm: '%d min',
      h: '1 hr',
      hh: '%d hrs',
      d: 'a day',
      dd: '%d days',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years'
    }
  });
}
