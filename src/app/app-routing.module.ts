import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeListComponent } from './anime-list/anime-list.component';
import { FiveComponent } from './five/five.component';
import { FourComponent } from './four/four.component';
import { GameComponent } from './three/game/game.component';
import { ThreeComponent } from './three/three.component';

const routes: Routes = [
  {
    path: 'three',
    component: ThreeComponent,
    children: [
      { path: '', component: AnimeListComponent },
      { path: ':id', component: GameComponent },
    ],
  },
  { path: 'four', component: FourComponent },
  { path: 'five', component: FiveComponent },
  { path: '**', redirectTo: '/three' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
