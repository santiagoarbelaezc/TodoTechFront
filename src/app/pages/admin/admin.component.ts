import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioDTO } from '../../models/usuario.dto'; // Ajusta la ruta según tu estructura
import { UsuarioService } from '../../services/usuario.service'; // Servicio de usuarios
import { PersonaDTO } from '../../models/persona.dto';
import { ProductoService } from '../../services/producto.service';
import { ProductoDTO } from '../../models/producto.dto';
import { CrearProductoDTO } from '../../models/crearProducto.dto';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {


  ngOnInit() {
    this.cargarUsuarios();
  }

  mostrarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    if (seccion === 'usuarios') {
      this.cargarUsuarios();
    } else if (seccion === 'productos') {
      this.cargarProductos(); // <- aquí cargas productos
    }
  }

  seccionActiva: string = 'bienvenida';
  usuario: UsuarioDTO = {
    usuario: '',
    password: '',
    tipoUsuario: 'ADMINISTRADOR'
  }; // Valores por defecto

  persona: PersonaDTO = {
    nombre: '',
    correo: '',
    telefono: '',
    usuario: this.usuario
  }; // Inicializa la persona con valores por defecto

  nuevoProducto: CrearProductoDTO= {
    id: 0,
    nombre: '',
    codigo: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
    imagen: ''
  };
  

  usuarios: UsuarioDTO[] = []; // Lista para mostrar en la tabla


  constructor(private usuarioService: UsuarioService
, private productoService: ProductoService) {}
 
productos: ProductoDTO[] = [];

cargarProductos() {
  this.productoService.obtenerProductos().subscribe(
    (data) => {
      this.productos = data;
    },
    (error) => {
      console.error('Error al obtener productos:', error);
      alert('Error al cargar los productos');
    }
  );
}



  cargarUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
        alert('Error al cargar los usuarios');
      }
    );
  }
  
  editarProducto(producto: ProductoDTO) {
    console.log('Editar producto:', producto);
    // Aquí puedes abrir un formulario de edición, por ejemplo:
    // this.productoSeleccionado = producto;
    // this.mostrarFormularioEdicion = true;
  }
  
  eliminarProducto(producto: ProductoDTO) {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`);
    if (confirmacion) {
      this.productoService.eliminarProducto(producto.id).subscribe(
        () => {
          alert('Producto eliminado con éxito');
          this.cargarProductos(); // Refresca la lista
        },
        (error) => {
          console.error('Error al eliminar el producto:', error);
          alert('No se pudo eliminar el producto');
        }
      );
    }
  }
  
  verDetallesProducto(producto: ProductoDTO) {
    console.log('Detalles del producto:', producto);
    // Puedes abrir un modal, mostrar otra vista, etc.
  }
  guardarProducto() {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.codigo || !this.nuevoProducto.precio || !this.nuevoProducto.stock || !this.nuevoProducto.categoria || !this.nuevoProducto.imagen) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
  
    this.productoService.crearProducto(this.nuevoProducto).subscribe({
      next: () => {
        alert('Producto creado exitosamente');
        this.cargarProductos(); // Recarga la lista
        this.nuevoProducto = { // Reinicia el formulario
          id: 0,
          nombre: '',
          codigo: '',
          descripcion: '',
          precio: 0,
          stock: 0,
          categoria: '',
          imagen: ''
        };
      },
      error: (error) => {
        console.error('Error al crear el producto:', error);
        alert('Error al crear el producto. Intenta de nuevo.');
      }
    });
  }
  

  guardarUsuario() {
    if (!this.usuario.usuario || !this.usuario.password || !this.usuario.tipoUsuario) {
      alert('Por favor completa todos los campos');
      return;
    }

    console.log('Guardando usuario:', this.usuario);

    this.usuarioService.crearUsuario(this.usuario).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
        alert(response.mensaje);

        // Obtener el último usuario creado después de guardar
        this.usuarioService.obtenerUltimoUsuario().subscribe(
          (usuarioCreado) => {
            console.log('Usuario recién creado:', usuarioCreado);
            this.usuarioService.setUsuario(usuarioCreado); // Guardar si lo necesitas en el estado global
            // Aquí podrías redirigir, mostrarlo, etc.
          },
          (error) => {
            console.error('Error al obtener el usuario recién creado:', error);
            alert('Error al recuperar el usuario creado.');
          }
        );
      },
      (error) => {
        console.error('Error al guardar el usuario:', error);
        alert('Error al crear el usuario. Por favor intenta de nuevo.');
      }
    );
  }
}
