import React from 'react';
import { Heart, HaHa, Applause, Curious, Wow } from '../icons/Reactions';

const reactionsList = {
  like: {
    icon: props => <Heart {...props} />,
    color: '#ED1E7A',
    backgroundColor: 'rgba(237, 30, 122,0.1)'
  },
  haha: {
    icon: props => <HaHa {...props} />,
    color: '#029EE2',
    backgroundColor: 'rgba(2, 158, 226,0.1)'
  },
  celebrate: {
    icon: props => <Applause {...props} />,
    color: '#22A671',
    backgroundColor: 'rgba(34, 166, 113,0.1)'
  },
  wow: {
    icon: props => <Wow {...props} />,
    color: '#F9BA46',
    backgroundColor: 'rgba(233, 168, 32,0.1)'
  },
  curious: {
    icon: props => <Curious {...props} />,
    color: '#8B51F6',
    backgroundColor: 'rgba(139, 81, 246,0.1)'
  }
};

export default reactionsList;
