import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {CaisseAdminService} from 'src/app/shared/service/admin/finance/CaisseAdmin.service';
import {CaisseDto} from 'src/app/shared/model/finance/Caisse.model';
import {CaisseCriteria} from 'src/app/shared/criteria/finance/CaisseCriteria.model';


import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';

import {AuthService} from 'src/app/zynerator/security/shared/service/Auth.service';
import {ExportService} from 'src/app/zynerator/util/Export.service';
import {CompteAdminService} from "../../../../../../shared/service/admin/finance/CompteAdmin.service";
import {CompteDto} from "../../../../../../shared/model/finance/Compte.model";
import {TransactionAdminService} from "../../../../../../shared/service/admin/locataire/TransactionAdmin.service";
import {CompteCriteria} from "../../../../../../shared/criteria/finance/CompteCriteria.model";


@Component({
  selector: 'app-caisse-list-admin',
  standalone: false,
  templateUrl: './caisse-list-admin.component.html'
})
export class CaisseListAdminComponent implements OnInit {

    protected fileName = `List de Caisses ${new Date().toLocaleDateString()}`;

    protected findByCriteriaShow = false;
    protected cols: any[] = [];
    protected excelPdfButons: MenuItem[];
    protected exportData: any[] = [];
    protected criteriaData: any[] = [];
    protected _totalRecords = 0;
    private _pdfName: string;


    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    protected authService: AuthService;
    protected exportService: ExportService;
    protected excelFile: File | undefined;
    protected enableSecurity = false;
    protected totalCredits = 0;
    protected totalDebits = 0;
    protected totalSoldes: number = 0;
    protected totalCredits_transactions: number = 0;
    protected totalDebits_transactions: number = 0;
    constructor(

        private service: CaisseAdminService,
        private transactionService: TransactionAdminService,
    private compteService: CompteAdminService, @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.authService = ServiceLocator.injector.get(AuthService);
        this.exportService = ServiceLocator.injector.get(ExportService);
    }

    ngOnInit(): void {
        this.findPaginatedByCriteria();
        this.initExport();
        this.initCol();

    }

    calculateTotals() {
        // Calcul des totaux à partir du tableau comptes
        this.totalSoldes = this.comptes.reduce((sum, compte) => sum + (compte.solde || 0), 0);
        this.totalDebits = this.comptes.reduce((sum, compte) => sum + (compte.debit || 0), 0);
        this.totalCredits = this.comptes.reduce((sum, compte) => sum + (compte.credit || 0), 0);
    }


