import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AskRoomComponent } from './pages/ask-room/ask-room.component';
import { RoomSetupComponent } from './pages/room-setup/room-setup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AskRoomComponent,
    RoomSetupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
