import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CarouselItem } from '../../../core/models/media-item.model';

@Component({
  selector: 'app-media-lightbox',
  imports: [CommonModule],
  templateUrl: './media-lightbox.component.html',
  styleUrl: './media-lightbox.component.css',
})
export class MediaLightboxComponent implements OnInit, OnDestroy {
  @Input({ required: true }) items!: CarouselItem[];
  @Input() index = 0;

  @Output() indexChange = new EventEmitter<number>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('closeButton', { static: true })
  closeButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('dialog', { static: true })
  dialog!: ElementRef<HTMLDivElement>;

  /** Drives the exit animation; the host is torn down once it finishes. */
  closing = false;

  private previouslyFocused: HTMLElement | null = null;
  private previousBodyOverflow = '';
  private closeTimer?: ReturnType<typeof setTimeout>;
  private pointerStartX: number | null = null;

  /** Keep in sync with the animation duration in the component stylesheet. */
  private static readonly EXIT_ANIMATION_MS = 180;
  private static readonly SWIPE_THRESHOLD_PX = 50;

  ngOnInit(): void {
    this.previouslyFocused = document.activeElement as HTMLElement | null;

    // Lock background scrolling while the overlay owns the viewport.
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog so keyboard users land somewhere useful.
    this.closeButton.nativeElement.focus();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = this.previousBodyOverflow;
    clearTimeout(this.closeTimer);
    this.previouslyFocused?.focus();
  }

  get currentItem(): CarouselItem | undefined {
    return this.items[this.index];
  }

  get hasMultiple(): boolean {
    return this.items.length > 1;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.closing) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'Tab':
        this.trapFocus(event);
        break;
    }
  }

  /** Cycles focus through the dialog's own controls so it never escapes behind the overlay. */
  private trapFocus(event: KeyboardEvent): void {
    const focusable = Array.from(
      this.dialog.nativeElement.querySelectorAll<HTMLElement>(
        'button, iframe, [href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'));

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && (active === first || !this.dialogContains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private dialogContains(el: HTMLElement | null): boolean {
    return !!el && this.dialog.nativeElement.contains(el);
  }

  goToSlide(index: number): void {
    this.index = index;
    this.indexChange.emit(this.index);
  }

  next(): void {
    if (!this.hasMultiple) return;
    this.goToSlide((this.index + 1) % this.items.length);
  }

  prev(): void {
    if (!this.hasMultiple) return;
    this.goToSlide((this.index - 1 + this.items.length) % this.items.length);
  }

  close(): void {
    if (this.closing) return;
    this.closing = true;
    // Let the exit animation play out before the parent removes us.
    this.closeTimer = setTimeout(
      () => this.closed.emit(),
      MediaLightboxComponent.EXIT_ANIMATION_MS
    );
  }

  /** Backdrop clicks close; clicks on the media itself must not bubble up to here. */
  onBackdropClick(): void {
    this.close();
  }

  onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
  }

  onPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null) return;

    const deltaX = event.clientX - this.pointerStartX;
    this.pointerStartX = null;

    if (Math.abs(deltaX) < MediaLightboxComponent.SWIPE_THRESHOLD_PX) return;

    if (deltaX < 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
