import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay, of } from 'rxjs';
import { Image, Tile } from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  images: Image[] = [
    { id: '0', src: './../../assets/bounty.jpg' },
    { id: '1', src: './../../assets/chainsaw.jpg' },
    { id: '2', src: './../../assets/denji.jpg' },
    { id: '3', src: './../../assets/dio.jpg' },
    { id: '4', src: './../../assets/doffy.jpg' },
    { id: '5', src: './../../assets/hisoka.jpg' },
    { id: '6', src: './../../assets/jiraya.jpg' },
    { id: '7', src: './../../assets/lucifer.jpg' },
    { id: '8', src: './../../assets/naruto.jpg' },
    { id: '9', src: './../../assets/netero.jpg' },
    { id: '10', src: './../../assets/one-piece.jpg' },
    { id: '11', src: './../../assets/oneforall.jpeg' },
    { id: '12', src: './../../assets/tanjiro.jpg' },
    { id: '13', src: './../../assets/thorfin.jpg' },
    { id: '14', src: './../../assets/tosen.jpg' },
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
    const n = Math.sqrt(arr.length);

    let invCount: number = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].id && arr[j].id && arr[i].id! > arr[j].id!) {
          invCount++;
        }
      }
    }

    const blankPos: number = n - arr.find((el) => !el.id)?.posY!;

    if (n % 2) return !(invCount % 2);
    else if (!(n % 2) && blankPos % 2) return !(invCount % 2);
    else if (!(n % 2) && !(blankPos % 2)) return !!(invCount % 2);
    else return false;
  }
}
