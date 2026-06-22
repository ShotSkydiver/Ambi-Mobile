import * as React from 'react';
import BadgeCountsContext from '../contexts/badgeCountsContext';

export default function useBadgeCounts() {
  const badgeCounts = React.useContext(BadgeCountsContext);

  return badgeCounts;
}
