import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, form, FormField, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { MarcasResult } from '@interfaces/articulo.interfaces';
import { LoginData, LoginResult } from '@interfaces/interfaces';
import ApiStatus from '@model/enum/api-status.enum';
import Marca from '@model/marca.model';
import User from '@model/user.model';
import ApiMarcasService from '@services/api-marcas.service';
import ApiUsersService from '@services/api-users.service';
import ClassMapperService from '@services/class-mapper.service';
import UserService from '@services/user.service';
import LoadingIcon from '@shared/loading-icon/loading-icon';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    LoadingIcon,
    FormField,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class LoginComponent implements OnInit {
  private readonly apiUsersService: ApiUsersService = inject(ApiUsersService);
  private readonly apiMarcasService: ApiMarcasService = inject(ApiMarcasService);
  private readonly userService: UserService = inject(UserService);
  private readonly classMapperService: ClassMapperService = inject(ClassMapperService);
  private readonly router: Router = inject(Router);

  loginModel: WritableSignal<LoginData> = signal<LoginData>({
    name: '',
    pass: '',
  });
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.pass);
    disabled(schemaPath.name, (): boolean => this.loading());
    disabled(schemaPath.pass, (): boolean => this.loading());
  });
  isValid: Signal<boolean> = computed(
    (): boolean =>
      this.loginForm.name().errors().length === 0 && this.loginForm.pass().errors().length === 0,
  );
  loginError: WritableSignal<boolean> = signal<boolean>(false);
  loading: WritableSignal<boolean> = signal<boolean>(false);

  username: Signal<ElementRef> = viewChild.required<ElementRef>('username');

  ngOnInit(): void {
    if (this.userService.logged) {
      this.router.navigate(['/main']);
    }
    this.focus();
  }

  focus(): void {
    this.username().nativeElement.focus();
  }

  login(): void {
    if (!this.isValid()) {
      return;
    }
    this.loginError.set(false);
    this.loading.set(true);

    this.apiUsersService.login(this.loginModel()).subscribe({
      next: (result: LoginResult): void => {
        if (result.status === ApiStatus.OK) {
          this.userService.logged = true;
          this.userService.user = new User().fromInterface(result.user);
          this.userService.saveLogin();

          this.apiMarcasService.getMarcas().subscribe((result: MarcasResult): void => {
            const marcas: Marca[] = this.classMapperService.getMarcas(result.list);
            this.apiMarcasService.setMarcas(marcas);
            this.router.navigate(['/main']);
          });
        } else {
          this.loading.set(false);
          this.loginError.set(true);
          this.focus();
        }
      },
      error: (): void => {
        this.loading.set(false);
        this.loginError.set(true);
        this.focus();
      },
    });
  }
}
