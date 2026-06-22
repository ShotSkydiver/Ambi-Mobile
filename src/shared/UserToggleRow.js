import React from 'react';
import PropTypes from 'prop-types';
import UserRow, { SectionHeader } from './UserRow';
import RadioButtonTick from './RadioButtonTick';
import UserPropTypes from '../PropTypes/User';

export default function UserToggleRow({
  user,
  userId,
  isChecked,
  toggleChecked,
  navigation,
  theme,
  usePadding
}) {
  return (
    <UserRow
      user={user}
      userId={userId}
      navigation={navigation}
      theme={theme}
      onPress={() => toggleChecked(!isChecked)}
      usePadding={usePadding}
    >
      <RadioButtonTick
        isChecked={isChecked}
        theme={theme}
        onPress={() => toggleChecked(!isChecked)}
      />
    </UserRow>
  );
}

UserToggleRow.defaultProps = {
  user: null,
  userId: null,
  isChecked: false,
  navigation: null,
  theme: null,
  usePadding: false
};

UserToggleRow.propTypes = {
  user: UserPropTypes,
  userId: PropTypes.number,
  isChecked: PropTypes.bool,
  toggleChecked: PropTypes.func.isRequired,
  navigation: PropTypes.shape({}),
  theme: PropTypes.shape({}),
  usePadding: PropTypes.bool
};

export { SectionHeader };
