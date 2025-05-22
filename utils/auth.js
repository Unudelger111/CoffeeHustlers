// Hereglegch logged in bnu guyu shalgaj bga
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};
//Log in hiitsn bga hereglegchin medeelliig gargana
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
//Hereglegchiig log-out hiine
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  const logoutEvent = new CustomEvent('user-logged-out', {
    bubbles: true
  });
  document.dispatchEvent(logoutEvent);
  
  return true;
};
//Login hiine
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

//Hereglegchiin ehnii usgiig avna
export const getUserInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};