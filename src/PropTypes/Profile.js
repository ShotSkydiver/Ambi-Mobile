import PropTypes from 'prop-types';

const Profile = PropTypes.shape({
  id: PropTypes.number.isRequired,
  avatarUrl: PropTypes.string,
  coverBannerUrl: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired
});
export default Profile;
