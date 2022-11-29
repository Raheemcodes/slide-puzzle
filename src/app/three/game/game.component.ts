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
import { ActivatedRoute } from '@angular/router';
import { Pic, Puz, Tile } from 'src/app/shared/shared.mdel';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  src!: string;
  id!: string;
  @ViewChild('puzzleEl') puzzleEl!: ElementRef<HTMLElement>;
  isPlaying: boolean = false;
  timeout: any;

  puzzle: Puz[] = [
    { picX: 0, picY: 0, posX: 0, posY: 0 },
    { picX: 0, picY: 1, posX: 0, posY: 1 },
    { picX: 0, picY: 2, posX: 0, posY: 2 },
    { picX: 1, picY: 0, posX: 1, posY: 0 },
    { picX: 1, picY: 1, posX: 1, posY: 1 },
    { picX: 1, picY: 2, posX: 1, posY: 2 },
    { picX: 2, picY: 0, posX: 2, posY: 0 },
    { picX: 2, picY: 1, posX: 2, posY: 1 },
  ];

  pic: Pic[] = [
    { picX: 0, picY: 0 },
    { picX: 0, picY: 1 },
    { picX: 0, picY: 2 },
    { picX: 1, picY: 0 },
    { picX: 1, picY: 1 },
    { picX: 1, picY: 2 },
    { picX: 2, picY: 0 },
    { picX: 2, picY: 1 },
  ];

  pos: Tile[] = [
    { posX: 0, posY: 0 },
    { posX: 0, posY: 1 },
    { posX: 0, posY: 2 },
    { posX: 1, posY: 0 },
    { posX: 1, posY: 1 },
    { posX: 1, posY: 2 },
    { posX: 2, posY: 0 },
    { posX: 2, posY: 1 },
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

    this.cd.detectChanges();
    this.resize();
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

  shuffle() {
    if (!this.isPlaying) {
      const puzzle = this.pos.slice();

      for (var i = puzzle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = puzzle[i];
        puzzle[i] = puzzle[j];
        puzzle[j] = temp;
      }

      for (var i = puzzle.length - 1; i >= 0; i--) {
        puzzle[i] = { ...puzzle[i], ...this.pic[i] };
      }

      this.isPlaying = true;
      setTimeout(() => {
        this.puzzle = puzzle;
      }, 300);
    }
  }

  slide(event: Event) {
    const el = <HTMLElement>event.currentTarget;
    const parent = <HTMLCollectionOf<HTMLElement>>el.parentElement?.children;

    let posX = +el.dataset['posX']!;
    let posY = +el.dataset['posY']!;

    if (!this.move(el, parent, -1, 0)) {
      // left

      const newPosX = --posX;
      el.dataset['posX'] = newPosX.toString();
    } else if (!this.move(el, parent, 1, 0)) {
      // right

      const newPosX = ++posX;
      el.dataset['posX'] = newPosX.toString();
    } else if (!this.move(el, parent, 0, -1)) {
      // top

      const newPosY = --posY;
      el.dataset['posY'] = newPosY.toString();
    } else if (!this.move(el, parent, 0, 1)) {
      // bottom

      const newPosY = ++posY;
      el.dataset['posY'] = newPosY.toString();
    }

    this.renderer.setStyle(el, 'z-index', posX + posY);
    this.renderer.setStyle(
      el,
      'transform',
      `translate(${posX * 100}%, ${posY * 100}%)`
    );
  }

  move(
    el: HTMLElement,
    parent: HTMLCollectionOf<HTMLElement>,
    x: number,
    y: number
  ) {
    const posX: number = +el.dataset['posX']!;
    const posY: number = +el.dataset['posY']!;
    const newPosX = posX + x > 2 || posX + x < 0 ? posX : posX + x;
    const newPosY = posY + y > 2 || posY + y < 0 ? posY : posY + y;

    return Array.from(parent).some((ele) => {
      if (
        +ele.dataset['posX']! == newPosX &&
        +ele.dataset['posY']! == newPosY
      ) {
        return true;
      } else return false;
    });
  }

  compare() {}

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
