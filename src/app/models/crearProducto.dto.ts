export interface CrearProductoDTO {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    imagen: string; // ← Aquí agregas la propiedad imagen
  }