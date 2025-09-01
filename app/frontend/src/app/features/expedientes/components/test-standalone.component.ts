import { Component } from '@angular/core';

@Component({
  selector: 'app-test-standalone',
  standalone: true,
  template: `<div style="color: green; font-weight: bold;">¡Componente standalone de prueba funciona!</div>`
})
export class TestStandaloneComponent {}
