import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask-room',
  templateUrl: './ask-room.component.html',
  styleUrls: ['./ask-room.component.css']
})
export class AskRoomComponent implements OnInit {

    constructor(private router: Router) {}

  ngOnInit(): void {
  }

  createRoom() {
    this.router.navigate(['/room-setup'], {
      queryParams: { role: 'owner' }
    });
  }

  joinRoom() {
    this.router.navigate(['/room-setup'], {
      queryParams: { role: 'user' }
    });
  }
}
