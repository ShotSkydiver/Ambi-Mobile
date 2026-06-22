import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import HRLine from './HRLine';
import UserToggleRow, { SectionHeader } from './UserToggleRow';
import User from '../PropTypes/User';

const UserToggleList = ({
  users,
  selectedUsers,
  onSelectedUsersChange,
  header,
  navigation,
  onNotifyUserAdded,
  onNotifyUserRemoved
}) => {
  if (users.length > 0) {
    return (
      <FlatList
        data={users}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<SectionHeader>{header}</SectionHeader>}
        renderItem={({ item: user }) => (
          <UserToggleRow
            user={user}
            navigation={navigation}
            isChecked={selectedUsers.includes(user)}
            toggleChecked={isChecked => {
              if (isChecked) {
                onSelectedUsersChange([...selectedUsers, user]);
                onNotifyUserAdded(user);
              } else {
                onSelectedUsersChange(selectedUsers.filter(u => u === user));
                onNotifyUserRemoved(user);
              }
            }}
            key={user.id}
          />
        )}
        keyExtractor={(user, index) => (user.id ? user.id.toString() : index)}
        ItemSeparatorComponent={() => <HRLine />}
      />
    );
  }
  return null;
};

UserToggleList.defaultProps = {
  onSelectedUsersChange: () => {},
  onNotifyUserAdded: () => {},
  onNotifyUserRemoved: () => {}
};

UserToggleList.propTypes = {
  users: PropTypes.arrayOf(User).isRequired,
  selectedUsers: PropTypes.arrayOf(User).isRequired,
  header: PropTypes.string.isRequired,
  onSelectedUsersChange: PropTypes.func,
  onNotifyUserAdded: PropTypes.func,
  onNotifyUserRemoved: PropTypes.func
};

export default UserToggleList;
