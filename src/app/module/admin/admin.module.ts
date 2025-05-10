import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TextareaModule} from 'primeng/textarea';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';
import {PanelModule} from 'primeng/panel';
import {InputNumberModule} from 'primeng/inputnumber';
import {BadgeModule} from 'primeng/badge';
import { MultiSelectModule } from 'primeng/multiselect';

import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TabViewModule} from 'primeng/tabview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessageModule } from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';
import { ChangePasswordAdminComponent } from './change-password-admin/change-password-admin.component';
import { ActivationAdminComponent } from './activation-admin/activation-admin.component';
import { ForgetPasswordAdminComponent } from './forget-password-admin/forget-password-admin.component';


import { LocauxAdminModule } from './view/locaux/locaux-admin.module';
import { LocauxAdminRoutingModule } from './view/locaux/locaux-admin-routing.module';
import { FinanceAdminModule } from './view/finance/finance-admin.module';
import { FinanceAdminRoutingModule } from './view/finance/finance-admin-routing.module';
import { LocataireAdminModule } from './view/locataire/locataire-admin.module';
import { LocataireAdminRoutingModule } from './view/locataire/locataire-admin-routing.module';

import {SecurityModule} from 'src/app/module/security/security.module';
import {SecurityRoutingModule} from 'src/app/module/security/security-routing.module';


@NgModule({
  declarations: [
   LoginAdminComponent,
   RegisterAdminComponent,
   ChangePasswordAdminComponent,
   ActivationAdminComponent,
   ForgetPasswordAdminComponent
  ],
  imports: [
    CommonModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SplitButtonModule,
    DropdownModule,
    TabViewModule,
    InputSwitchModule,
    TextareaModule,
    CalendarModule,
    PanelModule,
    MessageModule,
    MessagesModule,
    InputNumberModule,
    BadgeModule,
    MultiSelectModule,
    IconField,
    InputIcon,
  LocauxAdminModule,
  LocauxAdminRoutingModule,
  FinanceAdminModule,
  FinanceAdminRoutingModule,
  LocataireAdminModule,
  LocataireAdminRoutingModule,
   SecurityModule,
   SecurityRoutingModule
  ],
  exports: [
    LoginAdminComponent,
    RegisterAdminComponent,
    ChangePasswordAdminComponent,
    ActivationAdminComponent,
    ForgetPasswordAdminComponent,

    LocauxAdminModule,
    FinanceAdminModule,
    LocataireAdminModule,
    SecurityModule
  ],

})
export class AdminModule { }
