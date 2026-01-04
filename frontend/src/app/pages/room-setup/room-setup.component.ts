import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { generateRoomId } from 'src/app/utils/room-id.util';
import { AuthService, User } from 'src/app/services/auth.service';
import { SessionsService } from 'src/app/services/sessions.service';

@Component({
  selector: 'app-room-setup',
  templateUrl: './room-setup.component.html',
  styleUrls: ['./room-setup.component.css']
})
export class RoomSetupComponent implements OnInit {

  isOwner: boolean = false;
  roomId: string = '';
  roomLink: string = '';
  copied = false;
  maxPlayers: number | null = null;
  sessionName: string = '';
  saveSession: boolean = false;
  sessionTime: string = '';
  language: string = 'English';
  username: string = '';
  userRoomId: string = ''; // For user view room ID input
  currentUser: User | null = null;
  @ViewChild('validationModal') modalRef!: ElementRef;

  constructor(
    private route: ActivatedRoute, 
    public router: Router,
    public authService: AuthService,
    private sessionsService: SessionsService
  ) { }

  ngOnInit(): void {
    
    const role = this.route.snapshot.queryParamMap.get('role');
    this.isOwner = role === 'owner';
    
    // Get username from query params, or use logged-in user's name, or default
    const nameFromParams = this.route.snapshot.queryParamMap.get('name');
    this.username = nameFromParams || '';

    // Check if user is logged in
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // If no name from query params and user is logged in, use their name
      if (!nameFromParams && user?.name) {
        this.username = user.name;
      }
    });

    if (this.isOwner) {
      this.roomId = generateRoomId(8);
      if(this.roomId){
        this.roomLink = `${window.location.origin}/main-room/${this.roomId}`;
      }
    }
  }

  // UI switches (still useful)
  switchToOwner() {
    this.isOwner = true;
    // Generate room ID and link when switching to owner mode
    if (!this.roomId) {
      this.roomId = generateRoomId(8);
      if (this.roomId) {
        this.roomLink = `${window.location.origin}/main-room/${this.roomId}`;
      }
    }
  }

  switchToUser() {
    this.isOwner = false;
  }

  showModal() {
    this.modalRef.nativeElement.classList.add('show');
    this.modalRef.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.modalRef.nativeElement.classList.remove('show');
    this.modalRef.nativeElement.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  generateDefaultSessionName(): string {
    const names = [
      'Buzzinga Blitz',
      'Quick Buzzer Challenge',
      'Buzzinga Speed Round',
      'Rapid Response Session',
      'Buzzinga Lightning Round',
      'Fast Fingers Challenge',
      'Buzzinga Quick Fire',
      'Speed Buzzer Battle'
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  onSaveSessionChange(): void {
    if (this.saveSession && !this.authService.isLoggedIn()) {
      // User wants to save but not logged in, redirect to login
      const returnUrl = this.router.url;
      this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
      this.saveSession = false; // Reset checkbox
    }
  }

  goToLogin(): void {
    const returnUrl = this.router.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
  }

  startGame() {
     if (!this.maxPlayers || !this.sessionTime) {
      this.showModal();
      return;
    }

    // Check if user wants to save session but is not logged in
    if (this.saveSession && !this.authService.isLoggedIn()) {
      const returnUrl = this.router.url;
      this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
      return;
    }
    
    // Use provided session name or generate a default one
    const sessionNameToUse = this.sessionName.trim() || this.generateDefaultSessionName();
    
    // Save session to database if user wants to save it
    if (this.saveSession && this.authService.isLoggedIn() && this.isOwner) {
      this.sessionsService.saveSession({
        roomId: this.roomId,
        sessionName: sessionNameToUse,
        maxPlayers: this.maxPlayers,
        sessionTime: parseInt(this.sessionTime),
        language: this.language,
        buzzes: [],
        members: []
      }).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Session saved successfully');
          }
        },
        error: (error) => {
          console.error('Error saving session:', error);
          // Continue to navigate even if save fails
        }
      });
    }
    
    this.router.navigate(['/main-room', this.roomId], {
      queryParams: { 
        name: this.username, 
        role: this.isOwner ? 'owner' : 'user',
        maxPlayers: this.maxPlayers,
        sessionTime: this.sessionTime,
        sessionName: sessionNameToUse
      }
    });
  }

  joinRoomAsUser() {
    if (!this.userRoomId || this.userRoomId.trim() === '') {
      alert('Please enter a Room ID');
      return;
    }
    this.router.navigate(['/main-room', this.userRoomId.trim()], {
      queryParams: { name: this.username, role: 'user' }
    });
  }

  goBack() {
    this.router.navigate(['/ask-room']);
  }

  copyLink() {
  if (!this.roomLink) return;

  navigator.clipboard.writeText(this.roomLink)
    .then(() => {
      this.copied = true;

      // hide message after 2 seconds
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    })
    .catch(err => {
      console.error('Copy failed', err);
    });
}

}
