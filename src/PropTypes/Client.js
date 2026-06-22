import PropTypes from 'prop-types';

const Client = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string
});
export default Client;
