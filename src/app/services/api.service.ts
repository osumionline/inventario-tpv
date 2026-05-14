import { Injectable } from '@angular/core';
import {
  ArticuloInterface,
  LocalizadorResult,
  MarcasResult,
  StatusResult,
} from '@interfaces/articulo.interfaces';
import Marca from '@model/marca.model';
import ApiBaseService from '@services/api-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ApiService extends ApiBaseService {
  marcas: Marca[] = [];

  checkLocalizador(localizador: string): Observable<LocalizadorResult> {
    return this.http.post<LocalizadorResult>(this.apiUrl + 'check-localizador', { localizador });
  }

  saveArticulo(articulo: ArticuloInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + 'save-articulo', articulo);
  }

  getMarcas(): Observable<MarcasResult> {
    return this.http.post<MarcasResult>(this.apiUrl + 'get-marcas', {});
  }

  getMarca(id: number): Marca | null {
    const marca: Marca | undefined = this.marcas.find((m: Marca): boolean => m.id === id);
    return marca || null;
  }
}
