import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Session {
  id: string;
  roomId: string;
  sessionName: string;
  maxPlayers?: number | null;
  sessionTime?: number | null;
  language?: string;
  buzzes?: { name: string; time: string }[];
  members?: { id: string; name: string; role: string }[];
  startedAt?: Date;
  endedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SessionResponse {
  success: boolean;
  message?: string;
  session?: Session;
  sessions?: Session[];
}

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  private apiUrl = 'http://localhost:3000/api/sessions';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  saveSession(sessionData: {
    roomId: string;
    sessionName: string;
    maxPlayers?: number | null;
    sessionTime?: number | null;
    language?: string;
    buzzes?: { name: string; time: string }[];
    members?: { id: string; name: string; role: string }[];
  }): Observable<{ success: boolean; session?: Session; message?: string }> {
    return this.http.post<SessionResponse>(this.apiUrl, sessionData, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((response: SessionResponse) => {
        if (response.success && response.session) {
          return { success: true, session: response.session };
        } else {
          return { success: false, message: response.message || 'Failed to save session' };
        }
      }),
      catchError((error) => {
        const message = error.error?.message || 'An error occurred while saving session';
        return throwError(() => ({ success: false, message }));
      })
    );
  }

  getSessions(): Observable<{ success: boolean; sessions?: Session[]; message?: string }> {
    return this.http.get<SessionResponse>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((response: SessionResponse) => {
        if (response.success && response.sessions) {
          return { success: true, sessions: response.sessions };
        } else {
          return { success: false, message: response.message || 'Failed to fetch sessions' };
        }
      }),
      catchError((error) => {
        const message = error.error?.message || 'An error occurred while fetching sessions';
        return throwError(() => ({ success: false, message }));
      })
    );
  }

  getSession(sessionId: string): Observable<{ success: boolean; session?: Session; message?: string }> {
    return this.http.get<SessionResponse>(`${this.apiUrl}/${sessionId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((response: SessionResponse) => {
        if (response.success && response.session) {
          return { success: true, session: response.session };
        } else {
          return { success: false, message: response.message || 'Failed to fetch session' };
        }
      }),
      catchError((error) => {
        const message = error.error?.message || 'An error occurred while fetching session';
        return throwError(() => ({ success: false, message }));
      })
    );
  }
}

