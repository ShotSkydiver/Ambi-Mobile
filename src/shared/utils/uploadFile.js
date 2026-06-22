import { v4 as uuid } from 'uuid';
import { ambiApi } from '../../models/AmbiApi';

function uploadFile({ url, file, events = {} }) {
  const {
    onUploadStarted,
    onUploadLoaded,
    onUploadProgress,
    onUploadError,
    onUploadFinished
  } = events;
  const fileIdentifier = file.uniqueIdentifier || uuid();
  const fileName =
    file.filename ||
    file.name ||
    file.path.split('/').slice(-1).pop() ||
    'supportImage';

  onUploadStarted({
    id: fileIdentifier,
    name: fileName,
    count: file.currentCountData
  });

  async function uploadProcess() {
    let result;
    onUploadLoaded({
      // id: fileIdentifier,
      // preview:
      //   targetResult &&
      //   targetResult.indexOf('data:image/') === 0 &&
      //   targetResult.indexOf('data:image/tiff') === -1 &&
      //   targetResult.indexOf('data:image/tif') === -1
      //     ? targetResult
      //     : null
    });
    try {
      result = (
        await ambiApi.uploadToApi({
          url,
          file: {
            ...file,
            uri: file.path,
            name: fileName,
            type: file.mime || file.type || 'image/jpeg'
          },
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress({
              id: fileIdentifier,
              progress: percentCompleted,
              name: fileName,
              count: file.currentCountData
            });
          }
        })
      ).data;
    } catch (exception) {
      console.warn('Unable to upload file: ', JSON.stringify(exception));
      onUploadError({
        id: fileIdentifier,
        name: fileName,
        error: exception.message || 'Unable to upload file'
      });
    }
    onUploadFinished({
      id: fileIdentifier,
      name: fileName,
      file,
      result
    });
    return result;
  }
  return uploadProcess();
}

export default uploadFile;
