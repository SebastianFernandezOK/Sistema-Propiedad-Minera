import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ArchivoEditComponent } from '../../expedientes/components/archivos/archivo-edit.component';
import { ResolucionService, ResolucionDetalleResponse } from '../services/resolucion.service';
import { ArchivoService } from '../../archivos/services/archivo.service';
import { AlertasListComponent } from '../../alertas/components/alertas-list.component';
import { ObservacionesTabComponent } from '../../observaciones/components/observaciones-tab.component';
import { AlertaService } from '../../alertas/services/alerta.service';
import { ObservacionesService } from '../../observaciones/services/observaciones.service';

@Component({
  selector: 'app-resolucion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    ArchivoEditComponent,
    AlertasListComponent,
    ObservacionesTabComponent,
    DatePipe
  ],
  templateUrl: './resolucion-detail.component.html',
  styleUrls: ['./resolucion-detail.component.css'],
  animations: [
    trigger('slideContent', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('400ms cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class ResolucionDetalleComponent implements OnInit, AfterViewInit {
  archivoResolucionEnEdicion: any = null;

  editarArchivoResolucion(archivo: any) {
    this.archivoResolucionEnEdicion = archivo;
  }

  onArchivoResolucionActualizado(archivoActualizado: any) {
    this.archivoResolucionEnEdicion = null;
    // Refrescar la lista de archivos
    if (this.resolucion && this.resolucion.IdTransaccion) {
      this.cargarArchivosResolucion(this.resolucion.IdTransaccion);
    }
    // Opcional: mostrar feedback visual
    // this.snackBar.open('Descripción actualizada con éxito', 'Cerrar', { duration: 3000 });
  }
  mostrarFormularioArchivoResolucion = false;
  archivoSeleccionadoResolucion: File | null = null;
  descripcionArchivoResolucion: string = '';
  loadingArchivoResolucion: boolean = false;
  errorArchivoResolucion: string = '';
  archivosResolucion: any[] = [];
  displayedColumnsArchivosResolucion: string[] = ['nombre', 'descripcion', 'fecha', 'acciones'];
  paginaActualArchivosResolucion: number = 1;
  pageSizeArchivosResolucion: number = 10;
  totalArchivosResolucion: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resolucionService: ResolucionService,
    private alertaService: AlertaService,
    private observacionesService: ObservacionesService,
  private archivoService: ArchivoService,
  private snackBar: MatSnackBar
  ) {}

  formatFechaArgentina(fecha: string): string {
    if (!fecha) return '';
    try {
      return new Date(fecha).toLocaleString('es-AR', {
        timeZone: 'America/Argentina/San_Juan',
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  }

  cancelarSubidaArchivoResolucion() {
    this.archivoSeleccionadoResolucion = null;
    this.descripcionArchivoResolucion = '';
    this.errorArchivoResolucion = '';
    this.loadingArchivoResolucion = false;
    this.mostrarFormularioArchivoResolucion = false;
  }

  onArchivoSeleccionadoResolucion(event: any) {
    const file = event.target.files && event.target.files[0];
    this.archivoSeleccionadoResolucion = file || null;
    this.errorArchivoResolucion = '';
  }

  subirArchivoResolucion() {
    if (!this.archivoSeleccionadoResolucion || !this.resolucion || !this.resolucion.IdTransaccion) {
      this.errorArchivoResolucion = 'Debe seleccionar un archivo y tener una resolución válida.';
      return;
    }
    this.loadingArchivoResolucion = true;
    this.errorArchivoResolucion = '';
    // Usar ArchivoService para subir archivo
    // entidad: 'resolucion', idEntidad: IdTransaccion
    if (!this.archivoSeleccionadoResolucion || !this.resolucion || typeof this.resolucion.IdTransaccion !== 'number') {
      this.errorArchivoResolucion = 'Debe seleccionar un archivo y tener una resolución válida.';
      return;
    }
    this.loadingArchivoResolucion = true;
    this.errorArchivoResolucion = '';
    this.archivoService.uploadArchivo(
      this.archivoSeleccionadoResolucion,
      'resolucion',
      this.resolucion.IdTransaccion,
      this.archivoSeleccionadoResolucion.name || '',
      this.descripcionArchivoResolucion,
      1
    ).subscribe({
      next: (res: any) => {
        if (res.progress === 100 && res.response) {
          if (this.resolucion?.IdTransaccion !== null && typeof this.resolucion?.IdTransaccion === 'number') {
            this.cargarArchivosResolucion(this.resolucion.IdTransaccion);
          }
          this.cancelarSubidaArchivoResolucion();
          this.snackBar.open('Archivo subido correctamente', 'Cerrar', { duration: 3000 });
        }
        this.loadingArchivoResolucion = false;
      },
      error: (err: any) => {
        this.errorArchivoResolucion = 'Error al subir archivo: ' + (err?.error?.detail || err.message || '');
        this.loadingArchivoResolucion = false;
      }
    });
  }

  cargarArchivosResolucion(idTransaccion: number) {
    this.archivoService.getArchivosByEntidad('resolucion', idTransaccion, this.paginaActualArchivosResolucion, this.pageSizeArchivosResolucion).subscribe({
      next: (response: any) => {
        this.archivosResolucion = response.archivos || [];
        const pag = response.pagination || {};
        this.totalArchivosResolucion = pag.total_items || 0;
        this.paginaActualArchivosResolucion = pag.current_page || 1;
      },
      error: (error: any) => {
        console.error('Error al cargar archivos de resolución:', error);
      }
    });
  }

  onPageChangeArchivosResolucion(event: any) {
    this.pageSizeArchivosResolucion = event.pageSize;
    this.paginaActualArchivosResolucion = event.pageIndex + 1;
    if (this.resolucion && this.resolucion.IdTransaccion) {
      this.cargarArchivosResolucion(this.resolucion.IdTransaccion);
    }
  }

  descargarArchivoResolucion(archivo: any) {
    const link = archivo.Link || '';
    const nombre = archivo.Nombre || '';
    this.archivoService.downloadArchivo(link, nombre).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error al descargar archivo:', error);
      }
    });
  }
  @ViewChildren('tabLabel', { read: ElementRef }) tabLabels!: QueryList<ElementRef>;
  underlineWidth = 0;
  underlineLeft = 0;
  resolucion: ResolucionDetalleResponse | null = null;
  loading = true;
  tabs = [
    { label: 'Información General', icon: 'info', chip: false },
    { label: 'Alertas', icon: 'warning', chip: true, chipValue: 0 },
    { label: 'Observaciones', icon: 'comment', chip: false },
    { label: 'Archivos', icon: 'attach_file', chip: false }
  ];
  selectedTabIndex = 0;
  alertas: any[] = [];
  totalAlertas = 0;
  observaciones: any[] = [];

  // ...existing code...

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('resolucionId'));
    if (id) {
      this.resolucionService.getResolucionById(id).subscribe({
        next: (resp: ResolucionDetalleResponse) => {
          this.resolucion = resp;
          this.tabs[1].chipValue = 0;
          this.alertas = [];
          this.totalAlertas = 0;
          this.observaciones = [];
          if (resp.IdTransaccion) {
            this.cargarArchivosResolucion(resp.IdTransaccion);
            this.alertaService
              .getByResolucionId(resp.IdResolucion, 0, 5)
              .subscribe(result => {
                this.alertas = result.data;
                this.totalAlertas = result.total;
                this.tabs[1].chipValue = this.totalAlertas;
              });
            this.observacionesService
              .getByTransaccion(resp.IdTransaccion)
              .subscribe(obs => {
                this.observaciones = Array.isArray(obs) ? obs : (obs ? [obs] : []);
              });
          }
          this.loading = false;
          setTimeout(() => this.updateUnderline(), 10);
        },
        error: () => {
          this.resolucion = null;
          this.loading = false;
        }
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateUnderline(), 10);
    this.tabLabels.changes.subscribe(() => {
      setTimeout(() => this.updateUnderline(), 10);
    });
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index;
    setTimeout(() => this.updateUnderline(), 10);
  }

  updateUnderline() {
    if (!this.tabLabels || !this.tabLabels.toArray()[this.selectedTabIndex]) return;
    const el = this.tabLabels.toArray()[this.selectedTabIndex].nativeElement as HTMLElement;
    this.underlineWidth = el.offsetWidth;
    this.underlineLeft = el.offsetLeft;
  }

  goBack() {
    if (this.resolucion && this.resolucion.IdExpediente) {
      this.router.navigate(['/expedientes', this.resolucion.IdExpediente]);
    } else {
      this.router.navigate(['/expedientes']);
    }
  }
}
