import { Component, OnInit } from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js'; // Importar tipos de Chart.js
// Eliminado Label ya que no es exportado por 'ng2-charts'
import { ProductoReporteRequest } from '../../models/productoReporteRequest.dto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit {

  productosReporte: ProductoReporteRequest[] = [];
  productosMasVendidosData: number[] = [];
  productosMasVendidosLabels: string[] = [];

  productosMenosVendidosData: number[] = [];
  productosMenosVendidosLabels: string[] = [];

  // Opciones de gráficos
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: this.productosMasVendidosLabels,
    datasets: [
      {
        data: this.productosMasVendidosData,
        label: 'Productos más vendidos',
        backgroundColor: 'rgba(0,123,255,0.6)', // Color para los productos más vendidos
      },
      {
        data: this.productosMenosVendidosData,
        label: 'Productos menos vendidos',
        backgroundColor: 'rgba(220,53,69,0.6)', // Color para los productos menos vendidos
      }
    ],
  };

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductosReporte();
  }

  cargarProductosReporte(): void {
    console.log('Iniciando carga de productos para el reporte...');

    this.productoService.obtenerReporteVentas().subscribe({
      next: (data) => {
        console.log('Datos recibidos del servicio:', data);

        const productosValidos = data.filter((item, index) => {
          const valido = item && item.producto && item.producto.categoria;
          if (!valido) {
            console.warn(`Elemento inválido en índice ${index}:`, item);
          }
          return valido;
        });

        console.log('Productos válidos:', productosValidos);
        this.productosReporte = productosValidos;

        this.generarReportes();
      },
      error: (err) => {
        console.error('Error al obtener el reporte de ventas:', err);
      }
    });
  }

  generarReportes(): void {
    // Calcular los productos más y menos vendidos
    const productosOrdenados = [...this.productosReporte].sort((a, b) => b.cantidadVentas - a.cantidadVentas);

    const productosMasVendidos = productosOrdenados.slice(0, 5);
    const productosMenosVendidos = productosOrdenados.slice(-5);

    this.productosMasVendidosData = productosMasVendidos.map(p => p.cantidadVentas);
    this.productosMasVendidosLabels = productosMasVendidos.map(p => p.producto.nombre);

    this.productosMenosVendidosData = productosMenosVendidos.map(p => p.cantidadVentas);
    this.productosMenosVendidosLabels = productosMenosVendidos.map(p => p.producto.nombre);

    // Actualizar los datos de los gráficos
    this.barChartData.labels = [...this.productosMasVendidosLabels, ...this.productosMenosVendidosLabels];
    this.barChartData.datasets[0].data = [...this.productosMasVendidosData, ...this.productosMenosVendidosData];
  }

}
