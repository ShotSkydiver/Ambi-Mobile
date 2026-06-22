const debounce = function debounce(methodToCall, delay) {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      methodToCall(...args);
    }, delay);
  };
};

export { debounce as default };
