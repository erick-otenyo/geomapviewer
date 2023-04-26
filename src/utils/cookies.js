const isServer = typeof window !== "undefined";

export const COOKIES_SLUG = "agreeCookies";

export const getAgreedCookies = () =>
  isServer && JSON.parse(localStorage.getItem(COOKIES_SLUG));

export const setAgreedCookies = () =>
  isServer && localStorage.setItem(COOKIES_SLUG, true);

export const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
