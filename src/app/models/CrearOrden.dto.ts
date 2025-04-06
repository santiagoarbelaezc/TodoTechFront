import { ClienteDTO } from "./cliente.dto";

export interface CrearOrdenDTO {
    cliente: ClienteDTO;
    vendedor: string; // solo el nombre de usuario
  }