import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, Result } from '@zxing/library';

@Component({
  selector: 'app-barcode-scanner',
  imports: [MatButton, MatProgressSpinner],
  templateUrl: './barcode-scanner.html',
  styleUrl: './barcode-scanner.scss',
})
export default class BarcodeScanner implements AfterViewInit, OnDestroy {
  private readonly dialogRef: MatDialogRef<BarcodeScanner, string | null> = inject(MatDialogRef);

  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  private controls: IScannerControls | null = null;

  loading: WritableSignal<boolean> = signal<boolean>(true);
  error: WritableSignal<string> = signal<string>('');

  private readonly reader = new BrowserMultiFormatReader(
    new Map([
      [
        DecodeHintType.POSSIBLE_FORMATS,
        [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
        ],
      ],
    ]),
  );

  async ngAfterViewInit(): Promise<void> {
    try {
      this.controls = await this.reader.decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: 'environment' },
          },
        },
        this.video().nativeElement,
        (result: Result | undefined): void => {
          if (result) {
            this.close(result.getText());
          }
        },
      );

      this.loading.set(false);
    } catch {
      this.loading.set(false);
      this.error.set('No se ha podido acceder a la cámara.');
    }
  }

  close(code: string | null = null): void {
    this.controls?.stop();
    this.dialogRef.close(code);
  }

  ngOnDestroy(): void {
    this.controls?.stop();
  }
}
