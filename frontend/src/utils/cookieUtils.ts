import Cookies from "js-cookie";

// Cookie configuration constants
const COOKIE_CONFIG = {
  TOKEN_NAME: "token",
  USER_TYPE_NAME: "userType", // New cookie for storing user type
  EXPIRES: 7, // 7 days
  SECURE: true,
  SAME_SITE: "strict" as const,
  PATH: "/",
};

/**
 * Token management utilities using js-cookie
 */
export class TokenManager {
  /**
   * Set authentication token in cookie
   * @param token - JWT token string
   * @param options - Optional cookie configuration overrides
   */
  static setToken(
    token: string,
    options?: Partial<typeof COOKIE_CONFIG>
  ): void {
    const config = { ...COOKIE_CONFIG, ...options };

    Cookies.set(config.TOKEN_NAME, token, {
      expires: config.EXPIRES,
      secure: config.SECURE,
      sameSite: config.SAME_SITE,
      path: config.PATH,
    });
  }

  /**
   * Get authentication token from cookie
   * @returns Token string or undefined if not found
   */
  static getToken(): string | undefined {
    return Cookies.get(COOKIE_CONFIG.TOKEN_NAME);
  }

  /**
   * Remove authentication token from cookie
   */
  static removeToken(): void {
    Cookies.remove(COOKIE_CONFIG.TOKEN_NAME, {
      path: COOKIE_CONFIG.PATH,
    });
  }

  /**
   * Check if user is authenticated (has valid token)
   * @returns boolean indicating if token exists
   */
  static isAuthenticated(): boolean {
    return !!TokenManager.getToken();
  }

  /**
   * Clear all authentication data
   */
  static clearAuth(): void {
    TokenManager.removeToken();
    TokenManager.removeUserType();
    // Add any other cleanup logic here if needed
  }

  /**
   * Set user type in cookie
   * @param userType - 'user' or 'captain'
   */
  static setUserType(userType: 'user' | 'captain'): void {
    Cookies.set(COOKIE_CONFIG.USER_TYPE_NAME, userType, {
      expires: COOKIE_CONFIG.EXPIRES,
      secure: COOKIE_CONFIG.SECURE,
      sameSite: COOKIE_CONFIG.SAME_SITE,
      path: COOKIE_CONFIG.PATH,
    });
  }

  /**
   * Get user type from cookie
   * @returns User type ('user' | 'captain') or undefined if not found
   */
  static getUserType(): 'user' | 'captain' | undefined {
    const userType = Cookies.get(COOKIE_CONFIG.USER_TYPE_NAME);
    return userType as 'user' | 'captain' | undefined;
  }

  /**
   * Remove user type from cookie
   */
  static removeUserType(): void {
    Cookies.remove(COOKIE_CONFIG.USER_TYPE_NAME, {
      path: COOKIE_CONFIG.PATH,
    });
  }
}

// Export individual functions for convenience
export const setToken = TokenManager.setToken;
export const getToken = TokenManager.getToken;
export const removeToken = TokenManager.removeToken;
export const isAuthenticated = TokenManager.isAuthenticated;
export const clearAuth = TokenManager.clearAuth;
export const setUserType = TokenManager.setUserType;
export const getUserType = TokenManager.getUserType;
export const removeUserType = TokenManager.removeUserType;
