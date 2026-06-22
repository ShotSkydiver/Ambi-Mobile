/* eslint-disable react/forbid-prop-types */
import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import styled from 'styled-components';
import { isEqual } from 'lodash';
import moment from 'moment';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';
import { AmbiColors } from '../../shared/contexts/themeContext';

const MAX_AVATAR_OPTION = 3;

const PollsContainer = styled(View)`
  padding-top: 16px;
`;

const PollWrapper = styled(View)``;

const PollDetails = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
`;

const PollTitle = styled(Text)`
  font-family: Circular;
  font-weight: 300;
  font-size: 14px;
  line-height: 18px;
`;

const VotePercentage = styled(Text)`
  opacity: 0.6;
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 18px;
  margin-left: 15px;
`;

const PollOption = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PollOptionRadioContainer = styled(View)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 2px solid
    ${({ selected, color }) => (selected ? AmbiColors.ambiBlue : color)};
  margin-right: 8px;
`;

const PollOptionRadio = styled(View)`
  background-color: ${AmbiColors.ambiBlue};
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin: 4px;
`;

const PollOptionBar = styled(View)`
  border-radius: 8px;
  height: 32px;
  flex: 1;
`;

const PollAverageBackground = styled(View)`
  background-color: ${AmbiColors.ambiBlue};
  height: 32px;
  border-radius: 8px;
  width: ${({ width }) => width};
  position: absolute;
  top: 0;
  left: ${({ left }) => left}px;
  opacity: ${({ opacity }) => opacity};
`;

const PollClosed = styled(View)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  flex-direction: row;
`;

const Line = styled(View)`
  flex: 1;
  height: 1px;
  background-color: #e8e9ec;
`;

const PollClosedMessage = styled(Text)`
  margin: 0 10px;
  font-family: Circular;
  font-weight: 500;
  text-align: center;
  font-size: 16px;
`;

const VoteCountBackground = styled(TouchableOpacity)`
  background-color: ${AmbiColors.ambiBlue};
  width: 20px;
  height: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-left: -5px;
`;

const VoteImage = styled(Image)`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-left: -5px;
`;

const VoteCountText = styled(Text)`
  font-family: Circular;
  font-weight: 500;
  font-size: 10px;
  text-align: center;
  color: ${AmbiColors.ambiWhite};
