import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AskRoomComponent } from './pages/ask-room/ask-room.component';
import { RoomSetupComponent } from './pages/room-setup/room-setup.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'ask-room',
    component:AskRoomComponent
  },
  {
     path: 'room-setup',
    component: RoomSetupComponent
   }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
