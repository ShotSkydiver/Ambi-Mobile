import PropTypes from 'prop-types';

const Role = PropTypes.shape({
  id: PropTypes.number.isRequired,
  alias: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
});
export default Role;
