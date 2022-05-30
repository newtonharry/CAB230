export const getSession = () => {
  const jwt = localStorage.getItem("__token");
  // const jwt = Cookies.get("__session");
  return jwt;
};

export const setSession = (token) => {
  localStorage.setItem("__token", token);
};

export const removeSession = () => {
  localStorage.removeItem("__token");
};
