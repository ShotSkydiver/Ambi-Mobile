import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import i18n from 'format-message';
import { ToggleButton } from 'react-native-paper';

import styled from 'styled-components';

import reactionsList from '../shared/utils/reactionList';

const Container = styled.View``;

const Reaction = styled(TouchableOpacity)`
  flex: 0 auto;
  align-items: center;
  margin-right: 20px;
  flex-direction: row;
`;

const Label = styled.Text`
  margin: 6px;
  font-family: Circular;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 15px;
  color: ${({ color }) => color || '#707689'};
`;

const OptionsList = styled(ToggleButton.Row)`
  border: 1px solid #f7f7fa;
  border-radius: 32px;
  background-color: #ffffff;
  padding: 3px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  position: absolute;
  elevation: 7;
  top: 28px;
  left: -10px;
`;

const Option = styled(ToggleButton)`
  border: 1px solid
    ${({ borderColor }) => borderColor || 'rgba(206, 209, 217, 0.5)'};
  border-radius: 100px;
  background-color: ${({ backgroundColor }) => backgroundColor || '#ffffff'};
  margin: 3px;
`;

const Reactions = ({
  reaction: _reaction,
  onReactionPress,
  postId,
  idShowReaction,
  setIdShowReaction
}) => {
  const [reaction, setReaction] = useState(_reaction);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setReaction(_reaction);
  }, [_reaction]);

  useEffect(() => {
    setIsOpen(postId === idShowReaction);
  }, [idShowReaction]);

  const toggleReactionList = () => {
    setIsOpen(isOpen => {
      setIdShowReaction && setIdShowReaction(isOpen ? -1 : postId);
      return !isOpen;
    });
  };

  const onReaction = reactionToSend => {
    const finalReactionToSend =
      reactionToSend === reaction ? undefined : reactionToSend;
    onReactionPress(reactionToSend);
    setReaction(finalReactionToSend);
    toggleReactionList();
  };

  return (
    <Container>
      <Reaction onPress={toggleReactionList}>
        {reactionsList[reaction || 'like'].icon({
          size: 24,
          color:
            reactionsList[reaction]?.color || (isOpen ? '#ED1E7A' : '#707689'),
          filled: !!reaction
        })}
        <Label
          color={
            reactionsList[reaction]?.color || (isOpen ? '#ED1E7A' : '#707689')
          }
        >
          {i18n(reaction || 'like')}
        </Label>
      </Reaction>

      {isOpen && (
        <OptionsList onValueChange={onReaction} value={reaction}>
          {Object.entries(reactionsList).map(reactionOfList => {
            const isReactionSelected = reactionOfList[0] === reaction;
            return (
              <Option
                key={reactionOfList[0]}
                icon={() =>
                  reactionOfList[1].icon({
                    size: 24,
                    filled: isReactionSelected
                  })
                }
                backgroundColor={
                  isReactionSelected && reactionOfList[1].backgroundColor
                }
                borderColor={isReactionSelected && reactionOfList[1].color}
                value={reactionOfList[0]}
              />
            );
          })}
        </OptionsList>
      )}
    </Container>
  );
};
Reactions.propTypes = {
  reaction: PropTypes.string,
  onReactionPress: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
  idShowReaction: PropTypes.number.isRequired,
  setIdShowReaction: PropTypes.func.isRequired
};

Reactions.defaultProps = {
  reaction: ''
};
export default Reactions;
