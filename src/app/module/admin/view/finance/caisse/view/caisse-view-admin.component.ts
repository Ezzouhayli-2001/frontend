import {Component, Input, OnInit} from '@angular/core';


import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';


import {CaisseAdminService} from 'src/app/shared/service/admin/finance/CaisseAdmin.service';
import {CaisseDto} from 'src/app/shared/model/finance/Caisse.model';
import {CaisseCriteria} from 'src/app/shared/criteria/finance/CaisseCriteria.model';
import {CompteDto} from "../../../../../../shared/model/finance/Compte.model";
import {CompteAdminService} from "../../../../../../shared/service/admin/finance/CompteAdmin.service";
import {TransactionAdminService} from "../../../../../../shared/service/admin/locataire/TransactionAdmin.service";
import {TransactionDto} from "../../../../../../shared/model/locataire/Transaction.model";
import {TransactionCriteria} from "../../../../../../shared/criteria/locataire/TransactionCriteria.model";
import {
    TypeTransactiontAdminService
} from "../../../../../../shared/service/admin/locataire/TypeTransactiontAdmin.service";
import {ModePaiementAdminService} from "../../../../../../shared/service/admin/locataire/ModePaiementAdmin.service";
import {ExportService} from "../../../../../../zynerator/util/Export.service";
import {TypeTransactiontDto} from "../../../../../../shared/model/locataire/TypeTransactiont.model";
import {ModePaiementDto} from "../../../../../../shared/model/locataire/ModePaiement.model";

