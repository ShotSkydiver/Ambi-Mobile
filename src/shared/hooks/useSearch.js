import { useState, useCallback } from 'react';
import debounce from '../utils/debounce';

function useSearch(socket) {
  const [searchResults, setSearchResults] = useState({});
  const onSearchText = useCallback(
    debounce(text => {
      if (text === '') {
        setSearchResults({});
        return;
      }
      if (socket) {
        socket.emit('search', text, (err, data) => {
          if (err) {
            console.warn('error searching..!', err);
          } else {
            setSearchResults(data);
          }
        });
      }
    }, 100),
    [socket]
  );
  const setSearchEmpty = useCallback(() => setSearchResults({}), []);

  return {
    searchResults,
    setSearchEmpty,
    onSearchText
  };
}

export default useSearch;
