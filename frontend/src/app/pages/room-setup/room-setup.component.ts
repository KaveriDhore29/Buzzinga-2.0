import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { generateRoomId } from 'src/app/utils/room-id.util';

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
   @ViewChild('validationModal') modalRef!: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    
    const role = this.route.snapshot.queryParamMap.get('role');
    this.isOwner = role === 'owner';
    
    // Get username from query params
    this.username = this.route.snapshot.queryParamMap.get('name') || '';

    if (this.isOwner) {
      this.roomId = generateRoomId(8);
      if(this.roomId){
        this.roomLink = `http://localhost:4200/room/${this.roomId}`;
      }
      
    }
  }

  // UI switches (still useful)
  switchToOwner() {
    this.isOwner = true;
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

  startGame() {
     if (!this.maxPlayers || !this.sessionTime) {
      this.showModal();
      return;
    }
    this.router.navigate(['/main-room', this.roomId], {
      queryParams: { 
        name: this.username, 
        role: this.isOwner ? 'owner' : 'user',
        maxPlayers: this.maxPlayers,
        sessionTime: this.sessionTime
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
