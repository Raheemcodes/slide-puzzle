import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appClick]',
  standalone: true,
})
export class ClickDirective implements OnInit, OnDestroy {
  @HostBinding('style.position') position = 'relative';
  @HostBinding('style.overflow') overflow = 'hidden';

  _opacity: number = 0.5;
  @Input() appClick: 'dark' | 'light' | '' = 'dark';
  @Input() set opacity(val: number) {
    this._opacity = val || 0.5;
    if (val >= 1) this._opacity = 1;
    if (val <= 0) this._opacity = 0;
  }

  clickElement!: HTMLDivElement | null;
  isAnimating: boolean = false;
  timeout: any;

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Block children from intercepting the offset coordinates
    Array.from(this.elRef.nativeElement.children).forEach((el) => {
      const child = el as HTMLElement;

      this.renderer.setStyle(child, 'pointer-events', 'none');
    });
  }

  createElement(event: PointerEvent) {
    this.clickElement = this.document.createElement('div');
    this.styleElement();

    this.renderer.setStyle(
      this.clickElement,
      'top',
      `${event.offsetY / 16}rem`
    );
    this.renderer.setStyle(
      this.clickElement,
      'left',
      `${event.offsetX / 16}rem`
    );
    this.elRef.nativeElement.insertAdjacentElement(
      'beforeend',
      this.clickElement
    );
  }

  styleElement() {
    this.renderer.setStyle(this.clickElement, 'position', 'absolute');
    this.renderer.setStyle(this.clickElement, 'width', '2rem');
    this.renderer.setStyle(this.clickElement, 'height', '2rem');
    this.renderer.setStyle(this.clickElement, 'margin-top', '-1rem');
    this.renderer.setStyle(this.clickElement, 'margin-left', '-1rem');
    this.renderer.setStyle(this.clickElement, 'border-radius', '50%');

    this.renderer.setStyle(
      this.clickElement,
      'background-color',
      `rgba(2, 2, 2, ${this._opacity})`
    );
    if (this.appClick == 'light') {
      this.renderer.setStyle(
        this.clickElement,
        'background-color',
        `rgba(255, 255,255, ${this._opacity})`
      );
    }
    this.renderer.setStyle(
      this.clickElement,
      'transition',
      'all 0.5s ease-out'
    );
    this.renderer.setStyle(this.clickElement, 'opacity', '1');
  }

  @HostListener('click', ['$event']) click(event: PointerEvent) {
    if (!this.isAnimating) {
      this.isAnimating = true;

      this.createElement(event);

      // Use greater length of host element for the touch final diameter
      const width: number = this.elRef.nativeElement.clientWidth;
      const height: number = this.elRef.nativeElement.clientHeight;
      const result: number = width > height ? width : height;

      this.renderer.setStyle(
        this.clickElement,
        'transform',
        `scale(${(result / 32) * 2})`
      );
      this.renderer.setStyle(this.clickElement, 'opacity', '0');

      this.timeout = setTimeout(() => {
        this.leave();
      }, 300);
    }
  }

  @HostListener('mouseleave') leave() {
    if (this.clickElement) {
      this.elRef.nativeElement.removeChild(this.clickElement);
      this.clickElement = null;
      this.isAnimating = false;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
