import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-room',
  templateUrl: './main-room.component.html',
  styleUrls: ['./main-room.component.css']
})
export class MainRoomComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

   leaveRoom() {
    this.router.navigate(['/landing-page']);
  }

}
