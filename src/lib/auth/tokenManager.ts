import 'client-only';

function createTokenManager() {
  let accessToken: string | null = null;
  let version = 0;

  return {
    set(token: string) {
      accessToken = token;
      version += 1;
    },

    clear() {
      accessToken = null;
      version += 1;
    },

    applyTo(headers: Headers) {
      if (accessToken && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return version;
    },

    hasChangedSince(previousVersion: number) {
      return version !== previousVersion;
    },
  };
}

const tokenManager = createTokenManager();

export { tokenManager };
