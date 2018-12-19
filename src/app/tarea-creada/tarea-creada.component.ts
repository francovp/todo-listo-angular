import { Component } from '@angular/core';
import { Tarea, EstadoTarea } from '../tarea';
import { TareaBase } from '../tarea-base/tarea-base';

@Component({
  selector: 'app-tarea-creada',
  templateUrl: './tarea-creada.component.html',
  styleUrls: ['./tarea-creada.component.css']
})
export class TareaCreadaComponent extends TareaBase {

  actualizarTarea(nuevoTitulo, nuevaDesc) {
    this.tarea.titulo = nuevoTitulo;
    this.tarea.descripcion = nuevaDesc;
    console.log(this.tarea);
    this.tareaActualizada.emit(this.tarea);
  }

  obtenerSiguienteEstado(t: Tarea) {
    return EstadoTarea.EnProceso;
  }

}


