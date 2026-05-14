import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListItem, MatListItemIcon, MatNavList } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import ApiStatus from '@enum/api-status.enum';
import { LocalizadorResult, StatusResult } from '@interfaces/articulo.interfaces';
import Articulo from '@model/articulo.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import BarcodeScanner from '@shared/barcode-scanner/barcode-scanner';

@Component({
  selector: 'app-home',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatIcon,
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    FormsModule,
    MatProgressSpinner,
    MatButton,
    MatDialogModule,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export default class Main {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService = inject(ClassMapperService);
  private readonly dialog: MatDialog = inject(MatDialog);

  opened: WritableSignal<boolean> = signal<boolean>(false);
  codBarras: string = '';

  articulo: Articulo | null = null;
  marca: WritableSignal<string> = signal<string>('');
  showLoading: WritableSignal<boolean> = signal<boolean>(false);
  showArticulo: WritableSignal<boolean> = signal<boolean>(false);
  saving: WritableSignal<boolean> = signal<boolean>(false);
  saved: WritableSignal<boolean> = signal<boolean>(false);

  showMenu(): void {
    this.opened.set(true);
  }

  openScanner(): void {
    const dialogRef = this.dialog.open(BarcodeScanner, {
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      panelClass: 'scanner-dialog',
    });

    dialogRef.afterClosed().subscribe((code: string | null | undefined): void => {
      if (code) {
        this.codBarras = code;
        this.checkLocalizador();
      }
    });
  }

  checkLocalizador(): void {
    const code: string = this.codBarras.trim();

    if (code === '') {
      return;
    }

    this.saved.set(false);
    this.showArticulo.set(false);
    this.showLoading.set(true);

    this.apiService
      .checkLocalizador(this.codBarras)
      .subscribe((result: LocalizadorResult): void => {
        this.showLoading.set(false);
        if (result.status === ApiStatus.OK && result.articulo) {
          this.articulo = this.classMapperService.getArticulo(result.articulo);
          this.marca.set(this.apiService.getMarca(this.articulo.idMarca ?? 0)?.nombre ?? '');
          console.log(this.articulo);
          this.showArticulo.set(true);
        }
      });
  }

  downStock(): void {
    if (this.articulo !== null && this.articulo.stock !== null && this.articulo.stock > 0) {
      this.articulo.stock = this.articulo.stock - 1;
    }
  }

  upStock(): void {
    if (this.articulo !== null && this.articulo.stock !== null) {
      this.articulo.stock = this.articulo.stock + 1;
    }
  }

  save(): void {
    if (this.articulo !== null) {
      console.log(this.articulo.toInterface());
      this.saving.set(true);
      this.apiService
        .saveArticulo(this.articulo.toInterface())
        .subscribe((result: StatusResult): void => {
          this.saving.set(false);
          if (result.status === ApiStatus.OK) {
            this.saved.set(true);
            setTimeout((): void => {
              this.saved.set(false);
            }, 3000);
          }
        });
    }
  }
}