    public onExcelFileSelected(event: any): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.excelFile = input.files[0];
        }
    }

    public importExcel(): void {
        if (this.excelFile) {
            this.service.importExcel(this.excelFile).subscribe(
                response => {
                    this.items = response;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'File uploaded successfully!',
                        life: 3000
                    });
                },
                error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'File uploaded with Error!',
                        life: 3000
                    });
                }
            );
        }
    }

    public findPaginatedByCriteria() {
        this.compteService.findAllByCaisseNotNull().subscribe((data) => {
            this.comptes = data;
            this.totalRecords = data.length;
            this.selections = new Array<CaisseDto>();
            this.calculateTotals();
        });
    }

    public findPaginatedByCriteria1() {
        this.compteService.findByCriteria(this.criteria).subscribe(paginatedItems => {
            this.comptes = paginatedItems.filter(compte => compte?.caisse != null);
            this.totalRecords = this.comptes.length;
            this.selections = new Array<CaisseDto>();
            this.calculateTotals();
            console.log(this.comptes);

        }, error => console.log(error));
    }


    public onPage(event: any) {
        this.criteria.page = event.page;
        this.criteria.maxResults = event.rows;
        this.findPaginatedByCriteria();
    }

    public async edit(dto: CompteDto) {
        this.service.findByIdWithAssociatedList(dto.caisse).subscribe(res => {
            this.item = res;
            console.log(res);
            this.editDialog = true;
        });

    }

    public async view(dto: CompteDto) {
        this.compteService.findByIdWithAssociatedList(dto).subscribe(res => {
            this.compte = res;
            this.viewDialog = true;
            this.transactionService.findPaginatedByCriteria(this.transactionService.criteria).subscribe((data) => {
                this.transactionService.items = data.list.filter(transaction => transaction?.compteSource?.id == res?.id || transaction?.compteDestination?.id == res?.id);
                this.totalCredits_transactions = 0;
                this.totalDebits_transactions = 0;

                if (this.transactionService.items && this.transactionService.items.length > 0) {
                    this.transactionService.items.forEach(transaction => {
                        if (transaction.typePaiement?.label === 'Credit') {
                            this.totalCredits_transactions += Number(transaction.montant || 0);
                        } else if (transaction.typePaiement?.label === 'Debit') {
                            this.totalDebits_transactions += Number(transaction.montant || 0);
                        }
                    });
                }});
        });
    }

    public async openCreate() {
        this.item = new CaisseDto();
        this.createDialog = true;
    }

    public async deleteMultiple() {
        this.confirmationService.confirm({
            message: 'Voulez-vous supprimer ces éléments ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
			rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Ok',
            },
            accept: () => {
                this.service.deleteMultiple().subscribe(() => {
                    for (let selection of this.selections) {
                        let index = this.items.findIndex(element => element.id === selection.id);
                        this.items.splice(index,1);
                    }
                    this.selections = new Array<CaisseDto>();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Les éléments sélectionnés ont été supprimés',
                        life: 3000
                    });

                }, error => console.log(error));
            }
        });
    }


    public isSelectionDisabled(): boolean {
        return this.selections == null || this.selections.length == 0;
    }


    public async delete(dto: CompteDto) {

        this.confirmationService.confirm({
            message: 'Voulez-vous supprimer cet élément ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
			rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Ok',
            },
            accept: () => {
                this.compteService.delete(dto).subscribe(status => {
                    if (status > 0) {
                       this.findPaginatedByCriteria();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Caisse Supprimé',
                            life: 3000
                        });
                    }

                }, error => console.log(error));
            }
        });

    }

    public async duplicate(dto: CaisseDto) {
        this.service.findByIdWithAssociatedList(dto).subscribe(
            res => {
                this.initDuplicate(res);
                this.item = res;
                this.item.id = null;
                this.createDialog = true;
            });
    }

    // TODO : check if correct
    public initExport(): void {
        this.excelPdfButons = [
            {
                label: 'CSV', icon: 'pi pi-file', command: () => {
                    this.prepareColumnExport();
                    this.exportService.exporterCSV(this.criteriaData, this.exportData, this.fileName);
                }
            },
            {
                label: 'XLS', icon: 'pi pi-file-excel', command: () => {
                    this.prepareColumnExport();
                    this.exportService.exporterExcel(this.criteriaData, this.exportData, this.fileName);
                }
            },
            {
                label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
                    this.prepareColumnExport();
                    this.exportService.exporterPdf(this.criteriaData, this.exportData, this.fileName);
                }
            }
        ];
    }

    public exportPdf(dto: CaisseDto): void {
        this.service.exportPdf(dto).subscribe((data: ArrayBuffer) => {
            const blob = new Blob([data], {type: 'application/pdf'});
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = this.pdfName;
            link.setAttribute('target', '_blank'); // open link in new tab
            link.click();
            window.URL.revokeObjectURL(url);
        }, (error) => {
            console.error(error); // handle any errors that occur
        });
    }

    public showSearch(): void {
        this.findByCriteriaShow = !this.findByCriteriaShow;
    }


    update() {
        this.service.edit().subscribe(data => {
            const myIndex = this.items.findIndex(e => e.id === this.item.id);
            this.items[myIndex] = data;
            this.editDialog = false;
            this.item = new CaisseDto();
        } , error => {
            console.log(error);
        });
    }

    public save() {
        this.service.save().subscribe(item => {
            if (item != null) {
                this.items.push({...item});
                this.createDialog = false;


                this.item = new CaisseDto();
            } else {
                this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Element existant'});
            }
        }, error => {
            console.log(error);
        });
    }

