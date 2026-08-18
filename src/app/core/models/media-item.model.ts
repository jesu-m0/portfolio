import { SafeResourceUrl } from '@angular/platform-browser';

export interface PhotoDimension {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

export interface PhotoItem {
  type: 'photo';
  photo: PhotoDimension;
}

export interface VideoItem {
  type: 'video';
  video: SafeResourceUrl;
}

export type CarouselItem = PhotoItem | VideoItem;
