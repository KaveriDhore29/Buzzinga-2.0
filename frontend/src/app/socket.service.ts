import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;
  private buzzSubject = new BehaviorSubject<any[]>([]);
  public buzzes$ = this.buzzSubject.asObservable();
  private destroy$ = new Subject<void>();
  private socketId: string | null = null;
  
  getSocketId(): string | null {
    return this.socketId;
  }

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    if (this.socket?.connected) {
      return; // Socket already initialized and connected
    }

    this.socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Set up listeners immediately (they will work once connected)
    this.setupListeners();

    // Wait for connection
    this.socket.on('connect', () => {
      this.socketId = this.socket?.id || null;
      console.log('Socket connected:', this.socketId);
    });

    // Handle reconnection - re-setup listeners to prevent duplicates
    this.socket.on('reconnect', () => {
      this.socketId = this.socket?.id || null;
      console.log('Socket reconnected:', this.socketId);
      this.setupListeners();
    });

    // Handle disconnection
    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }

  private setupListeners(): void {
    if (!this.socket) return;

    // Remove any existing listeners to prevent duplicates
    this.socket.off('buzz-history');
    this.socket.off('buzz-update');

    // Set up listeners (ONCE)
    this.socket.on('buzz-history', (buzzes: any[]) => {
      console.log('Received buzz-history:', buzzes);
      this.buzzSubject.next(buzzes || []);
    });

    this.socket.on('buzz-update', (buzz: any) => {
      console.log('Received buzz-update:', buzz);
      const current = this.buzzSubject.value;
      this.buzzSubject.next([buzz, ...current]);
    });
  }

  joinRoom(data: { roomId: string; name?: string; role?: string }): void {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected, waiting for connection...');
      this.socket?.once('connect', () => {
        this.socket?.emit('join-room', data);
      });
      return;
    }
    this.socket.emit('join-room', data);
  }

  buzz(data: { roomId: string; name?: string }): void {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    if (!this.socket.connected) {
      console.warn('Socket not connected, cannot buzz');
      return;
    }

    console.log('Emitting buzz:', data);
    this.socket.emit('buzz', data);
  }

  onMembersUpdated(): Observable<any> {
    if (!this.socket) {
      this.initializeSocket();
    }
    return fromEvent(this.socket!, 'members-updated');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
