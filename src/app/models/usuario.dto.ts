export interface UsuarioDTO {
  usuario: string;
  password: string;
  tipoUsuario: 'ADMIN' | 'VENDEDOR' | 'CAJERO'  |  'DESPACHADOR'; // Asegúrate de coincidir con el enum del backend
}