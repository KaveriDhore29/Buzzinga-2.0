import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room-setup',
  templateUrl: './room-setup.component.html',
  styleUrls: ['./room-setup.component.css']
})
export class RoomSetupComponent implements OnInit {

   isOwner: boolean = false;

  constructor(private route: ActivatedRoute) {}

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
}
