'use client';

export const useLogout = () => {
  const logout = () => {
    localStorage.removeItem('mono_token');
    localStorage.removeItem('mono_user');
    // Force full page reload to reset all state
    window.location.href = '/';
  };

  return { logout };
};
