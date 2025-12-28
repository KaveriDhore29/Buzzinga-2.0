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

  members: any[] = [];
  buzzes: { name: string; time: string }[] = [];

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
    
    // Get username and role from query params if available
    const nameFromParams = this.route.snapshot.queryParamMap.get('name');
    const roleFromParams = this.route.snapshot.queryParamMap.get('role');
    
    if (nameFromParams) {
      this.username = nameFromParams;
    }
    
    if (roleFromParams) {
      this.role = roleFromParams;
    }
  
    // Join room
    this.socketService.joinRoom({
      roomId: this.roomId,
      name: this.username,
      role: this.role
    });

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
  }
}
