import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-main-room',
  templateUrl: './main-room.component.html'
})
export class MainRoomComponent implements OnInit {

  roomId!: string;
  username = 'User_' + Math.floor(Math.random() * 1000); // later from login
  role = 'user';

  members: any[] = [];
  buzzes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id')!;

    this.socketService.joinRoom({
      roomId: this.roomId,
      name: this.username,
      role: this.role
    });

    this.socketService.onMembersUpdated().subscribe((members:any) => {
      this.members = members;
    });

    this.socketService.onBuzz().subscribe((buzz:any) => {
      this.buzzes.unshift(buzz); // latest on top
    });
  }

  buzz() {
    this.socketService.buzz({
      roomId: this.roomId,
      name: this.username
    });
  }

    leaveRoom() {
    this.router.navigate(['/landing-page']);
  }
}
