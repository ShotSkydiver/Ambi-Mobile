import { createContext } from 'react';

const BadgeCountsContext = createContext({
  chatUnreadCount: 0,
  notifUnreadCount: 0
});

export default BadgeCountsContext;
