import { API_URL } from "../../../configs/constants";

// ** Auth Endpoints
export default {
  loginEndpoint: `${API_URL}/users/login`,
  registerEndpoint: "/jwt/register",
  refreshEndpoint: "/jwt/refresh-token",
  logoutEndpoint: "/jwt/logout",

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: "Bearer",

  userData: "userData",

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "userData",
  storageRefreshTokenKeyName: "refreshToken",
};
