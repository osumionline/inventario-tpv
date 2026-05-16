import { Provider } from '@angular/core';
import ApiBaseService from '@services/api-base.service';
import ApiMarcasService from '@services/api-marcas.service';
import ApiUsersService from '@services/api-users.service';
import ApiService from '@services/api.service';
import AuthService from '@services/auth.service';
import ClassMapperService from '@services/class-mapper.service';
import ListService from '@services/list.service';
import UserService from '@services/user.service';

export default function provideCore(): Provider[] {
  return [
    ApiBaseService,
    ApiMarcasService,
    ApiService,
    ApiUsersService,
    AuthService,
    ClassMapperService,
    ListService,
    UserService,
  ];
}
