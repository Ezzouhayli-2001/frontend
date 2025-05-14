import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TextareaModule} from 'primeng/textarea';
import {EditorModule} from "primeng/editor";

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';
import {PanelModule} from 'primeng/panel';
import {InputNumberModule} from 'primeng/inputnumber';
import {BadgeModule} from 'primeng/badge';
import { MultiSelectModule } from 'primeng/multiselect';
import {TranslateModule} from '@ngx-translate/core';
import {FileUploadModule} from 'primeng/fileupload';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CardModule} from "primeng/card";
import {TagModule} from "primeng/tag";

import { StatutLocalCreateAdminComponent } from './statut-local/create/statut-local-create-admin.component';
import { StatutLocalEditAdminComponent } from './statut-local/edit/statut-local-edit-admin.component';
import { StatutLocalViewAdminComponent } from './statut-local/view/statut-local-view-admin.component';
import { StatutLocalListAdminComponent } from './statut-local/list/statut-local-list-admin.component';
import { LocataireCreateAdminComponent } from './locataire/create/locataire-create-admin.component';
import { LocataireEditAdminComponent } from './locataire/edit/locataire-edit-admin.component';
import { LocataireViewAdminComponent } from './locataire/view/locataire-view-admin.component';
import { LocataireListAdminComponent } from './locataire/list/locataire-list-admin.component';
import { TypeLocataireCreateAdminComponent } from './type-locataire/create/type-locataire-create-admin.component';
import { TypeLocataireEditAdminComponent } from './type-locataire/edit/type-locataire-edit-admin.component';
import { TypeLocataireViewAdminComponent } from './type-locataire/view/type-locataire-view-admin.component';
import { TypeLocataireListAdminComponent } from './type-locataire/list/type-locataire-list-admin.component';
import { LocationCreateAdminComponent } from './location/create/location-create-admin.component';
import { LocationEditAdminComponent } from './location/edit/location-edit-admin.component';
import { LocationViewAdminComponent } from './location/view/location-view-admin.component';
import { LocationListAdminComponent } from './location/list/location-list-admin.component';
import { ModePaiementCreateAdminComponent } from './mode-paiement/create/mode-paiement-create-admin.component';
import { ModePaiementEditAdminComponent } from './mode-paiement/edit/mode-paiement-edit-admin.component';
import { ModePaiementViewAdminComponent } from './mode-paiement/view/mode-paiement-view-admin.component';
import { ModePaiementListAdminComponent } from './mode-paiement/list/mode-paiement-list-admin.component';
import { TransactionCreateAdminComponent } from './transaction/create/transaction-create-admin.component';
import { TransactionEditAdminComponent } from './transaction/edit/transaction-edit-admin.component';
import { TransactionViewAdminComponent } from './transaction/view/transaction-view-admin.component';
import { TransactionListAdminComponent } from './transaction/list/transaction-list-admin.component';
import { TypePaiementCreateAdminComponent } from './type-paiement/create/type-paiement-create-admin.component';
import { TypePaiementEditAdminComponent } from './type-paiement/edit/type-paiement-edit-admin.component';
import { TypePaiementViewAdminComponent } from './type-paiement/view/type-paiement-view-admin.component';
import { TypePaiementListAdminComponent } from './type-paiement/list/type-paiement-list-admin.component';

import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TabViewModule} from 'primeng/tabview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessageModule } from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import {PaginatorModule} from 'primeng/paginator';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import {AvoirListAdminComponent} from "./avoir/list/avoir-list-admin.component";
import {Ripple} from "primeng/ripple";
import {AvoirCreateAdminComponent} from "./avoir/create/avoir-create-admin.component";
import {AvoirEditAdminComponent} from "./avoir/edit/avoir-edit-admin.component";
import {AvoirViewAdminComponent} from "./avoir/view/avoir-view-admin.component";
import {ReglementListAdminComponent} from "./reglement/list/reglement-list-admin.component";
import {ReglementCreateAdminComponent} from "./reglement/create/reglement-create-admin.component";
import {ReglementEditAdminComponent} from "./reglement/edit/reglement-edit-admin.component";
import {ReglementViewAdminComponent} from "./reglement/view/reglement-view-admin.component";
import {CreateForInstantaneeComponent} from "./reglement/create-for-instantanee/create-for-instantanee.component";


@NgModule({
    declarations: [

        StatutLocalCreateAdminComponent,
        StatutLocalListAdminComponent,
        StatutLocalViewAdminComponent,
        StatutLocalEditAdminComponent,
        LocataireCreateAdminComponent,
        LocataireListAdminComponent,
        LocataireViewAdminComponent,
        LocataireEditAdminComponent,
        TypeLocataireCreateAdminComponent,
        TypeLocataireListAdminComponent,
        TypeLocataireViewAdminComponent,
        TypeLocataireEditAdminComponent,
        LocationCreateAdminComponent,
        LocationListAdminComponent,
        LocationViewAdminComponent,
        LocationEditAdminComponent,
        ModePaiementCreateAdminComponent,
        ModePaiementListAdminComponent,
        ModePaiementViewAdminComponent,
        ModePaiementEditAdminComponent,
        TransactionCreateAdminComponent,
        TransactionListAdminComponent,
        TransactionViewAdminComponent,
        TransactionEditAdminComponent,
        TypePaiementCreateAdminComponent,
        TypePaiementListAdminComponent,
        TypePaiementViewAdminComponent,
        TypePaiementEditAdminComponent,
        AvoirListAdminComponent,
        AvoirCreateAdminComponent,
        AvoirEditAdminComponent,
        AvoirViewAdminComponent,
        ReglementCreateAdminComponent,
        ReglementEditAdminComponent,
        ReglementViewAdminComponent,
        ReglementListAdminComponent,
        CreateForInstantaneeComponent
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
        Ripple


    ],
  exports: [
  StatutLocalCreateAdminComponent,
  StatutLocalListAdminComponent,
  StatutLocalViewAdminComponent,
  StatutLocalEditAdminComponent,
  LocataireCreateAdminComponent,
  LocataireListAdminComponent,
  LocataireViewAdminComponent,
  LocataireEditAdminComponent,
  TypeLocataireCreateAdminComponent,
  TypeLocataireListAdminComponent,
  TypeLocataireViewAdminComponent,
  TypeLocataireEditAdminComponent,
  LocationCreateAdminComponent,
  LocationListAdminComponent,
  LocationViewAdminComponent,
  LocationEditAdminComponent,
  ModePaiementCreateAdminComponent,
  ModePaiementListAdminComponent,
  ModePaiementViewAdminComponent,
  ModePaiementEditAdminComponent,
  TransactionCreateAdminComponent,
  TransactionListAdminComponent,
  TransactionViewAdminComponent,
  TransactionEditAdminComponent,
  TypePaiementCreateAdminComponent,
  TypePaiementListAdminComponent,
  TypePaiementViewAdminComponent,
  TypePaiementEditAdminComponent,
  ],
})
export class LocataireAdminModule { }
