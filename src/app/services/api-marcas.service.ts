import { Service, inject } from '@angular/core';
import { MarcaInterface, MarcasResult } from '@app/interfaces/articulo.interfaces';
import Marca from '@app/model/marca.model';
import ApiBaseService from '@services/api-base.service';
import ClassMapperService from '@services/class-mapper.service';
import { Observable } from 'rxjs';

@Service()
export default class ApiMarcasService extends ApiBaseService {
  private readonly classMapperService: ClassMapperService = inject(ClassMapperService);
  private readonly storageKey: string = 'marcas';

  marcas: Marca[] = [];

  getMarcas(): Observable<MarcasResult> {
    return this.http.post<MarcasResult>(this.apiUrl + 'get-marcas', {});
  }

  loadMarcas(): void {
    try {
      const marcasStr: string | null = localStorage.getItem(this.storageKey);
      if (marcasStr === null) {
        this.marcas = [];
        return;
      }

      const marcasObj: MarcaInterface[] = JSON.parse(marcasStr);
      if (!Array.isArray(marcasObj)) {
        this.marcas = [];
        return;
      }

      this.marcas = this.classMapperService.getMarcas(marcasObj);
    } catch (e) {
      console.error('Error cargando marcas:', e);
      this.marcas = [];
    }
  }

  saveMarcas(): void {
    const marcasObj: MarcaInterface[] = this.marcas.map((marca: Marca): MarcaInterface => {
      return marca.toInterface();
    });
    localStorage.setItem(this.storageKey, JSON.stringify(marcasObj));
  }

  setMarcas(marcas: Marca[]): void {
    this.marcas = marcas;
    this.saveMarcas();
  }

  getMarca(id: number): Marca | null {
    const marca: Marca | undefined = this.marcas.find((m: Marca): boolean => m.id === id);
    return marca || null;
  }
}
