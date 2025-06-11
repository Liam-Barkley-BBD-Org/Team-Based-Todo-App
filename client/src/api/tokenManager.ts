let inMemoryToken: string | null = null;
let tokenExpiryTimeout: NodeJS.Timeout | null = null;

const TOKEN_LIFETIME_MS = 14 * 60 * 1000; // Refresh before a 15 min expiry

export const tokenManager = {
  getToken: (): string | null => {
    return inMemoryToken;
  },
  setToken: (token: string): void => {
    inMemoryToken = token;
    if (tokenExpiryTimeout) clearTimeout(tokenExpiryTimeout);
    tokenExpiryTimeout = setTimeout(() => {
      inMemoryToken = null;
    }, TOKEN_LIFETIME_MS);
  },
  deleteToken: (): void => {
    inMemoryToken = null;
    if (tokenExpiryTimeout) {
      clearTimeout(tokenExpiryTimeout);
      tokenExpiryTimeout = null;
    }
  },
};