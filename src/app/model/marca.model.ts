import { MarcaInterface } from '@interfaces/articulo.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Marca {
  constructor(
    public id: number | null = null,
    public nombre: string | null = null,
  ) {}

  fromInterface(marca: MarcaInterface): Marca {
    this.id = marca.id;
    this.nombre = urldecode(marca.nombre);

    return this;
  }

  toInterface(): MarcaInterface {
    return {
      id: this.id,
      nombre: urlencode(this.nombre),
    };
  }
}
