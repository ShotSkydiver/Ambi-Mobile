import { ambiApi } from './AmbiApi';

describe('AmbiApi', () => {
  it('returns correct request options', () => {
    const options = ambiApi.getOptionsForMethod('GET', {});
    expect(options).toEqual({
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  });

  // it('checks if Async Storage is used', async () => {
  //   await asyncOperationOnAsyncStorage();

  //   expect(AsyncStorage.getItem).toBeCalledWith('myKey');
  // });
});
