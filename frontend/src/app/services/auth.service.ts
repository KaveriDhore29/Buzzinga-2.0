import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is logged in from localStorage
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
      // Verify token is still valid
      this.verifyToken();
    }
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    if (userStr && token) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  login(email: string, password: string): Observable<{ success: boolean; user?: User; message?: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((response: AuthResponse) => {
          if (response.success && response.user && response.token) {
            const user: User = {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name
            };
            
            // Store user and token
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('authToken', response.token);
            this.currentUserSubject.next(user);
            
            return { success: true, user };
          } else {
            return { success: false, message: response.message || 'Login failed' };
          }
        }),
        catchError((error) => {
          const message = error.error?.message || 'An error occurred during login';
          return throwError(() => ({ success: false, message }));
        })
      );
  }

  register(email: string, password: string, name: string): Observable<{ success: boolean; user?: User; message?: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password, name })
      .pipe(
        map((response: AuthResponse) => {
          if (response.success && response.user && response.token) {
            const user: User = {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name
            };
            
            // Store user and token
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('authToken', response.token);
            this.currentUserSubject.next(user);
            
            return { success: true, user };
          } else {
            return { success: false, message: response.message || 'Registration failed' };
          }
        }),
        catchError((error) => {
          const message = error.error?.message || 'An error occurred during registration';
          return throwError(() => ({ success: false, message }));
        })
      );
  }

  verifyToken(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.logout();
      return;
    }

    this.http.get<AuthResponse>(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
      },
      error: () => {
        this.logout();
      }
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null && localStorage.getItem('authToken') !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