// add


    public initCol() {
        this.cols = [
            {field: 'code', header: 'Code'},
            {field: 'libelle', header: 'Libelle'},
            {field: 'solde', header: 'Solde'},
        ];
    }




	public initDuplicate(res: CaisseDto) {
	}


    public prepareColumnExport(): void {
        this.exportData = this.comptes.map(e => {
            return {
                'Nom De Compte': e.caisse?.libelle ,
                'Solde': e.solde ,
                'Debit': e.debit ,
                'Credit': e.credit ,
                'Date De Creation': this.datePipe.transform(e.dateCreation , 'dd/MM/yyyy hh:mm'),
            }
        });

        this.exportData.push({
            'Nom De Compte': 'TOTAL',
            'Solde': this.totalSoldes,
            'Debit': this.totalDebits,
            'Credit': this.totalCredits,
        });

        this.criteriaData = [{
            'Nom De Compte': this.criteria.banque?.nom ? this.criteria.banque?.nom : environment.emptyForExport ,
            'Debit Min': this.criteria.debitMin ? this.criteria.debitMin : environment.emptyForExport ,
            'Debit Max': this.criteria.debitMax ? this.criteria.debitMax : environment.emptyForExport ,
            'Credit Min': this.criteria.creditMin ? this.criteria.creditMin : environment.emptyForExport ,
            'Credit Max': this.criteria.creditMax ? this.criteria.creditMax : environment.emptyForExport ,
            'Solde Min': this.criteria.soldeMin ? this.criteria.soldeMin : environment.emptyForExport ,
            'Solde Max': this.criteria.soldeMax ? this.criteria.soldeMax : environment.emptyForExport ,
            'Date De Creation Min': this.criteria.dateCreationFrom ? this.datePipe.transform(this.criteria.dateCreationFrom , 'dd/MM/yyyy hh:mm') : environment.emptyForExport ,
            'Date De Creation Max': this.criteria.dateCreationTo ? this.datePipe.transform(this.criteria.dateCreationTo , 'dd/MM/yyyy hh:mm') : environment.emptyForExport ,
        }];
    }


    get items(): Array<CaisseDto> {
        return this.service.items;
    }

    set items(value: Array<CaisseDto>) {
        this.service.items = value;
    }

    get selections(): Array<CaisseDto> {
        return this.service.selections;
    }

    set selections(value: Array<CaisseDto>) {
        this.service.selections = value;
    }

    get item(): CaisseDto {
        return this.service.item;
    }

    set item(value: CaisseDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
    }

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): CompteCriteria {
        return this.compteService.criteria;
    }

    set criteria(value: CompteCriteria) {
        this.compteService.criteria = value;
    }

    get dateFormat() {
        return environment.dateFormatList;
    }


    get totalRecords(): number {
        return this._totalRecords;
    }

    set totalRecords(value: number) {
        this._totalRecords = value;
    }

    get pdfName(): string {
        return this._pdfName;
    }

    set pdfName(value: string) {
        this._pdfName = value;
    }

    get createActionIsValid(): boolean {
        return this.service.createActionIsValid;
    }

    set createActionIsValid(value: boolean) {
        this.service.createActionIsValid = value;
    }


    get editActionIsValid(): boolean {
        return this.service.editActionIsValid;
    }

    set editActionIsValid(value: boolean) {
        this.service.editActionIsValid = value;
    }

    get listActionIsValid(): boolean {
        return this.service.listActionIsValid;
    }

    set listActionIsValid(value: boolean) {
        this.service.listActionIsValid = value;
    }

    get deleteActionIsValid(): boolean {
        return this.service.deleteActionIsValid;
    }

    set deleteActionIsValid(value: boolean) {
        this.service.deleteActionIsValid = value;
    }


    get viewActionIsValid(): boolean {
        return this.service.viewActionIsValid;
    }

    set viewActionIsValid(value: boolean) {
        this.service.viewActionIsValid = value;
    }

    get duplicateActionIsValid(): boolean {
        return this.service.duplicateActionIsValid;
    }

    set duplicateActionIsValid(value: boolean) {
        this.service.duplicateActionIsValid = value;
    }

    get createAction(): string {
        return this.service.createAction;
    }

    set createAction(value: string) {
        this.service.createAction = value;
    }

    get listAction(): string {
        return this.service.listAction;
    }

    set listAction(value: string) {
        this.service.listAction = value;
    }

    get editAction(): string {
        return this.service.editAction;
    }

    set editAction(value: string) {
        this.service.editAction = value;
    }

    get deleteAction(): string {
        return this.service.deleteAction;
    }

    set deleteAction(value: string) {
        this.service.deleteAction = value;
    }

    get viewAction(): string {
        return this.service.viewAction;
    }

    set viewAction(value: string) {
        this.service.viewAction = value;
    }

    get duplicateAction(): string {
        return this.service.duplicateAction;
    }

    set duplicateAction(value: string) {
        this.service.duplicateAction = value;
    }

    get entityName(): string {
        return this.service.entityName;
    }

    set entityName(value: string) {
        this.service.entityName = value;
    }
    get comptes(): Array<CompteDto> {
        return this.compteService.items;
    }

    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
    }
    get compte(): CompteDto {
        return this.compteService.item;
    }

    set compte(value: CompteDto) {
        this.compteService.item = value;
    }

    resetCriteria() {
        this.criteria = new CompteCriteria();
        this.findPaginatedByCriteria();
    }
}
