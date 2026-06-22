import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSession, setApiAndLookupClient } from './redux/actions';
import { FullScreenLoader } from '../shared/Loader';
import { MainStackNavigator } from '../Navigation/AppNavigation';
import AuthStackNavigator from './AuthNavigator';

const Auth = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { fetchingSession, user } = auth || {};

  useEffect(() => {
    setApiAndLookupClient();
    fetchSession(navigation)(dispatch);
  }, []);

  if (fetchingSession) {
    return <FullScreenLoader text="loading" />;
  }
  if (user && user.id) {
    return <MainStackNavigator />;
  }
  return <AuthStackNavigator />;
};

export default Auth;
