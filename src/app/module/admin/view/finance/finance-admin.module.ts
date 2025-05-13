import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TextareaModule} from 'primeng/textarea';
import {EditorModule} from "primeng/editor";

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';
import {PanelModule} from 'primeng/panel';
import {InputNumberModule} from 'primeng/inputnumber';
import {BadgeModule} from 'primeng/badge';
import {MultiSelectModule} from 'primeng/multiselect';
import {TranslateModule} from '@ngx-translate/core';
import {FileUploadModule} from 'primeng/fileupload';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CardModule} from "primeng/card";
import {TagModule} from "primeng/tag";

import {CaisseCreateAdminComponent} from './caisse/create/caisse-create-admin.component';
import {CaisseEditAdminComponent} from './caisse/edit/caisse-edit-admin.component';
import {CaisseViewAdminComponent} from './caisse/view/caisse-view-admin.component';
import {CaisseListAdminComponent} from './caisse/list/caisse-list-admin.component';
import {BanqueCreateAdminComponent} from './banque/create/banque-create-admin.component';
import {BanqueEditAdminComponent} from './banque/edit/banque-edit-admin.component';
import {BanqueViewAdminComponent} from './banque/view/banque-view-admin.component';
import {BanqueListAdminComponent} from './banque/list/banque-list-admin.component';
import {CompteCreateAdminComponent} from './compte/create/compte-create-admin.component';
import {CompteEditAdminComponent} from './compte/edit/compte-edit-admin.component';
import {CompteViewAdminComponent} from './compte/view/compte-view-admin.component';
import {CompteListAdminComponent} from './compte/list/compte-list-admin.component';
import {ChargeCreateAdminComponent} from './charge/create/charge-create-admin.component';
import {ChargeEditAdminComponent} from './charge/edit/charge-edit-admin.component';
import {ChargeViewAdminComponent} from './charge/view/charge-view-admin.component';
import {ChargeListAdminComponent} from './charge/list/charge-list-admin.component';

import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TabViewModule} from 'primeng/tabview';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import {PaginatorModule} from 'primeng/paginator';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {CompteAdminCreateAdminComponent} from "./compte-admin/create/compte-admin-create-admin.component";
import {CompteAdminListAdminComponent} from "./compte-admin/list/compte-admin-list-admin.component";
import {CompteAdminViewAdminComponent} from "./compte-admin/view/compte-admin-view-admin.component";
import {CompteAdminEditAdminComponent} from "./compte-admin/edit/compte-admin-edit-admin.component";
import {CompteChargeCreateAdminComponent} from "./compte-charge/create/compte-charge-create-admin.component";
import {CompteChargeListAdminComponent} from "./compte-charge/list/compte-charge-list-admin.component";
import {CompteChargeViewAdminComponent} from "./compte-charge/view/compte-charge-view-admin.component";
import {CompteChargeEditAdminComponent} from "./compte-charge/edit/compte-charge-edit-admin.component";
import {Ripple} from "primeng/ripple";
import {Tooltip} from "primeng/tooltip";
import {
    CompteInstantaneeCreateAdminComponent
} from "./compte-instantanee/create/compte-instantanee-create-admin.component";
import {CompteInstantaneeListAdminComponent} from "./compte-instantanee/list/compte-instantanee-list-admin.component";
import {CompteInstantaneeViewAdminComponent} from "./compte-instantanee/view/compte-instantanee-view-admin.component";
import {CompteInstantaneeEditAdminComponent} from "./compte-instantanee/edit/compte-instantanee-edit-admin.component";
import {CompteLocataireCreateAdminComponent} from "./compte-locataire/create/compte-locataire-create-admin.component";
import {CompteLocataireEditAdminComponent} from "./compte-locataire/edit/compte-locataire-edit-admin.component";
import {CompteLocataireViewAdminComponent} from "./compte-locataire/view/compte-locataire-view-admin.component";
import {CompteLocataireListAdminComponent} from "./compte-locataire/list/compte-locataire-list-admin.component";
import {ReleverGeneraleComponent} from "./relever-generale/relever-generale.component";
import {UIChart} from "primeng/chart";


@NgModule({
  declarations: [

    CaisseCreateAdminComponent,
    CaisseListAdminComponent,
    CaisseViewAdminComponent,
    CaisseEditAdminComponent,
    BanqueCreateAdminComponent,
    BanqueListAdminComponent,
    BanqueViewAdminComponent,
    BanqueEditAdminComponent,
    CompteCreateAdminComponent,
    CompteListAdminComponent,
    CompteViewAdminComponent,
    CompteEditAdminComponent,
    ChargeCreateAdminComponent,
    ChargeListAdminComponent,
    ChargeViewAdminComponent,
    ChargeEditAdminComponent,
    CompteInstantaneeCreateAdminComponent,
    CompteInstantaneeListAdminComponent,
    CompteInstantaneeViewAdminComponent,
    CompteInstantaneeEditAdminComponent,
      CompteAdminCreateAdminComponent,
      CompteAdminListAdminComponent,
      CompteAdminViewAdminComponent,
      CompteAdminEditAdminComponent,
      CompteChargeCreateAdminComponent,
      CompteChargeListAdminComponent,
      CompteChargeViewAdminComponent,
      CompteChargeEditAdminComponent,
      CompteLocataireCreateAdminComponent,
      CompteLocataireListAdminComponent,
      CompteLocataireViewAdminComponent,
      CompteLocataireEditAdminComponent,
      CompteInstantaneeCreateAdminComponent,
      CompteInstantaneeListAdminComponent,
      CompteInstantaneeViewAdminComponent,
      CompteInstantaneeEditAdminComponent,
      ReleverGeneraleComponent
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
        PaginatorModule,
        TranslateModule,
        FileUploadModule,
        FullCalendarModule,
        CardModule,
        EditorModule,
        TagModule,
        IconField,
        InputIcon,
        Ripple,
        Tooltip,
        UIChart


    ],
  exports: [
  CaisseCreateAdminComponent,
  CaisseListAdminComponent,
  CaisseViewAdminComponent,
  CaisseEditAdminComponent,
  BanqueCreateAdminComponent,
  BanqueListAdminComponent,
  BanqueViewAdminComponent,
  BanqueEditAdminComponent,
  CompteCreateAdminComponent,
  CompteListAdminComponent,
  CompteViewAdminComponent,
  CompteEditAdminComponent,
  ChargeCreateAdminComponent,
  ChargeListAdminComponent,
  ChargeViewAdminComponent,
  ChargeEditAdminComponent,
  CompteInstantaneeCreateAdminComponent,
  CompteInstantaneeListAdminComponent,
  CompteInstantaneeViewAdminComponent,
  CompteInstantaneeEditAdminComponent,
      CompteLocataireCreateAdminComponent,
      CompteLocataireListAdminComponent,
      CompteLocataireViewAdminComponent,
      CompteLocataireEditAdminComponent,
  ],
})
export class FinanceAdminModule { }
