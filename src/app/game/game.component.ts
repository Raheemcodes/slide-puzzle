import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, UrlTree, Router } from '@angular/router';
import { Observable, of, delay } from 'rxjs';
import { CanComponentDeactivate } from '../can-deactivate.guard';
import { Pic, Pos, Tile } from '../shared/shared.model';
import { SharedService } from './../shared/shared.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent
  implements OnInit, CanComponentDeactivate, OnDestroy
{
  num!: number;
  src!: string;
  id!: string;
  @ViewChild('puzzleEl') puzzleEl!: ElementRef<HTMLElement>;
  isPlaying: boolean = false;
  isEnd: boolean = false;
  isSliding: boolean = false;
  isWon: boolean = false;
  timeout: any;
  // audio = new Audio('./../../assets/audio/whoosh.mp3');

  puzzle!: Tile[];
  pic!: Pic[];
  pos!: Pos[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public sharedSv: SharedService,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.num = this.route.snapshot.data['num'];

    this.findImg();

    this.puzzle = this.genPuzArr();
    this.pos = this.genPosArr();
    this.pic = this.genPicArr();

    this.cd.detectChanges();
    this.resize();
  }

  genPuzArr(): Tile[] {
    const val = Math.pow(this.num, 2);
    const arr: Tile[] = [];

    for (let i = 0; i < val; i++) {
      const [x, y] = i.toString(this.num).padStart(2, '0');

      arr[i] = { picX: +x, picY: +y, posX: +x, posY: +y };
    }

    return arr;
  }

  genPicArr(): Pic[] {
    const val = Math.pow(this.num, 2);
    const arr: Pic[] = [];

    for (let i = 0; i < val; i++) {
      const [x, y] = i.toString(this.num).padStart(2, '0');

      arr[i] = { id: i == val - 1 ? 0 : i + 1, picX: +x, picY: +y };
    }

    return arr;
  }

  genPosArr(): Pos[] {
    const val = Math.pow(this.num, 2);
    const arr: Pos[] = [];

    for (let i = 0; i < val; i++) {
      const [x, y] = i.toString(this.num).padStart(2, '0');

      arr[i] = { posX: +x, posY: +y };
    }

    return arr;
  }

  findImg() {
    this.sharedSv.images.find((img) => {
      if (img.id === this.id) this.src = img.src;
    });
  }

  @HostListener('window:resize') resize() {
    if (this.puzzleEl) {
      const puzzle = this.puzzleEl.nativeElement;

      if (innerHeight < innerWidth) this.renderer.addClass(puzzle, 'height');
      else this.renderer.removeClass(puzzle, 'height');
    }
  }

  shuffle(): Tile[] {
    const puzzle: Tile[] =
      this.num == 4 ? [...this.sharedSv.four] : [...this.pic];

    for (let i = puzzle.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * puzzle.length);
      let temp = puzzle[i];
      puzzle[i] = puzzle[j];
      puzzle[j] = temp;
    }

    for (let i = 0; i < puzzle.length; i++) {
      puzzle[i] = { ...this.pos[i], ...puzzle[i] };
    }

    return puzzle;
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      // this.audio.load();

      let puzzle = [...this.shuffle()];
      console.log(puzzle);

      // adjust using while loop
      while (!this.sharedSv.isSolveable(puzzle)) {
        puzzle = [...this.shuffle()];
      }

      puzzle = [...puzzle].filter((tile) => tile.id);

      this.puzzle = puzzle;
      console.log(this.puzzle);
    }
  }

  restart() {
    this.isPlaying = false;
    this.isEnd = false;
    this.isSliding = false;
    this.isWon = false;

    this.start();
  }

  slide(idx: number) {
    if (this.isPlaying && !this.isSliding) {
      this.isSliding = true;
      // this.audio.currentTime = 0;

      let posX = +this.puzzle[idx]['posX']!;
      let posY = +this.puzzle[idx]['posY']!;

      if (!this.move(idx, -1, 0)) {
        // left
        const newPosX = --posX;
        // this.audio.play();

        this.puzzle[idx]['posX'] = newPosX;
      } else if (!this.move(idx, 1, 0)) {
        // right
        const newPosX = ++posX;
        // this.audio.play();

        this.puzzle[idx]['posX'] = newPosX;
      } else if (!this.move(idx, 0, -1)) {
        // top
        const newPosY = --posY;
        // this.audio.play();

        this.puzzle[idx]['posY'] = newPosY;
      } else if (!this.move(idx, 0, 1)) {
        // bottom
        const newPosY = ++posY;
        // this.audio.play();

        this.puzzle[idx]['posY'] = newPosY;
      }

      const slideInterval = setTimeout(() => {
        this.isSliding = false;

        if (this.isSolved()) {
          this.isEnd = true;
          this.isPlaying = false;

          setTimeout(() => {
            this.isWon = true;

            this.timeout = setTimeout(this.restart.bind(this), 5000);
          }, 1000);

          clearInterval(slideInterval);
        }
      }, 300);
    }
  }

  move(id: number, x: number, y: number) {
    const posX: number = +this.puzzle[id]['posX']!;
    const posY: number = +this.puzzle[id]['posY']!;
    const newPosX = posX + x > this.num - 1 || posX + x < 0 ? posX : posX + x;
    const newPosY = posY + y > this.num - 1 || posY + y < 0 ? posY : posY + y;

    return this.puzzle.some((tile) => {
      if (+tile['posX']! == newPosX && +tile['posY']! == newPosY) {
        return true;
      } else return false;
    });
  }

  isSolved() {
    return this.puzzle.every(
      (tile) => tile.picX === tile.posX && tile.picY === tile.posY
    );
  }

  navigate(page: string) {
    return of('navigate')
      .pipe(delay(300))
      .subscribe(() => {
        this.router.navigate([page + '/'], { relativeTo: this.route });
      });
  }

  canDeactivate():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.isPlaying) return confirm('Are yoou sure you want to quit?');
    else return true;
  }

  ngOnDestroy(): void {
    if (this.timeout) clearTimeout(this.timeout);
  }
}
