import { ArticuloInterface } from '@interfaces/articulo.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Articulo {
  constructor(
    public id: number | null = null,
    public localizador: number | null = null,
    public idCategoria: number | null = null,
    public idMarca: number | null = null,
    public marca: string | null = null,
    public nombre: string | null = null,
    public palb: number | null = null,
    public puc: number | null = null,
    public pvp: number | null = null,
    public pvpPrevio: number | null = null,
    public referencia: string | null = null,
    public stock: number | null = null,
    public stockPrevio: number | null = null,
    public codigoBarras: string | null = null,
  ) {}

  fromInterface(articulo: ArticuloInterface): Articulo {
    this.id = articulo.id;
    this.localizador = articulo.localizador;
    this.idCategoria = articulo.idCategoria;
    this.idMarca = articulo.idMarca;
    this.marca = articulo.marca ?? '';
    this.nombre = urldecode(articulo.nombre);
    this.palb = articulo.palb;
    this.puc = articulo.puc;
    this.pvp = articulo.pvp;
    this.pvpPrevio = articulo.pvpPrevio ?? articulo.pvp;
    this.referencia = articulo.referencia;
    this.stock = articulo.stock;
    this.stockPrevio = articulo.stockPrevio ?? articulo.stock;
    this.codigoBarras = articulo.codigoBarras;

    return this;
  }

  toInterface(): ArticuloInterface {
    return {
      id: this.id,
      localizador: this.localizador,
      idCategoria: this.idCategoria,
      idMarca: this.idMarca,
      marca: this.marca,
      nombre: urlencode(this.nombre),
      palb: this.palb,
      puc: this.puc,
      pvp: this.pvp,
      pvpPrevio: this.pvpPrevio,
      referencia: this.referencia,
      stock: this.stock,
      stockPrevio: this.stockPrevio,
      codigoBarras: this.codigoBarras,
    };
  }

  get diferenciaPVP(): string {
    if (this.pvpPrevio === null || this.pvp === null) {
      return '0';
    }
    const diff: number = this.pvp - this.pvpPrevio;
    if (diff > 0) {
      return '+ ' + diff.toFixed(2) + ' €';
    } else {
      return diff.toFixed(2) + ' €';
    }
  }

  get diferenciaStock(): string {
    if (this.stockPrevio === null || this.stock === null) {
      return '0';
    }
    const diff: number = this.stock - this.stockPrevio;
    if (diff > 0) {
      return '+ ' + diff;
    } else {
      return diff.toString();
    }
  }
}
