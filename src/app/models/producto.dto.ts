export interface CategoriaDTO {
    id: number;
    nombre: string;
    descripcion: string;
  }
  
  export interface ProductoDTO {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: CategoriaDTO;
    imagen: string; // ← Aquí agregas la propiedad imagen
  }
  