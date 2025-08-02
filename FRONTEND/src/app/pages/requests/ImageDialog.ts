import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog',
  template: `<div class="image-popup"><img [src]="data" alt="Attachment" /></div>`,
  styles: [`
    .image-popup img {
      max-width: 100%;
      max-height: 80vh;
      display: block;
      margin: auto;
    }
  `]
})
export class ImageDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}
