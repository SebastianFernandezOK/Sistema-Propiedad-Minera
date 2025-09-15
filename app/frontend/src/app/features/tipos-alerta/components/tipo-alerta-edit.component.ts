import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TipoAlertaFormComponent } from './tipo-alerta-form.component';
import { TipoAlertaService } from '../services/tipo-alerta.service';
import { TipoAlerta, TipoAlertaCreate } from '../models/tipo-alerta.model';

@Component({
  selector: 'app-tipo-alerta-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TipoAlertaFormComponent
  ],
  template: `
    <app-tipo-alerta-form
      [modo]="'editar'"
      [tipoAlerta]="tipoAlertaData"
      [form]="tipoAlertaForm"
      (edit)="onSubmit($event)">
    </app-tipo-alerta-form>
  `
})
export class TipoAlertaEditComponent implements OnInit {
  loading = false;
  error: string | null = null;
  tipoAlertaData: TipoAlerta | null = null;
  tipoAlertaId: number;
  tipoAlertaForm: FormGroup;

  constructor(
    private tipoAlertaService: TipoAlertaService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.tipoAlertaId = Number(this.route.snapshot.paramMap.get('id'));
    this.tipoAlertaForm = this.fb.group({
      Descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      IdArea: [null],
      Asunto: ['', [Validators.maxLength(255)]],
      Mensaje: ['', [Validators.maxLength(1000)]],
      Obs: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.cargarTipoAlerta();
  }

  private cargarTipoAlerta(): void {
    if (!this.tipoAlertaId || isNaN(this.tipoAlertaId)) {
      this.error = 'ID de tipo de alerta inválido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.tipoAlertaService.getById(this.tipoAlertaId).subscribe({
      next: (tipoAlerta) => {
        this.tipoAlertaData = tipoAlerta;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tipo de alerta:', err);
        this.error = 'Error al cargar los datos del tipo de alerta. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onSubmit(tipoAlertaData: TipoAlertaCreate): void {
    this.loading = true;
    this.error = null;

    this.tipoAlertaService.update(this.tipoAlertaId, tipoAlertaData).subscribe({
      next: (result) => {
        console.log('Tipo de alerta actualizado exitosamente:', result);
        // Navegar de vuelta a la lista
        this.router.navigate(['/tipos-alerta']);
      },
      error: (err) => {
        console.error('Error al actualizar tipo de alerta:', err);
        this.error = 'Error al actualizar el tipo de alerta. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tipos-alerta']);
  }
}