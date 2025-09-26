import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActaService, ActaDetalleResponse } from '../services/acta.service';
import { ArchivoService } from '../../archivos/services/archivo.service';
import { ArchivoEditComponent } from '../../expedientes/components/archivos/archivo-edit.component';
import { AutoridadService, Autoridad } from '../../autoridades/services/autoridad.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AlertaService } from '../../alertas/services/alerta.service';
import { ObservacionesService } from '../../observaciones/services/observaciones.service';
import { AlertasListComponent } from '../../alertas/components/alertas-list.component';
import { ObservacionesTabComponent } from '../../observaciones/components/observaciones-tab.component';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-acta-detalle',
  standalone: true,
  templateUrl: './acta-detalle.component.html',
  styleUrls: ['./acta-detalle.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatListModule,
    ObservacionesTabComponent,
    MatIconModule,
    MatDividerModule,
    AlertasListComponent,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    ArchivoEditComponent
  ],
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
export class ActaDetalleComponent implements OnInit, AfterViewInit {
  archivoActaEnEdicion: any = null;
  editarArchivoActa(archivo: any) {
    this.archivoActaEnEdicion = archivo;
  }
  onArchivoActaActualizado(archivoActualizado: any) {
    this.archivoActaEnEdicion = null;
    if (this.acta && this.acta.IdTransaccion) {
      this.cargarArchivosActa(this.acta.IdTransaccion);
    }
    this.snackBar.open('Descripción actualizada con éxito', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }
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
  mostrarFormularioArchivoActa = false;
  cancelarSubidaArchivoActa() {
    this.archivoSeleccionadoActa = null;
    this.descripcionArchivoActa = '';
    this.errorArchivoActa = '';
    this.loadingArchivoActa = false;
    this.mostrarFormularioArchivoActa = false;
  }
  archivoSeleccionadoActa: File | null = null;
  descripcionArchivoActa: string = '';
  loadingArchivoActa: boolean = false;
  errorArchivoActa: string = '';
  onArchivoSeleccionado(event: any) {
    const file = event.target.files && event.target.files[0];
    this.archivoSeleccionadoActa = file || null;
    this.errorArchivoActa = '';
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actaService: ActaService,
    private archivoService: ArchivoService,
    private alertaService: AlertaService,
    private observacionesService: ObservacionesService,
    private autoridadService: AutoridadService,
    private snackBar: MatSnackBar
  ) {}
  subirArchivoActa() {
    if (!this.archivoSeleccionadoActa || !this.acta || !this.acta.IdTransaccion) {
      this.errorArchivoActa = 'Debe seleccionar un archivo y tener un acta válida.';
      return;
    }
    this.loadingArchivoActa = true;
    this.errorArchivoActa = '';
    this.archivoService.uploadArchivo(
      this.archivoSeleccionadoActa,
      'acta',
      this.acta.IdTransaccion,
      this.archivoSeleccionadoActa.name,
      this.descripcionArchivoActa,
      1
    ).subscribe({
      next: (res: any) => {
        if (res.progress === 100 && res.response) {
          this.cargarArchivosActa(this.acta!.IdTransaccion!);
          this.archivoSeleccionadoActa = null;
          this.descripcionArchivoActa = '';
          this.mostrarFormularioArchivoActa = false;
          this.snackBar.open('Archivo subido con éxito', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        }
        this.loadingArchivoActa = false;
      },
      error: (err: any) => {
        this.errorArchivoActa = 'Error al subir archivo: ' + (err?.error?.detail || err.message || '');
        this.loadingArchivoActa = false;
      }
    });
  }
  archivosActa: any[] = [];
  dataSourceArchivosActa = new MatTableDataSource<any>([]);
  displayedColumnsArchivosActa: string[] = ['nombre', 'descripcion', 'fecha', 'acciones'];
  paginaActualArchivosActa: number = 1;
  pageSizeArchivosActa: number = 10;
  totalArchivosActa: number = 0;
  cargarArchivosActa(idActa: number) {
    this.archivoService.getArchivosByEntidad('acta', idActa, this.paginaActualArchivosActa, this.pageSizeArchivosActa).subscribe({
      next: (response: any) => {
        this.archivosActa = response.archivos || [];
        this.dataSourceArchivosActa.data = this.archivosActa;
        const pag = response.pagination || {};
        this.totalArchivosActa = pag.total_items || 0;
        this.paginaActualArchivosActa = pag.current_page || 1;
      },
      error: (error: any) => {
        // Manejo de error
      }
    });
  }
  onPageChangeArchivosActa(event: any) {
    this.pageSizeArchivosActa = event.pageSize;
    this.paginaActualArchivosActa = event.pageIndex + 1;
    if (this.acta && this.acta.IdTransaccion) {
      this.cargarArchivosActa(this.acta.IdTransaccion);
    }
  }
  descargarArchivoActa(archivo: any) {
    const link = archivo.Link || '';
    const nombre = archivo.Nombre || '';
    this.archivoService.downloadArchivo(link, nombre).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        // Manejo de error
      }
    });
  }
  @ViewChildren('tabLabel', { read: ElementRef }) tabLabels!: QueryList<ElementRef>;
  underlineWidth = 0;
  underlineLeft = 0;
  acta: ActaDetalleResponse | null = null;
  loading = true;
  alertas: any[] = [];
  totalAlertas = 0;
  observaciones: any[] = [];
  autoridadNombre: string = '';
  tabs = [
    { label: 'Información General', icon: 'info', chip: false },
    { label: 'Alertas', icon: 'warning', chip: true, chipValue: 0 },
    { label: 'Observaciones', icon: 'comment', chip: false },
    { label: 'Archivos', icon: 'attach_file', chip: false }
  ];
  selectedTabIndex = 0;
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('actaId'));
    if (id) {
      this.actaService.getActaById(id).subscribe({
        next: (resp: ActaDetalleResponse) => {
          this.acta = resp;
          this.loading = false;
          setTimeout(() => this.updateUnderline(), 10);
          if (resp && (resp as any).IdTransaccion) {
            this.loadAlertas(id);
            this.loadObservaciones((resp as any).IdTransaccion);
            this.cargarArchivosActa((resp as any).IdTransaccion);
          }
          if (resp.IdAutoridad) {
            this.cargarAutoridad(resp.IdAutoridad);
          }
        },
        error: () => {
          this.acta = null;
          this.loading = false;
        }
      });
    }
  }
  loadAlertas(idActa: number) {
    this.alertaService.getByActaId(idActa, 0, 5).subscribe(resp => {
      this.alertas = resp.data || [];
      this.totalAlertas = resp.total || 0;
      this.tabs[1].chipValue = this.totalAlertas;
    });
  }
  loadObservaciones(idTransaccion: number) {
    this.observacionesService.getByTransaccion(idTransaccion).subscribe({
      next: obs => {
        this.observaciones = obs ? (Array.isArray(obs) ? obs : [obs]) : [];
      },
      error: err => {
        if (err.status === 404) {
          this.observaciones = [];
        } else {
          // Manejo de error
        }
      }
    });
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
  cargarAutoridad(idAutoridad: string) {
    this.autoridadService.getAll().subscribe({
      next: (autoridades) => {
        const autoridad = autoridades.find(a => a.IdAutoridad === idAutoridad);
        this.autoridadNombre = autoridad ? autoridad.Nombre : 'Autoridad no encontrada';
      },
      error: () => {
        this.autoridadNombre = 'Error al cargar autoridad';
      }
    });
  }
  goBack() {
    if (this.acta && this.acta.IdExpediente) {
      this.router.navigate(['/expedientes', this.acta.IdExpediente]);
    } else {
      this.router.navigate(['/expedientes']);
    }
  }
}
