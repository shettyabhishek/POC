import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//importing the angular grid component 
import { AgGridModule } from 'ag-grid-angular';

//Imported custom modules 
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';

//Imported all the services 
import { ApiService } from './services/api.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HomeModule, SharedModule,
        HttpClientModule ,
        BrowserModule,
        BrowserAnimationsModule,
        AgGridModule.withComponents([])
    ],
    providers: [ApiService],
    bootstrap: [AppComponent]
})
export class AppModule { }
