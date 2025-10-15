import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificacionService } from '../../../services/notificacion.service';
import { ObservacionesTabComponent } from '../../observaciones/components/observaciones-tab.component';
import { ArchivosExpedienteComponent } from '../../expedientes/components/archivos/archivos-expediente.component';
import { AlertasListComponent } from '../../alertas/components';

@Component({
  selector: 'app-notificacion-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    ObservacionesTabComponent,
    ArchivosExpedienteComponent,
    AlertasListComponent
  ],
  templateUrl: './notificacion-detail.component.html',
  styleUrls: ['./notificacion-detail.component.scss'],
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
export class NotificacionDetailComponent implements OnInit, AfterViewInit {
  @ViewChildren('tabLabel', { read: ElementRef }) tabLabels!: QueryList<ElementRef>;

  notificacion: any = null;
  loading = true;
  selectedTabIndex = 0;
  underlineWidth = 0;
  underlineLeft = 0;
  mostrarFormularioAlerta = false;

  tabs = [
    { label: 'Información General', icon: 'info', chip: false, chipValue: 0 },
    { label: 'Alertas', icon: 'add_alert', chip: true, chipValue: 0 },
    { label: 'Observaciones', icon: 'note', chip: true, chipValue: 0 },
    { label: 'Archivos', icon: 'attach_file', chip: true, chipValue: 0 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificacionService: NotificacionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadNotificacion(id);
      }
    });
  }

  ngAfterViewInit(): void {
    // Configurar el subrayado inicial después de que la vista esté cargada
    setTimeout(() => {
      this.updateUnderline();
    }, 100);
  }

  private loadNotificacion(id: number): void {
    this.loading = true;
    this.notificacionService.getNotificacion(id).subscribe(
      (data: any) => {
        this.notificacion = data;
        console.log('[NotificacionDetail] Notificación cargada:', this.notificacion);
        this.loading = false;
        
        // Actualizar contadores de chips
        this.updateChipCounts();
      },
      (error: any) => {
        console.error('Error al cargar notificación:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar la notificación', 'Cerrar', { duration: 3000 });
      }
    );
  }

  onCrearAlerta(alerta: any): void {
    console.log('[NotificacionDetail] Recibido evento create alerta:', alerta);
    if (this.notificacion) {
      alerta.IdTransaccion = this.notificacion.IdTransaccion; // Asignar IdTransaccion de la notificación
      // Lógica para manejar la creación de alertas
    }
    this.mostrarFormularioAlerta = false;
  }

  private updateChipCounts(): void {
    if (this.notificacion?.IdTransaccion) {
      console.log(`[NotificacionDetail] IdTransaccion disponible: ${this.notificacion.IdTransaccion}`);
      this.tabs[1].chipValue = this.notificacion.alertas?.length || 0;
    } else {
      this.tabs[1].chipValue = 0; // Alertas
    }
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index;
    setTimeout(() => {
      this.updateUnderline();
    }, 10);
  }

  private updateUnderline(): void {
    if (this.tabLabels && this.tabLabels.length > 0) {
      const activeTab = this.tabLabels.toArray()[this.selectedTabIndex];
      if (activeTab && activeTab.nativeElement) {
        const element = activeTab.nativeElement;
        this.underlineWidth = element.offsetWidth;
        this.underlineLeft = element.offsetLeft;
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  formatDate(dateString: string | null): string {
    if (!dateString) {
      return 'No especificada';
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get idTransaccion(): number | null {
    return this.notificacion?.IdTransaccion || null;
  }
}