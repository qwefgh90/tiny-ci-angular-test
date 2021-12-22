import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './ui/header/auth/auth.component';
import { ButtonModule } from 'primeng/button'
import { SplitButtonModule } from 'primeng/splitbutton';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RepositoryListComponent } from './routed/repository-list/repository-list.component'
import { InputSwitchModule } from 'primeng/inputswitch';
import { DashboardComponent } from './routed/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import { MenuComponent } from './ui/header/menu/menu.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RepositoryListComponent,
    DashboardComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    ButtonModule,
    SplitButtonModule,
    InputSwitchModule,
    TableModule,
    AngularFireModule.initializeApp(environment.firebase),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
