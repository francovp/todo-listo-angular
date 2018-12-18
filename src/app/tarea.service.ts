import { Injectable } from '@angular/core';
import { Tarea } from './tarea';
import { Observable, of, empty } from 'rxjs';
import { Http, Response } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  url : string = 'http://localhost:8000/tareas/';

  /*
  tareas: Array<Tarea> = [
    new Tarea(1, 'Comprar leche', 'Y pañales para el bebe')
    , new Tarea(2, 'Hacer Taller Angular', 'Falta empezar...')
    , new Tarea(3, 'Preparar papers', 'Por fin')
  ];
  */
  
  tareas: Array<Tarea> = [];

  constructor(private http: Http) { 
    this.http.get(this.url).toPromise().then((res)=>{
       for(let i of res.json())
      {
        var nuevo = new Tarea(i['id'], i['titulo'], i['descripcion'], i['estado'])
        this.tareas.push(nuevo)
      }
  });
  }


crearTarea(t: Tarea): Observable<any> {
    // Obtener maximo id en this.tareas e incrementar en 1 para el nuevo id
    const newId = Math.max.apply(null, this.tareas.map(x => x.id)) + 1;
    // Insertar en el 'backend' la nueva tarea con el id generado y sus atributos
    console.log("el ide es : ",newId);
    this.tareas.push(new Tarea(newId, t.titulo, t.descripcion,0));
    // Se retorna un observable vacío solamente para seguir usando observables
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    var datos = {
        "titulo": t.titulo,
        "descripcion": t.descripcion,
        "estado": 0,
        
    }
    this.http.post(this.url,datos).toPromise().then((res)=>{
        console.log("json responde: ",res.json());
    });
    return empty();
  }

  actualizarTarea(t: Tarea)
  {
    var datos = {
      "titulo": t.titulo,
      "descripcion": t.descripcion,
      "estado": t.estado,
  }
    var pagina = this.url+t.id+"/";
    console.log("la pagina es : ",pagina);
    this.http.put(pagina,datos).toPromise().then((res)=>{
      console.log("json responde: ",res.json());
    });
  }

  getTareas(): Observable<any> {
    return of(this.tareas);
  }
}
