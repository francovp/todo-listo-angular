import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UiModule } from './ui/ui.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TareaCreadaComponent } from './tarea-creada/tarea-creada.component';
import { TareaEnProcesoComponent } from './tarea-en-proceso/tarea-en-proceso.component';
import { TareaTerminadaComponent } from './tarea-terminada/tarea-terminada.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TareaCreadaComponent,
    TareaEnProcesoComponent,
    TareaTerminadaComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    UiModule,
    FormsModule,
    HttpClientModule,
    LeafletModule.forRoot(),
    MatNativeDateModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
