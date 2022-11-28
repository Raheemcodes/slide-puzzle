import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
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
export class GameComponent implements OnInit {
  src!: string;
  id!: string;
  @ViewChild('puzzleEl') puzzleEl!: ElementRef<HTMLElement>;

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
    private sharedSv: SharedService,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.findImg();

    this.cd.detectChanges();
    this.resize();

    // this.shuffle();
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
    const puzzle = this.pos.slice();

    for (var i = puzzle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = puzzle[i];
      puzzle[i] = puzzle[j];
      puzzle[j] = temp;
    }

    for (var i = puzzle.length - 1; i > 0; i--) {
      puzzle[i] = { ...puzzle[i], ...this.pic[i] };
    }

    this.puzzle = puzzle;
  }

  positionImg() {}

  compare() {}
}
