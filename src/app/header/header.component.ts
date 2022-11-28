import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { delay } from 'rxjs';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('nav') nav!: ElementRef<HTMLElement>;
  @ViewChild('toggleBtn') toggleBtn!: ElementRef<HTMLElement>;
  @ViewChild('logo') logo!: ElementRef<HTMLElement>;
  isOpen: boolean = false;
  isAnimating: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    public sharedService: SharedService
  ) {
    this.router.events.pipe(delay(200)).subscribe((event) => {
      if (event instanceof NavigationEnd) this.closeNav();
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', () => {
        if (innerWidth >= 768) this.closeNav();
      });
    }
  }

  toggleNav() {
    const toggleBtn: HTMLElement = this.toggleBtn.nativeElement;
    const logo: HTMLElement = this.logo.nativeElement;
    const nav: HTMLElement = this.nav.nativeElement;

    if (!this.isOpen && !this.isAnimating) {
      this.isAnimating = true;
      nav.style.display = 'flex';
      this.document.body.classList.add('noscroll');

      setTimeout(() => {
        toggleBtn.classList.add('opened');
        logo.classList.add('opened');
        nav.style.right = '0';
        this.isAnimating = false;
        this.isOpen = true;
      }, 300);
    } else this.closeNav();
  }

  closeNav() {
    if (this.isOpen && !this.isAnimating) {
      this.isAnimating = true;
      const toggleBtn: HTMLElement = this.toggleBtn
        .nativeElement as HTMLElement;
      const nav: HTMLElement = this.nav.nativeElement as HTMLElement;
      const logo: HTMLElement = this.logo.nativeElement;

      if (this.document.body.classList.contains('noscroll')) {
        this.document.body.classList.remove('noscroll');
      }

      if (toggleBtn.classList.contains('opened')) {
        toggleBtn.classList.remove('opened');
      }

      if (logo.classList.contains('opened')) logo.classList.remove('opened');

      nav.style.right = '-100vw';

      setTimeout(() => {
        nav.style.display = 'none';
        this.isAnimating = false;
        this.isOpen = false;
      }, 300);
    }
  }
}
