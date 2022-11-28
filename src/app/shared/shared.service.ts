import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay, of } from 'rxjs';
import { Image } from './shared.mdel';

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
}
