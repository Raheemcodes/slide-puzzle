import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-win',
  templateUrl: './win.component.html',
  styleUrls: ['./win.component.scss'],
})
export class WinComponent implements OnInit, OnDestroy {
  num!: number;
  interval: number = 5;
  intervalFn: any;

  constructor() {}

  ngOnInit(): void {
    let audio = new Audio('./../../assets/audio/applause.mp3');
    audio.load();
    audio.play();
    this.num = Math.round(Math.random() * 1);

    this.intervalFn = setInterval(() => {
      this.interval--;

      if (this.interval == 0) {
        clearInterval(this.intervalFn);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalFn) clearInterval(this.intervalFn);
  }
}
