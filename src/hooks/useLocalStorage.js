const useLocalStorage = (key) => {
  const setItem = (value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  const getItem = () => {
    return JSON.parse(window.localStorage.getItem("user"));
  };
  const removeItem = () => {
    window.localStorage.removeItem(key);
  };
  return { setItem, getItem, removeItem };
};

export default useLocalStorage;