@Component({
  selector: 'app-caisse-view-admin',
  standalone: false,
  templateUrl: './caisse-view-admin.component.html',
    styleUrls: ['./caisse-view-admin.component.scss']
})
export class CaisseViewAdminComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    // Transaction related variables
    protected transactionFindByCriteriaShow = false;
    protected transactionExcelPdfButons: MenuItem[];
    protected transactionExportData: any[] = [];
    protected transactionCriteriaData: any[] = [];
    protected _transactionFileName = 'Transaction';
    protected typeTransactions: Array<TypeTransactiontDto>;
    protected modePaiements: Array<ModePaiementDto>;
    @Input() totalCredits = 0;
    @Input() totalDebits = 0;

    constructor(
        private compteService: CompteAdminService,
        private transactionService: TransactionAdminService,
        private typeTransactionService: TypeTransactiontAdminService,
        private modePaiementService: ModePaiementAdminService,
        private exportService: ExportService,
        private service: CaisseAdminService){
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
        this.transactionFindByCriteriaShow = !this.transactionFindByCriteriaShow;
    }

    public resetTransactionCriteria(): void {
        this.transactionCriteria = new TransactionCriteria();
        this.findPaginatedTransactions();
    }

    public findPaginatedTransactions() {
        this.transactionService.findPaginatedByCriteria(this.transactionCriteria).subscribe(paginatedItems => {
            if (this.compte) {
                this.transactions = paginatedItems.list.filter(
                    transaction => transaction?.compteSource?.id == this.compte?.id ||
                        transaction?.compteDestination?.id == this.compte?.id
                );
            } else {
                this.transactions = paginatedItems.list;
            }
            this.calculateTotals();
        }, error => console.log(error));
    }

    public initTransactionExport(): void {
        this.transactionExcelPdfButons = [
            {
                label: 'CSV', icon: 'pi pi-file', command: () => {
                    this.prepareTransactionColumnExport();
                    this.exportService.exporterCSV(this.transactionCriteriaData, this.transactionExportData, this._transactionFileName);
                }
            },
            {
                label: 'XLS', icon: 'pi pi-file-excel', command: () => {
                    this.prepareTransactionColumnExport();
                    this.exportService.exporterExcel(this.transactionCriteriaData, this.transactionExportData, this._transactionFileName);
                }
            },
            {
                label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
                    this.prepareTransactionColumnExport();
                    this.exportService.exporterPdf(this.transactionCriteriaData, this.transactionExportData, this._transactionFileName);
                }
            }
        ];
    }

    public prepareTransactionColumnExport(): void {
        this.transactionExportData = this.transactions.map(e => {
            // Création des valeurs Crédit et Débit
            let credit = 0 ;
            let debit = 0;

            if (e.typePaiement?.label === 'Credit') {
                credit = e.montant ;
            }

            if (e.typePaiement?.label === 'Debit') {
                debit = e.montant;
            }

            // Gestion du compte source selon le type de transaction
            let compteSource = '';
            if (e.typeTransaction?.label === 'charge' || e.typeTransaction?.label === 'avoir') {
                compteSource = e.compteSource?.code || '';
            } else if (e.typeTransaction?.label === 'reglement') {
                compteSource = `${e.compteLocataire?.locataire?.nom || ''} ${e.compteLocataire?.locataire?.prenom || ''}`.trim();
            }

            // Gestion du compte destination selon le type de transaction
            let compteDestination = '';
            if (e.typeTransaction?.label === 'charge' || e.typeTransaction?.label === 'reglement') {
                compteDestination = e.compteDestination?.code || '';
            } else if (e.typeTransaction?.label === 'avoir') {
                compteDestination = `${e.compteLocataire?.locataire?.nom || ''} ${e.compteLocataire?.locataire?.prenom || ''}`.trim();
            }

            return {
                'Date': this.datePipe.transform(e.date, this.dateFormatColumn) || '',
                'Crédit': credit,
                'Débit': debit,
                'Description': (e.description || '').slice(0, 50), // Limité à 50 caractères comme dans le tableau
                'Type transaction': e.typeTransaction?.label || '',
                'Mode paiement': e.modePaiement?.label || '',
                'Compte source': compteSource,
                'Compte destination': compteDestination
            };
        });

        // Ajout d'une ligne pour les totaux
        this.transactionExportData.push({
            'Date': 'TOTAL',
            'Crédit': this.totalCredits,
            'Débit': this.totalDebits,
            'Description': '',
            'Type transaction': '',
            'Mode paiement': '',
            'Compte source': '',
            'Compte destination': ''
        });

        // Ajout d'une ligne pour le solde
        const solde = this.totalCredits - this.totalDebits;
        this.transactionExportData.push({
            'Date': 'SOLDE',
            'Crédit': solde ,
            'Débit':  '',
            'Description': '',
            'Type transaction': '',
            'Mode paiement': '',
            'Compte source': '',
            'Compte destination': ''
        });



        this.transactionCriteriaData = [{
            'Date Min': this.transactionCriteria.dateFrom ? this.datePipe.transform(this.transactionCriteria.dateFrom, this.dateFormatColumn) : environment.emptyForExport,
            'Date Max': this.transactionCriteria.dateTo ? this.datePipe.transform(this.transactionCriteria.dateTo, this.dateFormatColumn) : environment.emptyForExport,
            'Montant Min': this.transactionCriteria.montantMin || environment.emptyForExport,
            'Montant Max': this.transactionCriteria.montantMax || environment.emptyForExport,
            'Description': this.transactionCriteria.description || environment.emptyForExport,
            'Type transaction': this.transactionCriteria.typeTransaction?.label || environment.emptyForExport,
            'Mode paiement': this.transactionCriteria.modePaiement?.label || environment.emptyForExport
        }];
    }

    private calculateTotals(): void {
        this.totalCredits = 0;
        this.totalDebits = 0;

        if (this.transactions && this.transactions.length > 0) {
            this.transactions.forEach(transaction => {
                if (transaction.typePaiement?.label === 'Credit') {
                    this.totalCredits += Number(transaction.montant || 0);
                    console.log(transaction.montant);
                } else if (transaction.typePaiement?.label === 'Debit') {
                    this.totalDebits += Number(transaction.montant || 0);
                }
            });
        }
    }

    get transactionCriteria(): TransactionCriteria {
        return this.transactionService.criteria;
    }

    set transactionCriteria(value: TransactionCriteria) {
        this.transactionService.criteria = value;
    }
    public hideViewDialog() {
        this.item = new CaisseDto();
        this.viewDialog = false;
    }
    get items(): Array<CaisseDto> {
        return this.service.items;
    }

    set items(value: Array<CaisseDto>) {
        this.service.items = value;
    }

    get item(): CaisseDto {
        return this.service.item;
    }

    set item(value: CaisseDto) {
        this.service.item = value;
    }

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): CaisseCriteria {
        return this.service.criteria;
    }

    set criteria(value: CaisseCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }

    get compte(): CompteDto {
        return this.compteService.item;
    }

    set compte(value: CompteDto) {
        this.compteService.item = value;
    }

    get transactions(): Array<TransactionDto> {
        return this.transactionService.items;
    }

    set transactions(value: Array<TransactionDto>) {
        this.transactionService.items = value;
    }
}
