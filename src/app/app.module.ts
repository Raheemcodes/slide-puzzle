import { NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ThreeComponent } from './three/three.component';
import { FourComponent } from './four/four.component';
import { FiveComponent } from './five/five.component';
import { AnimeListComponent } from './anime-list/anime-list.component';
import { GameComponent } from './game/game.component';
import { ClickDirective } from './click.directive';
import { WinComponent } from './win/win.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ThreeComponent,
    FourComponent,
    FiveComponent,
    AnimeListComponent,
    GameComponent,
    WinComponent,
  ],
  imports: [BrowserModule, NgOptimizedImage, ClickDirective, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
