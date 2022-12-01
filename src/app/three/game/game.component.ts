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
import { ActivatedRoute, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/can-deactivate.guard';
import { Pic, Pos, Tile } from 'src/app/shared/shared.mdel';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent
  implements OnInit, CanComponentDeactivate, OnDestroy
{
  num: number = 3;
  src!: string;
  id!: string;
  @ViewChild('puzzleEl') puzzleEl!: ElementRef<HTMLElement>;
  isPlaying: boolean = false;
  isSliding: boolean = false;
  timeout: any;

  puzzle!: Tile[];
  pic: Pic[] = [
    { picId: 1, picX: 0, picY: 0 },
    { picId: 2, picX: 0, picY: 1 },
    { picId: 3, picX: 0, picY: 2 },
    { picId: 4, picX: 1, picY: 0 },
    { picId: 5, picX: 1, picY: 1 },
    { picId: 6, picX: 1, picY: 2 },
    { picId: 7, picX: 2, picY: 0 },
    { picId: 8, picX: 2, picY: 1 },
    { picId: 0, picX: 2, picY: 2 },
  ];
  pos: Pos[] = [
    { posId: 1, posX: 0, posY: 0 },
    { posId: 2, posX: 0, posY: 1 },
    { posId: 3, posX: 0, posY: 2 },
    { posId: 4, posX: 1, posY: 0 },
    { posId: 5, posX: 1, posY: 1 },
    { posId: 6, posX: 1, posY: 2 },
    { posId: 7, posX: 2, posY: 0 },
    { posId: 8, posX: 2, posY: 1 },
    { posId: 0, posX: 2, posY: 2 },
  ];

  constructor(
    private route: ActivatedRoute,
    public sharedSv: SharedService,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.findImg();

    this.puzzle = this.genPuzArr(this.num);

    this.cd.detectChanges();
    this.resize();
  }

  genPuzArr(n: number): Tile[] {
    const val = n * n;
    const arr: Tile[] = [];

    for (let i = 0; i < val; i++) {
      const [x, y] = i.toString(n).padStart(2, '0');

      arr[i] = { picX: +x, picY: +y, posX: +x, posY: +y };
    }

    return arr;
  }

  findImg() {
    this.sharedSv.images.find((img) => {
      if (img.id === this.id) this.src = img.src;
    });
  }

  @HostListener('window:resize') resize() {
    const puzzle = this.puzzleEl.nativeElement;

    if (innerHeight < innerWidth) this.renderer.addClass(puzzle, 'height');
    else this.renderer.removeClass(puzzle, 'height');
  }

  shuffle(): Tile[] {
    const puzzle: Tile[] = [...this.pos];

    for (let i = puzzle.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * puzzle.length);
      let temp = puzzle[i];
      puzzle[i] = puzzle[j];
      puzzle[j] = temp;
    }

    console.log(puzzle);
    for (let i = 0; i < puzzle.length; i++) {
      puzzle[i] = { ...puzzle[i], ...this.pic[i] };
    }
    console.log(puzzle);

    return puzzle;
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;

      let puzzle = this.shuffle();

      while (!this.sharedSv.isSolveable(puzzle)) {
        puzzle = this.shuffle();
      }

      this.puzzle = puzzle;
      this.puzzle.pop();
    }
  }

  swapTile(arr: Tile[]): Tile[] {
    if (arr[0].posId && arr[1].posId) {
      const temp = arr[0];
      arr[0] = arr[1];
      arr[1] = temp;
    } else {
      const temp = arr[arr.length - 1];
      arr[arr.length - 1] = arr[arr.length - 2];
      arr[arr.length - 2] = temp;
    }

    return arr;
  }

  slide(id: number) {
    if (this.isPlaying && !this.isSliding) {
      this.isSliding = true;

      let posX = +this.puzzle[id]['posX']!;
      let posY = +this.puzzle[id]['posY']!;

      if (!this.move(id, -1, 0)) {
        // left
        const newPosX = --posX;

        this.puzzle[id]['posX'] = newPosX;
      } else if (!this.move(id, 1, 0)) {
        // right
        const newPosX = ++posX;

        this.puzzle[id]['posX'] = newPosX;
      } else if (!this.move(id, 0, -1)) {
        // top
        const newPosY = --posY;

        this.puzzle[id]['posY'] = newPosY;
      } else if (!this.move(id, 0, 1)) {
        // bottom
        const newPosY = ++posY;

        this.puzzle[id]['posY'] = newPosY;
      }

      setTimeout(() => {
        this.isSliding = false;
        // console.log(this.isSolved());
      }, 200);
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

  canDeactivate():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.isPlaying) return confirm('Are yoou sure you want to quit?');
    else return true;
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
