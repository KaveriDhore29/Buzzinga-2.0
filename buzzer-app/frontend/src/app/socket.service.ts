import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  joinRoom(data: any) {
    this.socket.emit('join-room', data);
  }

  onMembersUpdated(): Observable<any[]> {
    return new Observable(observer => {
      this.socket.on('members-updated', members => {
        observer.next(members);
      });
    });
  }

  buzz(data: any) {
    this.socket.emit('buzz', data);
  }

  onBuzz(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('buzzed', buzz => {
        observer.next(buzz);
      });
    });
  }
}
