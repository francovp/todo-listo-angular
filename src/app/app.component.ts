import {Component, Inject, OnInit} from '@angular/core';
import { Tarea, EstadoTarea } from './tarea';
import { TareaService } from './tarea.service';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { TmplAstElement } from '@angular/compiler';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Todo Listo!';
  estadoTareas = EstadoTarea;
  tareaSeleccionada: Tarea;
  tareas: Array<Tarea>;
  newTarea: Tarea;

  username: string;
  password: string;
  loggedIn = false;
  user_token: string;
  options;

    markers: L.Layer[] = [];

  constructor(public tareaService: TareaService, private http: HttpClient, public dialog: MatDialog) {
    this.tareas = [];
    this.newTarea = new Tarea(null, null, null, null, null,0,null,null,null);
    let maybe_user_token = window.localStorage.getItem('user_token');
    let maybe_user = window.localStorage.getItem('username');
    console.log("nombre de usuario",maybe_user);
    if(maybe_user_token && maybe_user) {
      this.loggedIn = true;
      this.user_token = maybe_user_token;
      this.username = maybe_user;
    }
  }

  iniciarSesion() {
    console.log(`u: ${this.username} - p: ${this.password}`);
    this.http.post('http://localhost:8000/rest-auth/login/', {
      'username': this.username,
      'password': this.password,
    }).subscribe(res => {
        console.log(`res: ${res['key']}`);
        this.loggedIn = true;
        this.user_token = res['key'];
        window.localStorage.setItem('user_token', res['key']);
        window.localStorage.setItem('username', this.username);
        this.refrescarTareas();
    })
  }

  ngOnInit() {

    this.options = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 15,
      center: L.latLng(-33.0454915, -71.6124715),
    };


    this.refrescarTareas();

    interval(30 * 1000).subscribe(_ => {
      console.log('Refrescando tareas');
      this.refrescarTareas();
    });
  }

  refrescarTareas() {
    console.log("refresco");
    this.tareaService.getTareas(this.user_token)
      .subscribe((ts: Array<Tarea>) => {
        this.tareas = ts;
      });

  }

  mapClick(evt) {
    console.log(`Click: ${evt}`);
    console.log(Object.keys(evt));
    console.log(evt['latlng']);
    this.addMarker(evt['latlng']);
  }

  addMarker(latlng) {
    this.newTarea.lat = latlng['lat'];
    this.newTarea.lng = latlng['lng'];
    const newMarker = L.marker([latlng['lat'],  latlng['lng']], {
      icon: L.icon({
         iconSize: [ 25, 41 ],
         iconAnchor: [ 13, 41 ],
         iconUrl:   'assets/marker-icon.png',
         shadowUrl: 'assets/marker-shadow.png'
      })
    });

    while(this.markers.length > 0) {
      this.markers.pop();
    }
    this.markers.push(newMarker);
  }

  actualizarTarea(t: Tarea) {
    console.log(`La tarea ${t} fue actualizada!`);
    this.tareaService.actualizarTarea(t, this.user_token).subscribe(_ => { });
  }

  seleccionarTarea(t: Tarea) {
    this.tareaSeleccionada = t;
  }

  crearTarea() {
    this.tareaService.crearTarea(this.newTarea, this.user_token,this.username).subscribe(_ => {
      this.refrescarTareas();
    });
  }

  estado2str(e: EstadoTarea) {
    switch (e) {
      case EstadoTarea.Creada: return 'Creada';
      case EstadoTarea.EnProceso: return 'En Proceso';
      case EstadoTarea.Terminada: return 'Terminada';
    }
  }

    openDialog(): void {
      const dialogRef = this.dialog.open(AllGeoreferencedTasksDialogComponent, {
            height: '80vh',
            width: '100vw',
            data: {tasks: this.tareas}
        });
    
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

}

@Component({
    selector: 'all-georeferenced-tasks-dialog-component',
    templateUrl: 'all-georeferenced-tasks-dialog-component.html',
})
export class AllGeoreferencedTasksDialogComponent implements OnInit {
    markersMap2: L.Layer[] = [];
    option2;
    constructor(
        public dialogRef: MatDialogRef<AllGeoreferencedTasksDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,public datepipe: DatePipe ) {}

        ngOnInit(){
          this.option2 = {
            layers: [
              L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
            ],
            zoom: 15,
            center: L.latLng(-33.0454915, -71.6124715),
          };
            
            for (let task of this.data.tasks) {
              
                if (task.estado ==0)
                  var estado = "Creada";
                else if (task.estado == 1)
                  var estado = "En Proceso";
                else
                  var estado = "Terminada";
                let latlng = L.latLng(task.lat, task.lng);
                if (task.fecha_inicio == null || task.fecha_termino == null) {
                    let punto = L.marker(latlng, {
                        icon: L.icon({
                            iconSize: [ 25, 41 ],
                            iconAnchor: [ 13, 41 ],
                            iconUrl:   'assets/marker-icon.png',
                            shadowUrl: 'assets/marker-shadow.png'
                        })
                    } ).bindPopup("<p>Titulo: "+task.titulo + "</p><p>Descripsión:"+task.descripcion+"</p><p>Estado:"+estado+"</p>");
                    this.markersMap2.push(punto);
                } else {
                    
                    var fechaInicio =this.datepipe.transform(task.fecha_inicio, 'dd-MM-yyyy');
                    var fechaTermino =this.datepipe.transform(task.fecha_termino, 'dd-MM-yyyy');
                    let punto = L.marker(latlng,
                        {
                            icon: L.icon({
                                iconSize: [ 25, 41 ],
                                iconAnchor: [ 13, 41 ],
                                iconUrl:   'assets/marker-icon.png',
                                shadowUrl: 'assets/marker-shadow.png'
                            })
                        }).bindPopup("<p>Titulo: "+task.titulo + "</p><p>Descripsión: "+task.descripcion+"</p><p>Fecha de inicio: "+fechaInicio+"</p><p>Fecha de termino:"+fechaTermino+"</p><p>Estado: "+estado+"</p>");

                    this.markersMap2.push(punto);
                }
            }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}






























/*
export class AppComponent implements OnInit {
  title = 'Todo Listo!';
  estadoTareas = EstadoTarea;
  tareaSeleccionada: Tarea;
  tareas: Array<Tarea>;
  newTarea: ITarea;
  estado2str = estado2str;

  constructor(private tareaService: TareaService) {
    this.tareas = [];
    this.newTarea = {
      titulo: '',
      descripcion: ''
    };
  }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.tareaService.getTareas()
        .subscribe(tareas => {
          this.tareas = tareas;
        });
  }

  seleccionarTarea(t: Tarea) {
    this.tareaSeleccionada = t;
  }

  crearTarea() {
    console.log(this.newTarea);
    // TODO: Add loading controller
    this.tareaService.crearTarea(this.newTarea);
  }

  guardarTarea(t: Tarea) {
    console.log(`Guardando tarea: ${t}`);
  }
}
*/
