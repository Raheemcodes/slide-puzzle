import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeListComponent } from './anime-list/anime-list.component';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { FiveComponent } from './five/five.component';
import { FourComponent } from './four/four.component';
import { GameComponent } from './game/game.component';
import { ThreeComponent } from './three/three.component';

const routes: Routes = [
  {
    path: 'three',
    component: ThreeComponent,
    children: [
      { path: '', component: AnimeListComponent },
      {
        path: ':id',
        component: GameComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { num: 3 },
      },
    ],
  },
  {
    path: 'four',
    component: FourComponent,
    children: [
      { path: '', component: AnimeListComponent },
      {
        path: ':id',
        component: GameComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { num: 4 },
      },
    ],
  },
  {
    path: 'five',
    component: FiveComponent,
    children: [
      { path: '', component: AnimeListComponent },
      {
        path: ':id',
        component: GameComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { num: 5 },
      },
    ],
  },
  { path: '**', redirectTo: '/three' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
