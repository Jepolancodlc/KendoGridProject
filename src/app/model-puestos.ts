import { Adscripcion, Catalogo, CodigoPuesto, Cuerpo, Escala, FormaProvision, PuestoTipo, Tipovinculo } from "./Objetos";

export class Puesto {
  public id: number;
  public puesto: CodigoPuesto;
  public puestoIdOficial: number;
  public puestoTipo: PuestoTipo
  public nombre: string;
  public tipoVinculo: Tipovinculo;
  public catalogo: Catalogo;
  public adscripcion: Adscripcion;
  public g1: string;
  public g2: string;
  public escala: Escala;
  public cuerpo: Cuerpo;
  public formaProvision: FormaProvision;
  public grupoImporte: number;
  public complementoDestinoId: number;
  public complementoDestinoImporte: number;
  public complementoEspecificoId: number;
  public complementoEspecificoImporte: number;
  public dotaciones: number;
  public ocupantes: string;
  public vacantes: string;
  public dotado: boolean;
  public singularizado: boolean;
  public reservadoNacionales: boolean;
  public disponibilidadPlena: boolean;
  public personaDeConfianza: boolean;
}
