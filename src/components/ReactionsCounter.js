/**
 * ReactionsCounter
 */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import i18n from 'format-message';

import reactionsList from '../shared/utils/reactionList';

// const
import { AmbiColors } from '../shared/contexts/themeContext';

const { ambiGray: colorAmbiGray, ambiWhite } = AmbiColors;

const ReactionsCounterContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const ReactionsIconsContainer = styled.View`
  flex-direction: row;
`;

const Reaction = styled.View`
  width: ${({ size }) => size || 24}px;
  height: ${({ size }) => size || 24}px;
  border: 1px solid ${colorAmbiGray};
  border-radius: ${({ size }) => size / 2 || 24}px;
  align-items: center;
  justify-content: center;
  margin-right: -6px;
  background-color: ${ambiWhite};
`;

const UsersText = styled.Text`
  color: #707689;
  font-family: Circular;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 18px;
  margin: 0 12px;
`;

const Bold = styled(UsersText)`
  color: #1d2129;
  font-weight: 900;
`;

const ReactionsCounter = ({ navigation, reactions, size }) => {
  const currentUser = useSelector(state => state.auth.user);

  const toggleModalReactions = () =>
    navigation.navigate('NativeModalNavigator', {
      screen: 'ReactionsListModal',
      params: { reactions }
    });

  const reactionsOthersUsers = reactions.filter(
    ({ createdByUserId }) => createdByUserId !== currentUser.id
  );

  const { length: totalReactions } = reactions;
  const hasUserReaction = totalReactions > reactionsOthersUsers.length;

  const firstOtherUser = reactionsOthersUsers.shift();
  const { firstName = '', lastName = '' } =
    firstOtherUser?.createdBy?.user || {};

  const { length: totalOthers } = reactionsOthersUsers;

  return (
    <>
      <ReactionsCounterContainer onPress={toggleModalReactions}>
        <ReactionsIconsContainer>
          {reactions
            .reduce(
              (acum, { reactionType }) =>
                acum?.indexOf(reactionType) !== -1
                  ? acum
                  : [...acum, reactionType],
              []
            )
            .splice(0, 3)
            ?.map((reaction, i, { length }) => (
              <Reaction style={{ zIndex: length - i }} size={size}>
                {reactionsList[reaction].icon({ size: size / 2, filled: true })}
              </Reaction>
            ))}
        </ReactionsIconsContainer>

        <UsersText>
          {hasUserReaction && (
            <>
              <Bold>{i18n('You')}</Bold>
              {firstOtherUser &&
                (totalReactions > 2 ? <Bold>, </Bold> : ` ${i18n('and')} `)}
            </>
          )}

          {firstName && (
            <Bold>
              {firstName} {lastName.charAt(0)}{' '}
            </Bold>
          )}

          {totalOthers > 0 && (
            <>
              {i18n('and')}{' '}
              <Bold>
                {totalOthers} {i18n(`other${totalOthers > 1 ? 's' : ''}`)}
              </Bold>
            </>
          )}
        </UsersText>
      </ReactionsCounterContainer>
    </>
  );
};

ReactionsCounter.propTypes = {
  reactions: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.number
};

ReactionsCounter.defaultProps = {
  reactions: [],
  size: 24
};

export default ReactionsCounter;
