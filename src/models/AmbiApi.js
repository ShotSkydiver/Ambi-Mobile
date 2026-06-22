// We use axios for upload progress only right now.

import axios from 'axios';
import perf from '@react-native-firebase/perf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiError from './ApiError';
import LocalError from './LocalError';

class AmbiApi {
  constructor() {
    this.accessToken = null;
  }

  async getApiUrl() {
    let apiUrl;
    try {
      apiUrl = await AsyncStorage.getItem('api-url');
    } catch (err) {
      console.error('error fetching api url', err);
    }
    return apiUrl;
  }

  handleResponse() {
    return async response => {
      if (
        response.headers.get('Content-Type').indexOf('application/json') === -1
      ) {
        throw new ApiError({
          status: 500,
          message: 'Received invalid response'
        });
      }
      let responseJson;
      try {
        responseJson = await response.json();
      } catch (exception) {
        throw new ApiError({
          status: 500,
          message: 'Unable to parse response'
        });
      }
      if (response.status >= 400 && response.status <= 599) {
        throw new ApiError({
          status: response.status === 404 ? 404 : 400,
          message: responseJson.error
        });
      }
      return responseJson;
    };
  }

  getOptionsForMethod(method, { body = null, controller = null }) {
    const options = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body:
        (method === 'POST' || method === 'PUT') && body
          ? JSON.stringify(body)
          : undefined
    };
    if (this.accessToken) {
      options.headers.Authorization = `Bearer ${this.accessToken}`;
    }
    if (controller) {
      options.signal = controller.signal;
    }
    return options;
  }

  async buildFetchCommand(method, url, options = {}) {
    const apiUrl = await this.getApiUrl();
    const finalUrl = `https://${apiUrl}${url}`;
    return fetch(finalUrl, this.getOptionsForMethod(method, options))
      .then(this.handleResponse())
      .then(response => {
        return response;
      });
  }

  postToApi({ url, body, controller }) {
    return this.buildFetchCommand('POST', url, { body, controller });
  }

  getFromApi(parameters) {
    let url;
    let controller;
    if (typeof parameters === 'string') {
      url = parameters;
    } else {
      ({ url, controller } = parameters);
    }
    return this.buildFetchCommand('GET', url, { controller });
  }

  deleteFromApi({ url, body, controller }) {
    return this.buildFetchCommand('DELETE', url, { body, controller });
  }

  putToApi({ url, body }) {
    return this.buildFetchCommand('PUT', url, { body });
  }

  async uploadToApi({ url, file, onUploadProgress }) {
    if (!file) {
      throw new LocalError('Parameter `file` is required to upload');
    }
    if (!file.uri) {
      throw new LocalError(
        'Upload method expects `file.uri` as a parameter (local file URI on device)'
      );
    }
    if (!file.name) {
      throw new LocalError(
        'Upload method expects `file.name` as a parameter (local filename)'
      );
    }

    if (!file.type) {
      throw new LocalError('Upload methods expects `file.type` as a parameter');
    }

    const apiUrl = await this.getApiUrl();
    const finalUrl = `https://${apiUrl}${url}`;
    const formData = new FormData();
    formData.append('file', file);

    const uploadingProgress = progressEvent => {
      console.warn('progress: ', progressEvent);
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.warn('%: ', percentCompleted);
    };

    const axiosInstance = axios.create({
      method: 'POST',
      // url: finalUrl,
      // data: formData,
      onUploadProgress: onUploadProgress || uploadingProgress,
      headers: this.accessToken && {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    axiosInstance.interceptors.request.use(async config => {
      try {
        const httpMetric = perf().newHttpMetric(config.url, config.method);
        // eslint-disable-next-line no-param-reassign
        config.metadata = { httpMetric };

        await httpMetric.start();
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        return config;
      }
    });

    axiosInstance.interceptors.response.use(
      async response => {
        try {
          const { httpMetric } = response.config.metadata;
          httpMetric.setHttpResponseCode(response.status);
          httpMetric.setResponseContentType(response.headers['content-type']);
          await httpMetric.stop();
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return response;
        }
      },
      async error => {
        try {
          const { httpMetric } = error.config.metadata;
          httpMetric.setHttpResponseCode(error.response.status);
          httpMetric.setResponseContentType(
            error.response.headers['content-type']
          );
          await httpMetric.stop();
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return Promise.reject(error);
        }
      }
    );

    return axiosInstance.post(finalUrl, formData);
  }

  setTokens({ accessToken, idToken, refreshToken }) {
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.refreshToken = refreshToken;
  }

  getTokens() {
    return {
      accessToken: this.accessToken,
      idToken: this.idToken,
      refreshToken: this.refreshToken
    };
  }
}

const ambiApi = new AmbiApi();

export { ambiApi, ambiApi as default };
