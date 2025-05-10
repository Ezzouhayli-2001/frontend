import {Component, OnInit} from '@angular/core';


import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';


import {LocataireAdminService} from 'src/app/shared/service/admin/locataire/LocataireAdmin.service';
import {LocataireDto} from 'src/app/shared/model/locataire/Locataire.model';
import {LocataireCriteria} from 'src/app/shared/criteria/locataire/LocataireCriteria.model';

import {TypeLocataireDto} from 'src/app/shared/model/locataire/TypeLocataire.model';
import {TypeLocataireAdminService} from 'src/app/shared/service/admin/locataire/TypeLocataireAdmin.service';
import {TypeTransactiontDto} from "../../../../../../shared/model/locataire/TypeTransactiont.model";
import {ModePaiementDto} from "../../../../../../shared/model/locataire/ModePaiement.model";
import {
    TypeTransactiontAdminService
} from "../../../../../../shared/service/admin/locataire/TypeTransactiontAdmin.service";
import {ModePaiementAdminService} from "../../../../../../shared/service/admin/locataire/ModePaiementAdmin.service";
import {ExportService} from "../../../../../../zynerator/util/Export.service";
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {StatutLocalAdminService} from "../../../../../../shared/service/admin/locataire/StatutLocalAdmin.service";

@Component({
  selector: 'app-locataire-view-admin',
  standalone: false,
  templateUrl: './locataire-view-admin.component.html',
    styleUrls: ['./locataire-view-admin.component.scss']
})
export class LocataireViewAdminComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;

    protected localFindByCriteriaShow = false;
    protected localExcelPdfButons: MenuItem[];
    protected localExportData: any[] = [];
    protected localCriteriaData: any[] = [];
    protected _transactionFileName = `Historique de Locataire ${this.item.nom} ${this.item.prenom}`;
    protected typeTransactions: Array<TypeTransactiontDto>;
    protected modePaiements: Array<ModePaiementDto>;

    constructor(
        private typeTransactionService: TypeTransactiontAdminService,
        private modePaiementService: ModePaiementAdminService,
        private exportService: ExportService,
        private service: LocataireAdminService, private typeLocataireService: TypeLocataireAdminService){
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

        this.item.locations.forEach(local => {
            // Ajouter une ligne d'en-tête pour distinguer les locaux
            this.localExportData.push({
                'Locataire': `*** HISTORIQUE DES LOCATIONS DU LOCAL: ${local.locataire?.nom || ''} ${local.locataire?.prenom || ''} ***`,
                'Type de Locataire': '',
                'Local': '',
                'Date de début': '',
                'Date de fin': '',
                'Loyer': '',
                'Caution': ''
            });
            // Ajouter chaque location du local
            this.localExportData.push({
                'Locataire': `${this.item?.nom || ''} ${this.item?.prenom || ''}`.trim(),
                'Type de Locataire': this.item?.typeLocataire?.label || '',
                'Local': local.local?.label || '',
                'Date de début': this.datePipe.transform(local.dateDebut, 'dd/MM/yyyy') || '',
                'Date de fin': this.datePipe.transform(local.dateFin, 'dd/MM/yyyy') || '',
                'Loyer': local?.loyer || '',
                'Caution': local?.caution || ''
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
            // Critères de recherche utilisés (si applicable)
            this.localCriteriaData = [{
                           }];
        });


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

    public hideViewDialog() {
        this.item = new LocataireDto();
        this.viewDialog = false;
    }

    get items(): Array<LocataireDto> {
        return this.service.items;
    }

    set items(value: Array<LocataireDto>) {
        this.service.items = value;
    }

    get item(): LocataireDto {
        return this.service.item;
    }

    set item(value: LocataireDto) {
        this.service.item = value;
    }

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): LocataireCriteria {
        return this.service.criteria;
    }

    set criteria(value: LocataireCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }


}
