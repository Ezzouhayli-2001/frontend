import {Component, Input, OnInit} from '@angular/core';


import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';


import {TypeChargeDto} from 'src/app/shared/model/finance/TypeCharge.model';
import {TypeChargeAdminService} from 'src/app/shared/service/admin/finance/TypeChargeAdmin.service';
import {ChargeDto} from 'src/app/shared/model/finance/Charge.model';
import {ChargeAdminService} from 'src/app/shared/service/admin/finance/ChargeAdmin.service';
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {LocalDto} from "../../../../../../shared/model/locaux/Local.model";
import {CompteChargeAdminService} from "../../../../../../shared/service/admin/finance/CompteChargeAdmin.service";
import {CompteChargeDto} from "../../../../../../shared/model/finance/CompteCharge.model";
import {CompteChargeCriteria} from "../../../../../../shared/criteria/finance/CompteChargeCriteria.model";
import {TransactionAdminService} from "../../../../../../shared/service/admin/locataire/TransactionAdmin.service";
import {
    TypeTransactiontAdminService
} from "../../../../../../shared/service/admin/locataire/TypeTransactiontAdmin.service";
import {ModePaiementAdminService} from "../../../../../../shared/service/admin/locataire/ModePaiementAdmin.service";
import {ExportService} from "../../../../../../zynerator/util/Export.service";
import {ModePaiementDto} from "../../../../../../shared/model/finance/ModePaiement.model";
import {TypeTransactiontDto} from "../../../../../../shared/model/locataire/TypeTransactiont.model";
import {TransactionDto} from "../../../../../../shared/model/locataire/Transaction.model";
import {TransactionCriteria} from "../../../../../../shared/criteria/locataire/TransactionCriteria.model";

@Component({
  selector: 'app-compte-charge-view-admin',
  standalone: false,
  templateUrl: './compte-charge-view-admin.component.html'
})
export class CompteChargeViewAdminComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    protected cols: any[] = [];
    // Transaction related variables
    protected transactionFindByCriteriaShow = false;
    protected transactionExcelPdfButons: MenuItem[];
    protected transactionExportData: any[] = [];
    protected transactionCriteriaData: any[] = [];
    protected _transactionFileName = `Charges-${this.compteCharge?.nom}`;
    protected typeTransactions: Array<TypeTransactiontDto>;
    protected modePaiements: Array<ModePaiementDto>;
    @Input() totalCredits = 0;
    @Input() totalDebits = 0;

    @Input() chargesFilteredByLocal = new Array<ChargeDto>();
    @Input() totalCharges = this.chargesFilteredByLocal.reduce((sum, charge) => sum + (charge.montant ), 0);

    constructor(private service: CompteChargeAdminService,
                private transactionService: TransactionAdminService,
                private typeTransactionService: TypeTransactiontAdminService,
                private modePaiementService: ModePaiementAdminService,
                private exportService: ExportService, private localService: LocalAdminService, private typeChargeService: TypeChargeAdminService, private chargeService: ChargeAdminService){
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
        this.initCol();
    }

    public initCol() {
        this.cols = [
            {field: 'code', header: 'Code'},
            {field: 'label', header: 'Label'},
            {field: 'montant', header: 'Montant'},
            {field: 'date', header: 'Date'},
            {field: 'typeCharge?.label', header: 'Type charge'},
            {field: 'local?.code', header: 'Local'},
            {field: 'isPaid', header: 'Is paid'},
            {field: 'description', header: 'Description'},
        ];
    }

    // Transaction related methods
    public loadReferenceDataForTransaction() {
        this.typeTransactionService.findAll().subscribe(data => this.typeTransactions = data);
        this.modePaiementService.findAll().subscribe(data => this.modePaiements = data);
    }

    public showTransactionSearch(): void {
        this.transactionFindByCriteriaShow = !this.transactionFindByCriteriaShow;
    }

    public resettransactionService(): void {
        this.transactionService.criteria = new TransactionCriteria();
        this.findPaginatedTransactions();
    }

    public findPaginatedTransactions() {
        this.transactionService.findPaginatedByCriteria(this.transactionService.criteria).subscribe(paginatedItems => {
            this.transactions = paginatedItems.list.filter(
                transaction => transaction?.compteDestination?.code == 'CHARGE'
            );
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

        this.transactionExportData = this.chargesFilteredByLocal.map(e => {
            return {
                'Date': this.datePipe.transform(e.date, this.dateFormatColumn) || '',
                'Montant': e.montant,
                'Description': e.description || '',
                'Type de Charge': e.typeCharge?.label || '',
                'Local': e.local?.label || '',
                'Mode paiement': e.modePaiement?.label || '',
                'Compte source': (e.compteSource?.code || '') ,
                'Compte destination':  (this.compteCharge?.nom || '')
            };
        });

        this.transactionCriteriaData.push({
            'Date': 'TOTAL',
            'Montant': this.totalCharges,
            'Description':  '',
            'Type de Charge': '',
            'Local': '',
            'Mode paiement': '',
            'Compte source': '' ,
            'Compte destination':  ''
        });

        this.transactionCriteriaData = [{
            'Date Min': this.transactionService.criteria.dateFrom ? this.datePipe.transform(this.transactionService.criteria.dateFrom, this.dateFormatColumn) : environment.emptyForExport,
            'Date Max': this.transactionService.criteria.dateTo ? this.datePipe.transform(this.transactionService.criteria.dateTo, this.dateFormatColumn) : environment.emptyForExport,
            'Montant Min': this.transactionService.criteria.montantMin || environment.emptyForExport,
            'Montant Max': this.transactionService.criteria.montantMax || environment.emptyForExport,
            'Description': this.transactionService.criteria.description || environment.emptyForExport,
            'Type transaction': this.transactionService.criteria.typeTransaction?.label || environment.emptyForExport,
            'Mode paiement': this.transactionService.criteria.modePaiement?.label || environment.emptyForExport
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

    get local(): LocalDto {
        return this.localService.item;
    }
    set local(value: LocalDto) {
        this.localService.item = value;
    }

    get transactions(): Array<TransactionDto> {
        return this.transactionService.items;
    }

    set transactions(value: Array<TransactionDto>) {
        this.transactionService.items = value;
    }

    get locals(): Array<LocalDto> {
        return this.localService.items;
    }
    set locals(value: Array<LocalDto>) {
        this.localService.items = value;
    }
    get typeCharge(): TypeChargeDto {
        return this.typeChargeService.item;
    }
    set typeCharge(value: TypeChargeDto) {
        this.typeChargeService.item = value;
    }
    get typeCharges(): Array<TypeChargeDto> {
        return this.typeChargeService.items;
    }
    set typeCharges(value: Array<TypeChargeDto>) {
        this.typeChargeService.items = value;
    }

    public hideViewDialog() {
        this.viewDialog = false;
    }

    get items(): Array<CompteChargeDto> {
        return this.service.items;
    }

    set items(value: Array<CompteChargeDto>) {
        this.service.items = value;
    }

    get item(): CompteChargeDto {
        return this.service.item;
    }

    set item(value: CompteChargeDto) {
        this.service.item = value;
    }

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): CompteChargeCriteria {
        return this.service.criteria;
    }

    set criteria(value: CompteChargeCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }
    get charges(): Array<ChargeDto> {
        return this.chargeService.items;
    }

    get compteCharge(): CompteChargeDto {
        return this.service.item;
    }
    set compteCharge(value: CompteChargeDto) {
        this.service.item = value;
    }


    set charges(value: Array<ChargeDto>) {
        this.chargeService.items = value;
    }


}
