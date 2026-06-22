import { useEffect } from 'react';
import socketCluster from 'socketcluster-client';
import AmbiApi, { ambiApi } from '../../models/AmbiApi';

function useSocket(events = {}, dependenciesArray = []) {
  let socket;
  const tokens = ambiApi.getTokens();
  const loadSocket = async () => {
    const { onLoad } = events || {};
    let hostname;
    try {
      hostname = await AmbiApi.getApiUrl();
    } catch (err) {
      console.error('unable to fetch socket hostname: ', err);
    }
    if (hostname && tokens && tokens.accessToken) {
      socket = socketCluster.create({
        hostname,
        port: 443,
        secure: true,
        autoReconnect: true,
        query: {
          accessToken: tokens.accessToken
        }
      });
      socket.on('error', err => {
        if (
          err.name === 'SocketProtocolError' &&
          err.message === 'Server ping timed out'
        ) {
          console.warn('socket error! ', err);
          console.warn('socket: ', socket.pendingReconnect, socket.state);
        }
      });
      socket.on('disconnect', err => {
        console.warn('socket disconnect! ', err);
      });
      if (onLoad) {
        onLoad(socket);
      }
    }
  };

  useEffect(() => {
    loadSocket();
  }, dependenciesArray);
}

export default useSocket;
