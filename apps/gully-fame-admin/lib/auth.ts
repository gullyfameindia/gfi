'use client';

export type UserRole = 'admin' | 'sponsor';

export function getUserRole(): UserRole | null {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem('userRole');
  if (!role) return null;
  
  const normalizedRole = role.toLowerCase() as UserRole;
  return normalizedRole === 'admin' || normalizedRole === 'sponsor' ? normalizedRole : null;
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isLoggedIn') === 'true';
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isLoggedIn');
  
  window.dispatchEvent(new Event('storage'));
  window.location.href = '/login';
}

export function requireAuth(role?: UserRole): boolean {
  if (!isLoggedIn()) return false;
  if (role) {
    const userRole = getUserRole();
    return userRole === role;
  }
  return true;
}

