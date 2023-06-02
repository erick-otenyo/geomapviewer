import { apiRequest, apiAuthRequest } from "@/utils/request";

const isServer = typeof window === "undefined";

export function getCookie(name) {
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
}

export function setServerCookie(token) {
  fetch("/api/set-cookie", { method: "POST", body: JSON.stringify({ token }) });
}

export function removeServerCookie() {
  fetch("/api/set-cookie", { method: "GET" });
}

export const setUserToken = (token) => {
  if (!isServer) {
    localStorage.setItem("userToken", token);
    apiAuthRequest.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

export const setRefreshToken = (token) => {
  if (!isServer) {
    localStorage.setItem("refreshToken", token);
  }
};

export const login = async (formData) => {
  const csrfToken = getCookie("csrftoken");
  const headers = {};
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  const response = await apiRequest({
    method: "POST",
    url: "/auth/token/",
    data: formData,
    headers: headers,
  });

  if (response.status < 400 && response.data) {
    const { data } = response;

    setUserToken(data.access);
    setRefreshToken(data.refresh);
  }
  return response;
};

export const register = (formData) => {
  const csrfToken = getCookie("csrftoken");
  const headers = {};
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }
  return apiRequest.post(
    "/auth/register/",
    { ...formData },
    { headers: headers }
  );
};

export const resetPassword = (formData) => {
  const csrfToken = getCookie("csrftoken");
  const headers = {};
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }
  return apiRequest.post("/auth/reset-password/", formData, {
    headers: headers,
  });
};

export const getProfile = (id) =>
  apiAuthRequest.get(`/geomanager-profile/${id}`);

export const updateProfile = (id, data) => {
  const csrfToken = getCookie("csrftoken");
  const headers = {};
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  return apiAuthRequest({
    method: "PATCH",
    data,
    url: `/geomanager-profile/update/${id}`,
    headers: headers,
  });
};

export const checkLoggedIn = (token) => {
  if (
    token &&
    apiAuthRequest.defaults.headers.Authorization === "Bearer {token}"
  ) {
    setUserToken(token);
  }

  const csrfToken = getCookie("csrftoken");
  const headers = {};
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  const refreshToken = localStorage.getItem("refreshToken");

  let payload = {};

  if (refreshToken) {
    payload = {
      refresh: refreshToken,
      token: token,
    };
  }

  return apiAuthRequest
    .post("/auth/token/verify/", payload, { headers: headers })
    .then((res) => {
      const { access } = res.data;

      if (access) {
        setUserToken(access);
      }

      return res;
    });
};

export const logout = () => {
  const refreshToken = localStorage.getItem("refreshToken");

  return apiAuthRequest
    .post("/auth/logout", {
      refreshToken: refreshToken,
    })
    .then((response) => {
      if (response.status < 400 && !isServer) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("refreshToken");

        window.location.reload();
      }
    })
    .catch((err) => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("refreshToken");

      window.location.reload();
    });
};
