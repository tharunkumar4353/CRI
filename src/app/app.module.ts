import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { DataService } from './demo/service/data.service';
import { BrowserModule } from '@angular/platform-browser';
import { LoginModule } from './demo/components/auth/login/login.module'; // Adjust the path accordingly
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from 'src/app/demo/service/socket.service';
import { HttpClientModule } from '@angular/common/http';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

const config: SocketIoConfig = {
    url: 'http://192.168.16.138:5000',  // URL of your Flask-SocketIO server
    options: {
      transports: ['websocket'],
      withCredentials: false,
    }
  };
  

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent,
    ],
    imports: [
        AppRoutingModule,
        HttpClientModule,
        LoginModule,
        AppLayoutModule,
        TimepickerModule.forRoot(),  // Import TimepickerModule here
        SocketIoModule.forRoot(config),
        ConfirmDialogModule,
        BrowserModule,
        
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService,DataService, ProductService,SocketService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
