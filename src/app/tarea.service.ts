import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tarea } from './tarea';
import { Observable, of, empty } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TareaService {

  url: 'http://localhost:8000/tareas/';

  constructor(private http: HttpClient) { }

  crearTarea(t: Tarea, user_token,username): Observable<any> {
    console.log("el user es : ",username);
    return this.http.post('http://localhost:8000/tareas/', {
      'titulo': t.titulo,
      'descripcion': t.descripcion,
      'estado': t.estado,
      'fecha_inicio': t.fecha_inicio,
      'fecha_termino': t.fecha_termino,
      'lat': t.lat,
      'lng': t.lng,
      'nombre_usuario': username
    }, {
      headers: {'Authorization': `Token ${user_token}`}});
  }

  actualizarTarea(t: Tarea, user_token): Observable<any> {
    return this.http.put(`http://localhost:8000/tareas/${t.id}/`, {
      'titulo': t.titulo,
      'descripcion': t.descripcion,
      'estado': t.estado,
      'fecha_inicio': t.fecha_inicio,
      'fecha_termino': t.fecha_termino
    }, {
      headers: {'Authorization': `Token ${user_token}`}});
  }

  getTareas(user_token): Observable<any> {
    console.log(`Tarea service user_token: ${user_token}`);
    return this.http.get('http://localhost:8000/tareas/', {
      headers: {'Authorization': `Token ${user_token}`}
    });
  }
}
