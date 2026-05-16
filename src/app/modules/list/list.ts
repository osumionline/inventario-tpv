import { Component, Signal, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import Articulo from '@model/articulo.model';
import ListService from '@services/list.service';

@Component({
  selector: 'app-list',
  imports: [RouterLink, MatToolbar, MatToolbarRow, MatIconButton, MatIcon],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export default class List {
  private readonly listService: ListService = inject(ListService);

  list: Signal<Articulo[]> = this.listService.list.asReadonly();

  formatPrice(value: number | null): string {
    if (value === null) {
      return '-';
    }
    const strValue: string = String(value);
    const numValue: number = parseFloat(strValue);

    return numValue.toFixed(2) + ' EUR';
  }

  getStockChangeText(articulo: Articulo): string {
    if (articulo.stock === null || articulo.stockPrevio === null) {
      return 'Sin cambio de stock';
    }

    const diff: number = articulo.stock - articulo.stockPrevio;
    if (diff > 0) {
      return 'Stock ha aumentado';
    }
    if (diff < 0) {
      return 'Stock ha reducido';
    }

    return 'Stock sin cambios';
  }

  getPvpChangeText(articulo: Articulo): string {
    if (articulo.pvp === null || articulo.pvpPrevio === null) {
      return 'Sin cambio de PVP';
    }

    const diff: number = articulo.pvp - articulo.pvpPrevio;
    if (diff > 0) {
      return 'PVP ha aumentado';
    }
    if (diff < 0) {
      return 'PVP ha reducido';
    }

    return 'PVP sin cambios';
  }
}
