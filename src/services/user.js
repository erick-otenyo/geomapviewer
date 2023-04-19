import { apiRequest, apiAuthRequest } from "@/utils/request";

const isServer = typeof window === "undefined";

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

export const login = (formData) =>
  apiRequest({
    method: "POST",
    url: "/auth/login",
    data: formData,
  }).then((response) => {
    if (response.status < 400 && response.data) {
      const { data } = response;

      setUserToken(data.token);
      setRefreshToken(data.refreshToken);
    }

    return response;
  });

export const register = (formData) =>
  apiRequest.post("/auth/sign-up", { ...formData });

export const resetPassword = (formData) =>
  apiRequest.post("/auth/reset-password", formData);

export const updateProfile = (id, data) =>
  apiAuthRequest({
    method: "PATCH",
    data,
    url: `/user/${id}`,
  });

export const checkLoggedIn = (token) => {
  if (
    token &&
    apiAuthRequest.defaults.headers.Authorization === "Bearer {token}"
  ) {
    setUserToken(token);
  }

  const refreshToken = localStorage.getItem("refreshToken");

  let payload = {};

  if (refreshToken) {
    payload = {
      refreshToken: refreshToken,
      grantType: "refresh_token",
    };
  }

  return apiAuthRequest.post("/auth/check-logged", payload).then((res) => {
    const { access_token, refresh_token } = res.data;

    if (access_token && refresh_token) {
      setUserToken(access_token);
      setRefreshToken(refresh_token);
    }

    return res;
  });
};

export const getProfile = (id) => apiAuthRequest.get(`/user/${id}`);

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
