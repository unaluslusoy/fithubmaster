export const AUTH_API_ROUTES = {
  ADMIN: {
    LOGIN: "/api/auth/admin/login",
    LOGOUT: "/api/auth/admin/logout",
    ME: "/api/auth/admin/me",
  },
  TRAINER: {
    LOGIN: "/api/auth/trainer/login",
    REGISTER: "/api/auth/trainer/register",
    LOGOUT: "/api/auth/trainer/logout",
    ME: "/api/auth/trainer/me",
  },
  CLIENT: {
    LOGIN: "/api/auth/client/login",
    REGISTER: "/api/auth/client/register",
    LOGOUT: "/api/auth/client/logout",
    ME: "/api/auth/client/me",
  }
} as const;
