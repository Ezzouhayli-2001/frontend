import {Component, OnInit} from '@angular/core';


import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';


import {LocalAdminService} from 'src/app/shared/service/admin/locaux/LocalAdmin.service';
import {LocalDto} from 'src/app/shared/model/locaux/Local.model';
import {LocalCriteria} from 'src/app/shared/criteria/locaux/LocalCriteria.model';

import {StatutLocalDto} from 'src/app/shared/model/locataire/StatutLocal.model';
import {StatutLocalAdminService} from 'src/app/shared/service/admin/locataire/StatutLocalAdmin.service';
import {TypeLocataireDto} from 'src/app/shared/model/locataire/TypeLocataire.model';
import {TypeLocataireAdminService} from 'src/app/shared/service/admin/locataire/TypeLocataireAdmin.service';
import {LocataireDto} from 'src/app/shared/model/locataire/Locataire.model';
import {LocataireAdminService} from 'src/app/shared/service/admin/locataire/LocataireAdmin.service';
import {LocationDto} from "../../../../../../shared/model/locataire/Location.model";
import {TransactionCriteria} from "../../../../../../shared/criteria/locataire/TransactionCriteria.model";
import {TypeTransactiontDto} from "../../../../../../shared/model/locataire/TypeTransactiont.model";
import {ModePaiementDto} from "../../../../../../shared/model/locataire/ModePaiement.model";
import {CompteAdminService} from "../../../../../../shared/service/admin/finance/CompteAdmin.service";
import {TransactionAdminService} from "../../../../../../shared/service/admin/locataire/TransactionAdmin.service";
import {
    TypeTransactiontAdminService
} from "../../../../../../shared/service/admin/locataire/TypeTransactiontAdmin.service";
import {ModePaiementAdminService} from "../../../../../../shared/service/admin/locataire/ModePaiementAdmin.service";
import {ExportService} from "../../../../../../zynerator/util/Export.service";

