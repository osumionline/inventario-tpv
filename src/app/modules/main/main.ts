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
import { Router, RouterLink } from '@angular/router';
import ApiStatus from '@enum/api-status.enum';
import { LocalizadorResult, StatusResult } from '@interfaces/articulo.interfaces';
import Articulo from '@model/articulo.model';
import ApiMarcasService from '@services/api-marcas.service';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import ListService from '@services/list.service';
import UserService from '@services/user.service';
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
  private readonly apiMarcasService: ApiMarcasService = inject(ApiMarcasService);
  private readonly classMapperService: ClassMapperService = inject(ClassMapperService);
  private readonly listService: ListService = inject(ListService);
  private readonly userService: UserService = inject(UserService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly router: Router = inject(Router);

  opened: WritableSignal<boolean> = signal<boolean>(false);
  codBarras: string = '';

  articulo: Articulo | null = null;
  marca: WritableSignal<string> = signal<string>('');
  showLoading: WritableSignal<boolean> = signal<boolean>(false);
  showArticulo: WritableSignal<boolean> = signal<boolean>(false);
  saving: WritableSignal<boolean> = signal<boolean>(false);
  saved: WritableSignal<boolean> = signal<boolean>(false);
  showError: WritableSignal<boolean> = signal<boolean>(false);
  showNotFound: WritableSignal<boolean> = signal<boolean>(false);

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

    this.showError.set(false);
    this.showNotFound.set(false);
    this.saved.set(false);
    this.showArticulo.set(false);
    this.showLoading.set(true);

    this.apiService.checkLocalizador(this.codBarras).subscribe({
      next: (result: LocalizadorResult): void => {
        this.showLoading.set(false);
        if (result.status === ApiStatus.OK && result.articulo) {
          this.articulo = this.classMapperService.getArticulo(result.articulo);
          this.marca.set(this.apiMarcasService.getMarca(this.articulo.idMarca ?? 0)?.nombre ?? '');
          console.log(this.articulo);
          this.showArticulo.set(true);
        }
        if (result.status === ApiStatus.OK && result.articulo === null) {
          this.showNotFound.set(true);
        }
        if (result.status === ApiStatus.ERROR) {
          this.showError.set(true);
        }
      },
      error: (error): void => {
        this.showLoading.set(false);
        this.showError.set(true);
        console.log(error);
      },
    });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
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
      console.log('Diferencia PVP: ' + this.articulo.diferenciaPVP);
      console.log('Diferencia Stock: ' + this.articulo.diferenciaStock);
      this.saving.set(true);
      this.apiService
        .saveArticulo(this.articulo.toInterface())
        .subscribe((result: StatusResult): void => {
          this.saving.set(false);
          if (result.status === ApiStatus.OK) {
            const copia: Articulo = new Articulo().fromInterface(this.articulo!.toInterface());
            copia.marca = this.marca();
            this.listService.addArticulo(copia);
            this.saved.set(true);
            setTimeout((): void => {
              this.saved.set(false);
            }, 3000);
          }
        });
    }
  }
}
