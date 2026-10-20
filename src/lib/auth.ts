const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123456';
const LOGIN_FLAG = 'pf:isLoggedIn';

export function login(username: string, password: string): boolean {
  const ok = username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  if (ok) localStorage.setItem(LOGIN_FLAG, 'true');
  return ok;
}

export function logout(): void {
  localStorage.removeItem(LOGIN_FLAG);
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(LOGIN_FLAG) === 'true';
}
