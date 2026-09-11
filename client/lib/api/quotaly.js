import { clearWorkspaceToken, markDisconnected, request, saveWorkspaceToken } from './client.js';

export const quotaly = {
  async session(signal) {
    const result = await request('/sandbox/session', { signal });
    if (!result.active) clearWorkspaceToken();
    return result;
  },
  async startSandbox(signal) {
    const result = await request('/sandbox/session', { method: 'POST', body: {}, signal });
    saveWorkspaceToken(result.token);
    return result;
  },
  disconnect() {
    markDisconnected();
  },
  async endSandbox(signal) {
    await request('/sandbox/session', { method: 'DELETE', signal });
    clearWorkspaceToken();
  },
};
