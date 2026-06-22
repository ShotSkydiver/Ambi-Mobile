import PropTypes from 'prop-types';
import ClientMembership from './ClientMembership';
import Profile from './Profile';

const User = PropTypes.shape({
  id: PropTypes.number.isRequired,
  email: PropTypes.string,
  clientMemberships: PropTypes.arrayOf(ClientMembership),
  profile: Profile
});
export default User;
