import { useState, useEffect } from 'react';

const STORAGE_KEY = 'altar_user_session';

class UserAuthStore {
  constructor() {
    this.listeners = new Set();
    this.user = this.loadUser();
  }

  loadUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return !!this.user;
  }

  setUser(userData) {
    this.user = userData;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {}
    this.notify();
  }

  async loginWithGoogle({ email, name, avatarUrl }) {
    try {
      // Call backend API if online
      const res = await fetch('/api/auth?action=google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatarUrl })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          this.setUser(data.user);
          return { success: true, user: data.user };
        }
      }
    } catch {}

    // Fallback client session (works offline / demo)
    const fallbackUser = {
      id: `usr_g_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      avatarUrl: avatarUrl || '',
      authProvider: 'google'
    };
    this.setUser(fallbackUser);
    return { success: true, user: fallbackUser };
  }

  async registerWithEmail({ name, email, password }) {
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        this.setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch {}

    // Fallback client session
    const fallbackUser = {
      id: `usr_e_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      avatarUrl: '',
      authProvider: 'email'
    };
    this.setUser(fallbackUser);
    return { success: true, user: fallbackUser };
  }

  async loginWithEmail({ email, password }) {
    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        this.setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch {}

    // Fallback client session
    const fallbackUser = {
      id: `usr_e_${Date.now()}`,
      name: email.split('@')[0],
      email: email.trim(),
      avatarUrl: '',
      authProvider: 'email'
    };
    this.setUser(fallbackUser);
    return { success: true, user: fallbackUser };
  }

  logout() {
    this.user = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    this.notify();
  }
}

export const userAuthStore = new UserAuthStore();

export function useSanctuaryUser() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = userAuthStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  return {
    user: userAuthStore.getUser(),
    isLoggedIn: userAuthStore.isLoggedIn(),
    loginWithGoogle: (data) => userAuthStore.loginWithGoogle(data),
    registerWithEmail: (data) => userAuthStore.registerWithEmail(data),
    loginWithEmail: (data) => userAuthStore.loginWithEmail(data),
    logout: () => userAuthStore.logout()
  };
}
