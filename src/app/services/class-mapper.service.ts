import { Injectable } from '@angular/core';
import { ArticuloInterface } from '@interfaces/articulo.interfaces';
import { UserInterface } from '@interfaces/user.interfaces';
import Articulo from '@model/articulo.model';
import User from '@model/user.model';

@Injectable({
  providedIn: 'root',
})
export default class ClassMapperService {
  getUser(u: UserInterface): User {
    return new User().fromInterface(u);
  }

  getUsers(us: UserInterface[]): User[] {
    return us.map((u: UserInterface): User => {
      return this.getUser(u);
    });
  }

  getArticulo(a: ArticuloInterface): Articulo {
    return new Articulo().fromInterface(a);
  }
}