@Component({
  selector: 'app-local-view-admin',
  standalone: false,
  templateUrl: './local-view-admin.component.html',
    styleUrls: ['./local-view-admin.component.scss']
})
export class LocalViewAdminComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;

    locationHistory: LocationDto[] = []
    // Transaction related variables
    protected localFindByCriteriaShow = false;
    protected localExcelPdfButons: MenuItem[];
    protected localExportData: any[] = [];
    protected localCriteriaData: any[] = [];
    protected localHistoriqueExportData: any[] = [];
    protected _transactionFileName = `Historique de Local ${this.item.label}`;
    protected typeTransactions: Array<TypeTransactiontDto>;
    protected modePaiements: Array<ModePaiementDto>;

    constructor(
        private transactionService: TransactionAdminService,
        private typeTransactionService: TypeTransactiontAdminService,
        private modePaiementService: ModePaiementAdminService,
        private exportService: ExportService,
        private service: LocalAdminService,
        private statutLocalService: StatutLocalAdminService,
        private typeLocataireService: TypeLocataireAdminService,
        private locataireService: LocataireAdminService){
		this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
	}

    ngOnInit(): void {
        this.initTransactionExport();
        this.loadReferenceDataForTransaction();
    }
    // Transaction related methods
    public loadReferenceDataForTransaction() {
        this.typeTransactionService.findAll().subscribe(data => this.typeTransactions = data);
        this.modePaiementService.findAll().subscribe(data => this.modePaiements = data);
    }

    public showTransactionSearch(): void {
        this.localFindByCriteriaShow = !this.localFindByCriteriaShow;
    }


    public initTransactionExport(): void {
        this.localExcelPdfButons = [
            {
                label: 'CSV', icon: 'pi pi-file', command: () => {
                    this.prepareLocalColumnExport();
                    this.exportService.exporterCSV(this.localCriteriaData, this.localExportData, this._transactionFileName);
                }
            },
            {
                label: 'XLS', icon: 'pi pi-file-excel', command: () => {
                    this.prepareLocalColumnExport();
                    this.exportService.exporterExcel(this.localCriteriaData, this.localExportData, this._transactionFileName);
                }
            },
            {
                label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
                    this.prepareLocalColumnExport();
                    this.exportService.exporterPdf(this.localCriteriaData, this.localExportData, this._transactionFileName);
                }
            }
        ];
    }

    public prepareLocalColumnExport(): void {

        this.locaux.forEach(local => {
            // Si le local possède des locations, les exporter
            if (local.locations && local.locations.length > 0) {
                // Ajouter une ligne d'en-tête pour distinguer les locaux
                this.localExportData.push({
                    'Locataire': `*** HISTORIQUE DES LOCATIONS DU LOCAL: ${local.label || ''} ***`,
                    'Type de Locataire': '',
                    'Local': '',
                    'Date de début': '',
                    'Date de fin': '',
                    'Loyer': '',
                    'Caution': ''
                });

                // Ajouter chaque location du local
                local.locations.forEach(location => {
                    this.localExportData.push({
                        'Locataire': `${location.locataire?.nom || ''} ${location.locataire?.prenom || ''}`.trim(),
                        'Type de Locataire': location.locataire?.typeLocataire?.label || '',
                        'Local': local.label || '',
                        'Date de début': this.datePipe.transform(location.dateDebut, 'dd/MM/yyyy') || '',
                        'Date de fin': this.datePipe.transform(location.dateFin, 'dd/MM/yyyy') || '',
                        'Loyer': location.loyer || '',
                        'Caution': location.caution || ''
                    });
                });

                // Ajouter une ligne vide pour séparer les locaux
                this.localExportData.push({
                    'Locataire': '',
                    'Type de Locataire': '',
                    'Local': '',
                    'Date de début': '',
                    'Date de fin': '',
                    'Loyer': '',
                    'Caution': ''
                });
            }
        });

        // Critères de recherche utilisés (si applicable)
        this.localCriteriaData = [{
            'Label': this.criteria?.label || environment.emptyForExport,
            'Adresse': this.criteria?.adresse || environment.emptyForExport,
            'Statut': this.criteria?.statutLocal?.label || environment.emptyForExport,
        }];
    }


    get typeLocataire(): TypeLocataireDto {
        return this.typeLocataireService.item;
    }
    set typeLocataire(value: TypeLocataireDto) {
        this.typeLocataireService.item = value;
    }
    get typeLocataires(): Array<TypeLocataireDto> {
        return this.typeLocataireService.items;
    }
    set typeLocataires(value: Array<TypeLocataireDto>) {
        this.typeLocataireService.items = value;
    }
    get locataire(): LocataireDto {
        return this.locataireService.item;
    }
    set locataire(value: LocataireDto) {
        this.locataireService.item = value;
    }
    get locataires(): Array<LocataireDto> {
        return this.locataireService.items;
    }
    set locataires(value: Array<LocataireDto>) {
        this.locataireService.items = value;
    }
    get statutLocal(): StatutLocalDto {
        return this.statutLocalService.item;
    }
    set statutLocal(value: StatutLocalDto) {
        this.statutLocalService.item = value;
    }
    get statutLocals(): Array<StatutLocalDto> {
        return this.statutLocalService.items;
    }
    set statutLocals(value: Array<StatutLocalDto>) {
        this.statutLocalService.items = value;
    }

    public hideViewDialog() {
        this.item = new LocalDto();
        this.viewDialog = false;
    }

    get items(): Array<LocalDto> {
        return this.service.items;
    }

    set items(value: Array<LocalDto>) {
        this.service.items = value;
    }

    get item(): LocalDto {
        return this.service.item;
    }

    set item(value: LocalDto) {
        this.service.item = value;
    }

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): LocalCriteria {
        return this.service.criteria;
    }

    set criteria(value: LocalCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }

    get locaux(): Array<LocalDto> {
        return new Array<LocalDto>(this.service.item);
    }

    set locaux(value: Array<LocalDto>) {
        this.service.items = value;
    }

    get locations(): Array<LocationDto> {
        return this.locaux.map(local => local.locations).reduce((acc, val) => acc.concat(val), []);
    }




}
