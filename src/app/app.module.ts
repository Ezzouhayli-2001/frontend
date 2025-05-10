import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {TextareaModule} from 'primeng/textarea';

import {FileUploadModule} from 'primeng/fileupload';
import {SelectButtonModule} from 'primeng/selectbutton';
import {PanelMenuModule} from 'primeng/panelmenu';
import {CalendarModule} from 'primeng/calendar';
import {TabViewModule} from 'primeng/tabview';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {PanelModule} from 'primeng/panel';
import {BrowserModule} from '@angular/platform-browser';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {PasswordModule} from 'primeng/password';
import {MessageModule} from 'primeng/message';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SplitButtonModule} from 'primeng/splitbutton';
import {DialogModule} from 'primeng/dialog';
import {ConfirmationService, MessageService} from 'primeng/api';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import {Injector, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayout } from 'src/app/layout/component/app.layout.component';
import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {UserService} from 'src/app/zynerator/security/shared/service/User.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';
import {JwtInterceptor} from 'src/app/zynerator/security/interceptors/jwt.interceptor';



import {SpinnerComponent} from 'src/app/zynerator/spinner/spinner.component';
import { HttpRequestInterceptor } from 'src/app/zynerator/spinner/http.interceptor';
import { ProgressSpinner } from 'primeng/progressspinner';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';


import {AdminModule} from './module/admin/admin.module';
import {AdminRoutingModule} from './module/admin/admin-routing.module';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@NgModule({
imports: [
    AppRoutingModule,
    ButtonModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    PanelMenuModule,
    RadioButtonModule,
    InputTextModule,
    AppRoutingModule,
    HttpClientModule,
    DropdownModule,
    TabViewModule,
    SplitButtonModule,
    InputSwitchModule,
    TextareaModule,
    CalendarModule,
    PanelModule,
    MessageModule,
    CardModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    FileUploadModule,
    SelectButtonModule,
    ProgressSpinner,


    AdminModule,
    AdminRoutingModule,

  TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient]
  }
  })
],
declarations: [
    AppComponent,
    SpinnerComponent,
],
providers: [
/*    { provide: LocationStrategy, useClass: HashLocationStrategy }, */
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
     provideHttpClient(withFetch()),
     provideAnimationsAsync(),
     providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
     UserService,
     RoleService,
     MessageService,
     ConfirmationService,
     DatePipe
],
bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule{
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}

