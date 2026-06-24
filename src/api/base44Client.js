const noop = () => {};
const noopAsync = async () => {};

export const base44 = {
  auth: {
    me: noopAsync,
    logout: noop,
    redirectToLogin: noop,
    loginViaEmailPassword: noopAsync,
    loginWithProvider: noop,
    register: noopAsync,
    verifyOtp: noopAsync,
    setToken: noop,
    resendOtp: noopAsync,
    resetPasswordRequest: noopAsync,
    resetPassword: noopAsync,
  }
};
