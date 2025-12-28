import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask-room',
  templateUrl: './ask-room.component.html',
  styleUrls: ['./ask-room.component.css']
})
export class AskRoomComponent implements OnInit {

  username: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  createRoom() {
    const name = this.username.trim() || `User_${Math.floor(Math.random() * 1000)}`;
    this.router.navigate(['/room-setup'], {
      queryParams: { role: 'owner', name: name }
    });
  }

  joinRoom() {
    const name = this.username.trim() || `User_${Math.floor(Math.random() * 1000)}`;
    this.router.navigate(['/room-setup'], {
      queryParams: { role: 'user', name: name }
    });
  }
}
