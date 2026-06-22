import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { User } from '../../models/User';

function usePermissions({ scope, id }) {
  const currentUser = new User(useSelector(state => state.auth.user));
  if (!scope || !id) throw new Error('Need both scope and id parameters');

  const [abilities, setAbilities] = useState({});
  const [loaded, setLoaded] = useState(false);

  const fetchAbilities = async () => {
    if (!scope || !id) return;
    const remoteAbilities = await currentUser.fetchObjectAbilities(scope, id);
    setAbilities(remoteAbilities);
    setLoaded(true);
  };

  const canPerform = ability => {
    if (loaded) {
      const permission = abilities[ability] || { performs: false };
      return permission.performs;
    }
    return false;
  };

  useEffect(() => {
    fetchAbilities();
  }, [scope, id]);

  return { canPerform };
}

function useGlobalPermissions(scope) {
  const currentUser = new User(useSelector(state => state.auth.user));
  const [abilities, setAbilities] = useState({});
  const [loaded, setLoaded] = useState(false);

  const fetchAbilities = async () => {
    if (!scope) return;
    const remoteAbilities = await currentUser.fetchAbilities(scope);
    setAbilities(remoteAbilities);
    setLoaded(true);
  };

  const canPerformGlobally = ability => {
    if (loaded) {
      const permission = abilities[ability] || { performs: false };
      return permission.performs;
    }
    return false;
  };

  useEffect(() => {
    fetchAbilities();
  }, [scope, abilities]);

  return { canPerformGlobally, scope };
}

export { usePermissions, useGlobalPermissions, usePermissions as default };