`;

const openPollDetailScreen = ({ navigation, postId, optionSelected }) => {
  navigation.navigate('NativeModalNavigator', {
    screen: 'DetailPollScreen',
    params: { postId, optionSelected }
  });
};

const VoteCount = ({
  voteCount,
  navigation,
  postId,
  optionSelected,
  hideUsers
}) => {
  return (
    <VoteCountBackground
      onPress={() =>
        openPollDetailScreen({ navigation, postId, optionSelected })
      }
    >
      <VoteCountText>
        {MAX_AVATAR_OPTION - voteCount > MAX_AVATAR_OPTION && !hideUsers
          ? `${MAX_AVATAR_OPTION}`
          : `+${voteCount}`}
      </VoteCountText>
    </VoteCountBackground>
  );
};

const VoteAvatar = ({ vote }) => {
  const { avatar } = vote;

  return (
    <VoteImage
      source={{
        uri: avatar
      }}
    />
  );
};

const PollOptionRadioView = ({ selected, color }) => {
  return (
    <PollOptionRadioContainer selected={selected} color={color}>
      {selected && <PollOptionRadio />}
    </PollOptionRadioContainer>
  );
};

const SinglePostPoll = ({
  poll: pollObject,
  currentUser,
  togglePostVote,
  disabled,
  navigation,
  postId
}) => {
  const [poll, setPoll] = useState(pollObject);
  const { hideUsers = false, neverEnds = false, endDate } = poll;
  const [pollBarWidth, setPollBarWidth] = useState(0);
  const pollClosed =
    !neverEnds && moment.utc(endDate).toDate() <= moment.utc().toDate();
  const getOptionAverage = option => {
    if (!poll.votes[option.id] || poll.votes[option.id].length === 0) return 0;
    return Math.floor(
      poll.votes[option.id].length * (100 / poll.totalVoteCount)
    );
  };

  const toggledOption = option => {
    const { id: optionId } = option;
    const { id: idCurrentUser } = currentUser;
    const updatedPoll = { ...poll };
    const optionVotes =
      updatedPoll &&
      updatedPoll.votes &&
      Object.entries(updatedPoll.votes).length > 0 &&
      updatedPoll.votes[optionId]
        ? updatedPoll.votes[optionId]
        : [];
    const optionsUserData =
      updatedPoll &&
      updatedPoll.votesWithUserData &&
      Object.entries(updatedPoll.votesWithUserData).length > 0 &&
      updatedPoll.votesWithUserData[optionId]
        ? updatedPoll.votesWithUserData[optionId]
        : [];

    let isVoted = false;
    if (optionVotes.indexOf(idCurrentUser) > -1) {
      optionVotes.splice(optionVotes.indexOf(idCurrentUser), 1);
      const index = optionsUserData.findIndex(
        item => item.userId === idCurrentUser
      );
      optionsUserData.splice(index, 1);
      updatedPoll.totalVoteCount -= 1;
    } else {
      optionVotes.push(idCurrentUser);
      optionsUserData.push({
        avatar: currentUser.profile.avatarUrl,
        userId: idCurrentUser
      });
      updatedPoll.totalVoteCount += 1;
      isVoted = true;
    }

    updatedPoll.votes[optionId] = optionVotes;
    // only if the first vote
    if (!updatedPoll.votesWithUserData) {
      updatedPoll.votesWithUserData = [];
    }
    updatedPoll.votesWithUserData[optionId] = optionsUserData;
    togglePostVote(option, isVoted);
    setPoll(updatedPoll);
  };

  const getVotePercentText = option => {
    const optionAverage = getOptionAverage(option);
    if (optionAverage === 0) {
      return '';
    } else {
      return `${optionAverage}%`;
    }
  };

  let highestVote = 0;
  Object.keys(poll.votes).forEach(optionId => {
    const count = poll.votes[optionId].length;
    if (count > highestVote) {
      highestVote = count;
    }
  });

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <PollsContainer>
      {pollClosed ? (
        <PollClosed>
          <Line />
          <PollClosedMessage style={{ color: themeColors.charcoal }}>
            {i18n('this poll is closed')}
          </PollClosedMessage>
          <Line />
        </PollClosed>
      ) : (
        <>
          {disabled && (
            <PollClosed>
              <Line />
              <PollClosedMessage style={{ color: themeColors.charcoal }}>
                {i18n('this poll is disabled')}
              </PollClosedMessage>
              <Line />
            </PollClosed>
          )}
        </>
      )}
      {poll.options.map(option => {
        const optionVotes = poll.votes[option.id] || [];
        const optionVotesCount = optionVotes.length;
        const pollUserData =
          poll && poll.votesWithUserData
            ? poll.votesWithUserData[option.id]
            : [];

        const selected = optionVotes.indexOf(currentUser.id) >= 0;
        let opacity = 1;
        if (pollClosed && optionVotesCount < highestVote) {
          opacity = 0.5;
        }
        return (
          <PollWrapper key={option.id}>
            <PollDetails>
              <PollTitle style={{ color: themeColors.textPrimary }}>
                {option.text}
              </PollTitle>
              <View style={{ flexDirection: 'row' }}>
                {!hideUsers &&
                  pollUserData &&
                  pollUserData.length > 0 &&
                  pollUserData
                    .slice(0, MAX_AVATAR_OPTION)
                    .map(vote => (
                      <VoteAvatar
                        key={`user-vote-${vote.userId}`}
                        vote={vote}
                      />
                    ))}
                {optionVotesCount > 0 && (
                  <VoteCount
                    voteCount={optionVotesCount}
                    navigation={navigation}
                    postId={postId}
                    optionSelected={option}
                    hideUsers={hideUsers}
                  />
                )}
                <VotePercentage style={{ color: themeColors.textPrimary }}>
                  {getVotePercentText(option)}
                </VotePercentage>
              </View>
            </PollDetails>
            <PollOption
              disabled={pollClosed || disabled}
              onPress={() => toggledOption(option)}
              votes={poll.votes[option.id]}
            >
              {!pollClosed && (
                <PollOptionRadioView
                  selected={selected}
                  color={themeColors.slateGray}
                />
              )}
              <PollOptionBar
                onLayout={event => {
                  const { width } = event.nativeEvent.layout;
                  setPollBarWidth(width);
                }}
                style={{ backgroundColor: themeColors.systemBorderColor }}
              />
              {poll.votes[option.id] && poll.votes[option.id].length > 0 && (
                <PollAverageBackground
                  width={(getOptionAverage(option) / 100) * pollBarWidth}
                  left={pollClosed ? 0 : 40}
                  opacity={opacity}
                />
              )}
            </PollOption>
          </PollWrapper>
        );
      })}
    </PollsContainer>
  );
};

SinglePostPoll.defaultProps = {
  poll: {
    options: [],
    votes: {}
  }
};

SinglePostPoll.propTypes = {
  poll: PropTypes.shape({
    options: PropTypes.array.isRequired,
    votes: PropTypes.object.isRequired,
    totalVoteCount: PropTypes.number,
    endDate: PropTypes.string
  }),
  currentUser: PropTypes.shape({}).isRequired,
  togglePostVote: PropTypes.func.isRequired
};

function areEqual(prevProps, nextProps) {
  return isEqual(prevProps.poll, nextProps.poll);
}

export default memo(SinglePostPoll, areEqual);
