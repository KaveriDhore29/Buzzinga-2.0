import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SessionsService, Session } from 'src/app/services/sessions.service';

@Component({
  selector: 'app-my-sessions',
  templateUrl: './my-sessions.component.html',
  styleUrls: ['./my-sessions.component.css']
})
export class MySessionsComponent implements OnInit {
  sessions: Session[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  currentUser: any = null;

  constructor(
    private sessionsService: SessionsService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadSessions();
      } else {
        // Redirect to login if not logged in
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/my-sessions' } });
      }
    });
  }

  loadSessions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.sessionsService.getSessions().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.sessions) {
          this.sessions = response.sessions;
        } else {
          this.errorMessage = response.message || 'Failed to load sessions';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'An error occurred while loading sessions';
        console.error('Error loading sessions:', error);
      }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  viewSession(session: Session): void {
    // Navigate to main room with session details
    this.router.navigate(['/main-room', session.roomId], {
      queryParams: {
        name: this.currentUser?.name || 'User',
        role: 'owner',
        sessionName: session.sessionName
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/room-setup'], {
      queryParams: { role: 'owner', name: this.currentUser?.name || '' }
    });
  }
}

