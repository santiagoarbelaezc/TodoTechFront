export interface UsuarioDTO {
  usuario: string;
  password: string;
  tipoUsuario: 'ADMINISTRADOR' | 'VENDEDOR' | 'CAJERO'  |  'DESPACHADOR'; // Asegúrate de coincidir con el enum del backend
}