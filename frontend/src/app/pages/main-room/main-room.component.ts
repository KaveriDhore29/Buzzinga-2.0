import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-room',
  templateUrl: './main-room.component.html'
})
export class MainRoomComponent implements OnInit, OnDestroy {

  roomId!: string;
  username = 'User_' + Math.floor(Math.random() * 1000); // later from login
  role = 'user';
  maxPlayers: number | null = null;
  sessionTime: string | null = null;

  members: any[] = [];
  buzzes: { name: string; time: string }[] = [];
  
  // Timer related
  timeRemaining: string = '';
  sessionEndTime: number | null = null;
  timerInterval: any = null;
  isSessionEnded: boolean = false;

  private subscriptions = new Subscription();

  // Expose socketService to template for getSocketId() call
  constructor(
    private route: ActivatedRoute,
    public socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';
    
    if (!this.roomId) {
      console.error('Room ID not found in route parameters');
      this.router.navigate(['/landing-page']);
      return;
    }
    
    // Get username, role, maxPlayers, and sessionTime from query params if available
    const nameFromParams = this.route.snapshot.queryParamMap.get('name');
    const roleFromParams = this.route.snapshot.queryParamMap.get('role');
    const maxPlayersParam = this.route.snapshot.queryParamMap.get('maxPlayers');
    const sessionTimeParam = this.route.snapshot.queryParamMap.get('sessionTime');
    
    if (nameFromParams) {
      this.username = nameFromParams;
    }
    
    if (roleFromParams) {
      this.role = roleFromParams;
    }

    if (maxPlayersParam) {
      this.maxPlayers = parseInt(maxPlayersParam);
    }

    if (sessionTimeParam) {
      this.sessionTime = sessionTimeParam;
    }
  
    // Join room with maxPlayers and sessionTime (only owner sets these initially)
    this.socketService.joinRoom({
      roomId: this.roomId,
      name: this.username,
      role: this.role,
      maxPlayers: this.maxPlayers || undefined,
      sessionTime: this.sessionTime || undefined
    });

    // Subscribe to room info updates
    const roomInfoSub = this.socketService.onRoomInfo().subscribe((info: any) => {
      if (info) {
        this.maxPlayers = info.maxPlayers;
        this.sessionTime = info.sessionTime ? info.sessionTime.toString() : null;
        this.sessionEndTime = info.sessionEndTime;
        if (info.sessionEndTime) {
          this.startTimer();
        }
      }
    });
    this.subscriptions.add(roomInfoSub);

    // Subscribe to room-full errors
    const roomFullSub = this.socketService.onRoomFull().subscribe((error: any) => {
      alert(error.message || 'Room is full');
      this.router.navigate(['/landing-page']);
    });
    this.subscriptions.add(roomFullSub);

    // Subscribe to session ended
    const sessionEndedSub = this.socketService.onSessionEnded().subscribe(() => {
      this.isSessionEnded = true;
      this.timeRemaining = 'Session Ended';
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      alert('Session has ended!');
    });
    this.subscriptions.add(sessionEndedSub);

    // Subscribe to general errors
    const errorSub = this.socketService.onError().subscribe((error: any) => {
      alert(error.message || 'An error occurred');
    });
    this.subscriptions.add(errorSub);

    // Subscribe to members updates
    const membersSub = this.socketService.onMembersUpdated().subscribe((members: any) => {
      this.members = members || [];
    });
    this.subscriptions.add(membersSub);

    // Subscribe to buzzes
    const buzzesSub = this.socketService.buzzes$.subscribe((buzzes) => {
      this.buzzes = buzzes || [];
    });
    this.subscriptions.add(buzzesSub);

    // Request room info
    this.socketService.getRoomInfo(this.roomId);
  }

  startTimer(): void {
    if (!this.sessionEndTime) return;

    // Clear any existing timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Update immediately
    this.updateTimer();

    // Update every second
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer(): void {
    if (!this.sessionEndTime) {
      this.timeRemaining = '';
      return;
    }

    const now = Date.now();
    const remaining = this.sessionEndTime - now;

    if (remaining <= 0) {
      this.timeRemaining = 'Session Ended';
      this.isSessionEnded = true;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    this.timeRemaining = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  buzz(): void {
    // Validate roomId and username before buzzing
    if (!this.roomId) {
      console.error('Cannot buzz: roomId is missing');
      return;
    }
    
    if (!this.username || this.username.trim() === '') {
      console.error('Cannot buzz: username is missing or empty');
      return;
    }

    this.socketService.buzz({
      roomId: this.roomId,
      name: this.username
    });
  }

  leaveRoom(): void {
    this.router.navigate(['/landing-page']);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
    
    // Clear timer interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
