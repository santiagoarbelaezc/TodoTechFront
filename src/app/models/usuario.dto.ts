export interface UsuarioDTO {
    usuario: string;
    password: string;
    tipoUsuario: TipoUsuario;
  }
  
  export enum TipoUsuario {
    ADMIN = 'ADMIN',
    EMPLEADO = 'EMPLEADO',
    CLIENTE = 'CLIENTE'
  }

  