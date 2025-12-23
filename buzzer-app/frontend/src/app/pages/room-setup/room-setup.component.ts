import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-room-setup',
  templateUrl: './room-setup.component.html',
  styleUrls: ['./room-setup.component.css']
})
export class RoomSetupComponent implements OnInit {

   isOwner: boolean = false;

  constructor(private route: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {
    const role = this.route.snapshot.queryParamMap.get('role');
    this.isOwner = role === 'owner';
  }

  // UI switches (still useful)
  switchToOwner() {
    this.isOwner = true;
  }

  switchToUser() {
    this.isOwner = false;
  }

  startGame(){
       const dummyRoomId = 'ABCD1234'; // static for now
    this.router.navigate(['/main-room', dummyRoomId]);

  }
}
