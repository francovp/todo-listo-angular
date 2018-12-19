export enum EstadoTarea {
    Creada
    , EnProceso
    , Terminada
}

export function estado2str(e: EstadoTarea): string {
    switch (e) {
      case EstadoTarea.Creada: return 'Creada';
      case EstadoTarea.EnProceso: return 'En Proceso';
      case EstadoTarea.Terminada: return 'Terminada';
    }
  }

export class Tarea {
    id: number;
    titulo: string;
    descripcion;
    estado: EstadoTarea;
    fecha_inicio: any;
    fecha_termino: any;

    constructor(id, titulo, descripcion, fecha_inicio, fecha_termino, estado = EstadoTarea.Creada) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.fecha_inicio = fecha_inicio;
        this.fecha_termino = fecha_termino;
    }

    toString() {
        return `Tarea #${this.id}: ${this.titulo}`;
    }
}
