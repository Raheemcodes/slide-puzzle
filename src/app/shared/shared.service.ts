import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay, of } from 'rxjs';
import { Image, Pos, Tile } from './shared.mdel';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  images: Image[] = [
    { id: '1669575239760', src: './../../assets/dio.jpg' },
    { id: '1669575258505', src: './../../assets/naruto.jpg' },
  ];

  constructor(private router: Router) {}

  navigate(page: string) {
    return of('navigate')
      .pipe(delay(300))
      .subscribe(() => {
        this.router.navigate([page]);
      });
  }

  isSolveable(arr: Tile[]): boolean {
    const n = 3;

    let invCount: number = 0;

    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i].picId);
      for (let j = i + 1; j < arr.length; j++) {
        if (!!arr[i].posId && !!arr[j].posId && arr[i].posId! > arr[j].posId!) {
          invCount++;
        }
      }
    }

    console.log(arr);

    // const blankPosY: number = n - arr[arr.length - 1].posY!;

    console.log('n:' + n + ' inv:' + invCount);

    return !(invCount % 2);
  }
}
