export function getAuthToken(): string | null {
  return localStorage.getItem('jwt_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('jwt_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('auth_user');
}

export function getStoredUser(): string | null {
  return localStorage.getItem('auth_user');
}

export function setStoredUser(user: string): void {
  localStorage.setItem('auth_user', user);
}
