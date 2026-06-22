/**
 * ReactionsListModal
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';

import reactionsList from '../shared/utils/reactionList';
import UserRow from '../shared/UserRow';
import HRLine from '../shared/HRLine';

// const
import { AmbiColors } from '../shared/contexts/themeContext';

const { darkGreenColor, ambiWhite } = AmbiColors;

const ReactionsList = styled.FlatList`
  padding: 16px 24px;
  background-color: ${ambiWhite};
  flex: 1;
`;

const ReactionsItemList = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ReactionWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(206, 209, 217, 0.5);
  border-radius: 15px;
  padding: 6px 12px;
`;

const ReactionText = styled.Text`
  color: ${({ color }) => color || darkGreenColor};
  font-family: Circular;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 18px;
  margin-left: 6px;
`;

const itemSeparator = () => <HRLine fullWidth opacity={0.25} />;

const ReactionsListModal = ({
  route: {
    params: { reactions }
  },
  navigation
}) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const renderItem = ({
    item: {
      createdBy: { user },
      reactionType
    }
  }) => {
    return (
      <ReactionsItemList>
        <UserRow
          user={user}
          key={user.id}
          badge={user.role ? user.role.alias : null}
          navigation={navigation}
          theme={themeColors}
          usePadding
          style={{
            userName: {
              fontSize: 14,
              fontWeight: '900',
              letterSpacing: 0,
              lineHeight: 18
            }
          }}
        />
        <ReactionWrapper>
          {reactionsList[reactionType].icon({ size: 18, filled: true })}
          <ReactionText color={reactionsList[reactionType].color}>
            {reactionType}
          </ReactionText>
        </ReactionWrapper>
      </ReactionsItemList>
    );
  };

  return (
    <ReactionsList
      data={reactions}
      renderItem={renderItem}
      ItemSeparatorComponent={itemSeparator}
      keyExtractor={item => item.id}
    />
  );
};

ReactionsListModal.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.object).isRequired,
  route: PropTypes.objectOf(PropTypes.object).isRequired
};

export default ReactionsListModal;
