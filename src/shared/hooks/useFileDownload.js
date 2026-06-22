import { useReducer } from 'react';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';

import { IS_ANDROID } from '../constants';

const fileReducer = (state, action) => {
  switch (action.type) {
    case 'start-download':
      return { ...state, progress: 0, status: 'downloading' };
    case 'update-download-progress':
      return { ...state, progress: action.progress };
    case 'mark-download-complete':
      return { ...state, status: 'download-complete', path: action.path };
    case 'mark-download-error':
      return { ...state, status: 'download-error' };
    default:
      return state;
  }
};

function useFileDownload({ file }) {
  const [state, dispatch] = useReducer(fileReducer, {
    status: 'download-not-started',
    progress: 0
  });

  const downloadFile = async (resolve, reject) => {
    try {
      if (state.path) {
        await FileViewer.open(state.path);
        dispatch({ type: 'mark-download-complete', path: state.path });
        resolve(state);
      } else {
        if (
          IS_ANDROID &&
          (await Permissions.check(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          )) === 'undetermined'
        ) {
          const result = await Permissions.request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          );
          if (result !== 'authorized') {
            reject(new Error('authorized'));
          }
        }
        dispatch({ type: 'start-download' });
        const promise = RNFetchBlob.config({
          fileCache: true,
          appendExt: file.filename
            ? file.filename.split('.').pop()
            : file.contentType.split('/').pop()
        }).fetch('GET', file.links.download, {});

        promise.progress((received, total) => {
          dispatch({
            type: 'update-download-progress',
            progress: received / total
          });
        });

        await promise.then(async result => {
          const { status } = result.info();
          if (status === 200) {
            await FileViewer.open(result.path());
            dispatch({ type: 'mark-download-complete', path: result.path() });
            resolve(result);
          } else {
            dispatch({ type: 'mark-download-error' });
            reject(new Error('File not open'));
          }
        });
      }
    } catch (_a) {
      reject(new Error('File not open'));
    }
  };

  const download = () =>
    new Promise((resolve, reject) => {
      return downloadFile(resolve, reject);
    });

  return { download, state };
}

export default useFileDownload;
