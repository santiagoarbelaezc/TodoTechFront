import { UsuarioDTO } from "./usuario.dto";

export interface PersonaDTO {
    nombre: string;
    correo: string;
    telefono: string;
    usuario: UsuarioDTO
    
  }