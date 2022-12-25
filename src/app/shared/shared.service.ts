import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  four: Tile[] = [
    { posX: 0, posY: 0, id: 15, picX: 3, picY: 2 },
    { posX: 0, posY: 1, id: 8, picX: 1, picY: 3 },
    { posX: 0, posY: 2, id: 13, picX: 3, picY: 0 },
    { posX: 0, posY: 3, id: 14, picX: 3, picY: 1 },
    { posX: 1, posY: 0, id: 5, picX: 1, picY: 0 },
    { posX: 1, posY: 1, id: 7, picX: 1, picY: 2 },
    { posX: 1, posY: 2, id: 3, picX: 0, picY: 2 },
    { posX: 1, posY: 3, id: 2, picX: 0, picY: 1 },
    { posX: 2, posY: 0, id: 12, picX: 2, picY: 3 },
    { posX: 2, posY: 1, id: 11, picX: 2, picY: 2 },
    { posX: 2, posY: 2, id: 9, picX: 2, picY: 0 },
    { posX: 2, posY: 3, id: 4, picX: 0, picY: 3 },
    { posX: 3, posY: 0, id: 6, picX: 1, picY: 1 },
    { posX: 3, posY: 1, id: 10, picX: 2, picY: 1 },
    { posX: 3, posY: 2, id: 1, picX: 0, picY: 0 },
    { posX: 3, posY: 3, id: 0, picX: 3, picY: 3 },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  isSolveable(arr: Tile[]): boolean {
    const n = Math.sqrt(arr.length);

    console.log(n);

    let invCount: number = 0;

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].id && arr[j].id && arr[i].id! > arr[j].id!) {
          invCount++;
        }
      }
    }

    const blankPos: number = n - arr.find((el) => el.id == 0)?.posY!;

    console.log('inv: ' + invCount + ', blankPos: ' + blankPos);

    if (n % 2) return !(invCount % 2);
    else
      return (
        (invCount % 2 === 0 && blankPos % 2 !== 0) ||
        (invCount % 2 !== 0 && blankPos % 2 === 0)
      );
  }
}
