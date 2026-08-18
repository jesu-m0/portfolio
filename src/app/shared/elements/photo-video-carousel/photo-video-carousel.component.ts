import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  CarouselItem,
  PhotoDimension,
  PhotoItem,
  VideoItem,
} from '../../../core/models/media-item.model';
import { MediaLightboxComponent } from '../media-lightbox/media-lightbox.component';

@Component({
  selector: 'app-photo-video-carousel',
  imports: [CommonModule, NgOptimizedImage, MediaLightboxComponent],
  templateUrl: './photo-video-carousel.component.html',
  styleUrl: './photo-video-carousel.component.css',
})
export class PhotoVideoCarouselComponent {
  @Input({ required: true }) photos!: string[];
  photoData: PhotoDimension[] = []; // will measured photos

  @Input() videos?: string[];
  safeVideos: SafeResourceUrl[] = []; // will store sanitazed link for videos

  /** Opt-in: click a slide to open it full-screen. Off keeps the previous behaviour. */
  @Input() enableLightbox = false;
  lightboxOpen = false;

  currentIndex = 0;

  /** Rebuilt only when the source media changes, so the reference stays stable. */
  items: CarouselItem[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadAllDimensions(this.photos)
      .then((all) => {
        this.photoData = all;
        this.rebuildItems();
      })
      .catch((err) => {
        console.error('Error measuring images:', err);
      });

    this.safeVideos = (this.videos || []).map((video) =>
      this.sanitizer.bypassSecurityTrustResourceUrl(video)
    );
    this.rebuildItems();
  }

  private loadAllDimensions(urls: string[]): Promise<PhotoDimension[]> {
    const promises: Promise<PhotoDimension>[] = urls.map((u) =>
      this.loadOneDimension(u)
    );
    return Promise.all(promises);
  }

  private loadOneDimension(url: string): Promise<PhotoDimension> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;

      // If it was cached and complete already, resolve immediately:
      if (img.complete) {
        resolve({
          src: url,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        return;
      }

      img.onload = () => {
        resolve({
          src: url,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = (err) => {
        reject(`Failed to load image ${url}: ${err}`);
      };
    });
  }

  private rebuildItems(): void {
    // Map each photoData[] entry into a PhotoItem
    const photoItems: PhotoItem[] = this.photoData.map((p) => ({
      type: 'photo',
      photo: p,
    }));

    // Map each safeVideos[] entry into a VideoItem
    const videoItems: VideoItem[] = this.safeVideos.map((sv) => ({
      type: 'video',
      video: sv,
    }));

    this.items = [...photoItems, ...videoItems];
  }

  openLightbox(): void {
    if (!this.enableLightbox || this.items.length === 0) return;
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
  }

  trackByIndex(index: number, item: unknown): number {
    return index;
  }
}
