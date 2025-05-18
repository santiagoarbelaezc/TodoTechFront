export interface CrearUsuarioDTO {
    usuario: string;
    password: string;
    tipoUsuario: 'ADMINISTRADOR' | 'VENDEDOR' | 'CAJERO' | 'DESPACHADOR';
    nombre: string;
    correo: string;
    telefono: string;
  }
  