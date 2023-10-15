import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  items: MenuItem[] = [{
      id:"0",
      label: "Seleccionar servicio"
    },
    {
      id:"1",
      label: "Selecionar algoritmo"
    },
    {
      id:"2",
      label: "Rellenar los campos requeridos"
    },
    {
      id:"3",
      label: "Usar el visualizador"
    },
    {
      id:"4",
      label: "Ver respuesta"
    }
  ]
  activeIndex = 0
}
