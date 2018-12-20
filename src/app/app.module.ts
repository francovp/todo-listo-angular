import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UiModule } from './ui/ui.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AllGeoreferencedTasksDialogComponent, AppComponent } from './app.component';
import { TareaCreadaComponent } from './tarea-creada/tarea-creada.component';
import { TareaEnProcesoComponent } from './tarea-en-proceso/tarea-en-proceso.component';
import { TareaTerminadaComponent } from './tarea-terminada/tarea-terminada.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TareaCreadaComponent,
    TareaEnProcesoComponent,
    TareaTerminadaComponent,
    AllGeoreferencedTasksDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    UiModule,
    FormsModule,
    HttpClientModule,
    LeafletModule.forRoot(),
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    AllGeoreferencedTasksDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
