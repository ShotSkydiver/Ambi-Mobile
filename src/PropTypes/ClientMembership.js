import PropTypes from 'prop-types';
import Client from './Client';
import Role from './Role';

const ClientMembership = PropTypes.shape({
  id: PropTypes.number.isRequired,
  uniqueIdentifier: PropTypes.string.isRequired,
  client: Client,
  role: Role
});
export default ClientMembership;
