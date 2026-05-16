import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { ArticuloInterface } from '@interfaces/articulo.interfaces';
import Articulo from '@model/articulo.model';
import ClassMapperService from '@services/class-mapper.service';

@Injectable({
  providedIn: 'root',
})
export default class ListService {
  private readonly classMapperService: ClassMapperService = inject(ClassMapperService);
  private readonly storageKey: string = 'articulos-list';

  list: WritableSignal<Articulo[]> = signal<Articulo[]>([]);

  loadList(): void {
    try {
      const listStr: string | null = localStorage.getItem(this.storageKey);
      if (listStr === null) {
        this.list.set([]);
        return;
      }

      const listObj: ArticuloInterface[] = JSON.parse(listStr);
      if (!Array.isArray(listObj)) {
        this.list.set([]);
        return;
      }

      this.list.set(this.classMapperService.getArticulos(listObj));
    } catch (e) {
      console.error('Error cargando listado de articulos:', e);
      this.list.set([]);
    }
  }

  saveList(): void {
    const listObj: ArticuloInterface[] = this.list().map(
      (articulo: Articulo): ArticuloInterface => {
        return articulo.toInterface();
      },
    );
    localStorage.setItem(this.storageKey, JSON.stringify(listObj));
  }

  addArticulo(articulo: Articulo): void {
    this.list.update((list: Articulo[]): Articulo[] => {
      return [articulo, ...list];
    });
    this.saveList();
  }

  clearList(): void {
    this.list.set([]);
    localStorage.removeItem(this.storageKey);
  }
}
