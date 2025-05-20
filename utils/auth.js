export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (e) {
    console.error('Failed to parse user data', e);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  const logoutEvent = new CustomEvent('user-logged-out', {
    bubbles: true
  });
  document.dispatchEvent(logoutEvent);
  
  return true;
};

export const login = (userData, token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  
  const loginEvent = new CustomEvent('user-logged-in', {
    bubbles: true,
    detail: { userData }
  });
  document.dispatchEvent(loginEvent);
  
  return true;
};

export const getUserInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};