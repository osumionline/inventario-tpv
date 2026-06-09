import { Service } from '@angular/core';
import {
  ArticuloInterface,
  LocalizadorResult,
  StatusResult,
} from '@interfaces/articulo.interfaces';
import ApiBaseService from '@services/api-base.service';
import { Observable } from 'rxjs';

@Service()
export default class ApiService extends ApiBaseService {
  checkLocalizador(localizador: string): Observable<LocalizadorResult> {
    return this.http.post<LocalizadorResult>(this.apiUrl + 'check-localizador', { localizador });
  }

  saveArticulo(articulo: ArticuloInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + 'save-articulo', articulo);
  }
}
