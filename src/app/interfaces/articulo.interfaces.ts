import ApiStatus from '@enum/api-status.enum';

export interface LocalizadorResult {
  status: ApiStatus;
  articulo: ArticuloInterface | null;
}

export interface StatusResult {
  status: ApiStatus;
}

export interface ArticuloInterface {
  id: number | null;
  localizador: number | null;
  idCategoria: number | null;
  idMarca: number | null;
  marca: string | null;
  nombre: string | null;
  palb: number | null;
  puc: number | null;
  pvp: number | null;
  referencia: string | null;
  stock: number | null;
  codigoBarras: string | null;
}

export interface MarcaInterface {
  id: number | null;
  nombre: string | null;
}

export interface MarcasResult {
  status: ApiStatus;
  list: MarcaInterface[];
}
