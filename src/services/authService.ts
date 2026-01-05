import { User } from '../types';

// Stub authentication service
class AuthService {
  private currentUser: User | null = null;

  async login(username: string, _password: string): Promise<User> {
    // Stub implementation
    const user: User = {
      id: '1',
      username,
      email: `${username}@example.com`,
    };
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();
