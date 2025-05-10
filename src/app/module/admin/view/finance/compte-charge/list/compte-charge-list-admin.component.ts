import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {CompteChargeAdminService} from 'src/app/shared/service/admin/finance/CompteChargeAdmin.service';
import {CompteChargeDto} from 'src/app/shared/model/finance/CompteCharge.model';
import {CompteChargeCriteria} from 'src/app/shared/criteria/finance/CompteChargeCriteria.model';


import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';

import {AuthService} from 'src/app/zynerator/security/shared/service/Auth.service';
import {ExportService} from 'src/app/zynerator/util/Export.service';
import {TypeChargeAdminService} from 'src/app/shared/service/admin/finance/TypeChargeAdmin.service';
import {ChargeAdminService} from 'src/app/shared/service/admin/finance/ChargeAdmin.service';
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {
    TypeTransactiontAdminService
} from "../../../../../../shared/service/admin/locataire/TypeTransactiontAdmin.service";
import {TransactionAdminService} from "../../../../../../shared/service/admin/locataire/TransactionAdmin.service";
import {ModePaiementAdminService} from "../../../../../../shared/service/admin/finance/ModePaiementAdmin.service";
import { ChargeDto } from 'src/app/shared/model/finance/Charge.model';


@Component({
  selector: 'app-compte-charge-list-admin',
  standalone: false,
  templateUrl: './compte-charge-list-admin.component.html',
})
export class CompteChargeListAdminComponent implements OnInit {



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
    chargesGroupedByLocal: any = {};
    filteredItems = new Array<CompteChargeDto>();
    chargesFilteredByLocal = new Array<ChargeDto>();
    protected totalCredits = 0;
    protected totalDebits = 0;
    viewSousComptes: boolean = false;
    protected fileName = this.viewSousComptes? `Sous-Comptes-Charge-${this.item.local.label}` : 'Compte-Charge';
    constructor( private service: CompteChargeAdminService ,
                 private chargeService: ChargeAdminService,
                 private localService: LocalAdminService,
                 private typeChargeService: TypeChargeAdminService,
                 private modePaiementService: ModePaiementAdminService,
                 private transactionService: TransactionAdminService,
                 private typeTransactionService: TypeTransactiontAdminService,){
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
        this.service.findPaginatedByCriteria(this.criteria).subscribe(data =>
        {
            var items1 = data.list.filter(e => e.code !== "CHARGE");

            for (const charge of items1) {
                const localId = charge.local?.id;
                if (!localId) continue;

                if (!this.chargesGroupedByLocal[localId]) {
                    this.chargesGroupedByLocal[localId] = {
                        ...charge,
                        solde: charge.solde || 0,
                        nom: `compte charge ${charge.local?.label}`,
                    };
                } else {
                    this.chargesGroupedByLocal[localId].solde += charge.solde || 0;
                }
                this.items = Object.values(this.chargesGroupedByLocal);
            }
            this.totalRecords = this.items.length;
            this.selections = new Array<CompteChargeDto>();
        })

       /* this.chargeService.findPaginatedByCriteria(this.chargeService.criteria).subscribe(paginatedItems => {
            for (const charge of paginatedItems.list) {
                const localId = charge.local?.id;
                if (!localId) continue;

                if (!this.chargesGroupedByLocal[localId]) {
                    this.chargesGroupedByLocal[localId] = {
                        ...charge,
                        solde: charge.montant || 0,
                    };
                } else {
                    this.chargesGroupedByLocal[localId].solde += charge.montant || 0;
                }
                this.charges = Object.values(this.chargesGroupedByLocal);
            }

        }, error => console.log(error));
    */}

    public onPage(event: any) {
        this.criteria.page = event.page;
        this.criteria.maxResults = event.rows;
        this.findPaginatedByCriteria();
    }

   /* public async edit(dto: CompteChargeDto) {
        this.service.findByIdWithAssociatedList(dto).subscribe(res => {
            this.item = res;
            console.log(res);
            this.editDialog = true;
        });

    }*/

    public async view(dto: CompteChargeDto) {
        this.service.findPaginatedByCriteria(this.service.criteria).subscribe(data =>
        {
            this.filteredItems = data.list.filter(e => e.code !== "CHARGE"&&e.local.id===dto.local.id);
            this.totalRecords = this.filteredItems.length;
            this.selections = new Array<CompteChargeDto>();
            this.viewSousComptes = true;
        });
 }

    /*public async openCreate() {
        this.item = new CompteChargeDto();
        this.createDialog = true;
    }*/

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
                    this.selections = new Array<CompteChargeDto>();
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


    public async delete(dto: CompteChargeDto) {

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
                this.service.delete(dto).subscribe(status => {
                    if (status > 0) {
                        const position = this.items.indexOf(dto);
                        position > -1 ? this.items.splice(position, 1) : false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Element Supprimé',
                            life: 3000
                        });
                    }

                }, error => console.log(error));
            }
        });

    }

    public async duplicate(dto: CompteChargeDto) {
        this.service.findByIdWithAssociatedList(dto).subscribe(
            res => {
                this.initDuplicate(res);
              /*  this.item = res;*/
                this.item.id = null;
                this.createDialog = true;
            });
    }

    // TODO : check if correct
    public initExport(): void {

        this.excelPdfButons = [
            {
                label: 'CSV', icon: 'pi pi-file', command: () => {
                    this.viewSousComptes? this.prepareColumnExportDetails() : this.prepareColumnExport();
                    this.exportService.exporterCSV(this.criteriaData, this.exportData, this.fileName);
                }
            },
            {
                label: 'XLS', icon: 'pi pi-file-excel', command: () => {
                    this.viewSousComptes? this.prepareColumnExportDetails() : this.prepareColumnExport();
                    this.exportService.exporterExcel(this.criteriaData, this.exportData, this.fileName);
                }
            },
            {
                label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
                    this.viewSousComptes? this.prepareColumnExportDetails() : this.prepareColumnExport();
                    this.exportService.exporterPdf(this.criteriaData, this.exportData, this.fileName);
                }
            }
        ];

    }

    public exportPdf(dto: CompteChargeDto): void {
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
           /* this.item = new CompteChargeDto();*/
        } , error => {
            console.log(error);
        });
    }

    public save() {
        this.service.save().subscribe(item => {
            if (item != null) {
                this.findPaginatedByCriteria();
                this.createDialog = false;


              /*  this.item = new CompteChargeDto();*/
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
            {field: 'nom', header: 'Nom'},
            {field: 'local', header: 'Local'},
            {field: 'solde', header: 'Solde'},
        ];
    }




	public initDuplicate(res: CompteChargeDto) {
        if (res.charges != null) {
             res.charges.forEach(d => { d.compteCharge = null; d.id = null; });
        }
	}


    public prepareColumnExportDetails(): void {
        this.fileName = this.viewSousComptes? `Sous-Comptes-Charge-${this.filteredItems[0].local?.label}` : 'Compte-Charge';
        this.exportData = this.filteredItems.map(e => {
            return {
                'Nom': e.nom ,
                'Local': e.local?.label ,
                'Solde': e.solde ,
            }
        });

        this.criteriaData = [{
            'Nom': this.criteria.nom ? this.criteria.nom : environment.emptyForExport ,
            'Solde Min': this.criteria.soldeMin ? this.criteria.soldeMin : environment.emptyForExport ,
            'Solde Max': this.criteria.soldeMax ? this.criteria.soldeMax : environment.emptyForExport ,
        }];
    }

    public prepareColumnExport(): void {
        this.exportData = this.items.map(e => {
            return {
                'Nom': e.nom ,
                'Local': e.local?.label ,
                'Solde': e.solde ,
            }
        });

        this.criteriaData = [{
            'Nom': this.criteria.nom ? this.criteria.nom : environment.emptyForExport ,
            'Solde Min': this.criteria.soldeMin ? this.criteria.soldeMin : environment.emptyForExport ,
            'Solde Max': this.criteria.soldeMax ? this.criteria.soldeMax : environment.emptyForExport ,
        }];
    }


    get items(): Array<CompteChargeDto> {
        return this.service.items;
    }

    set items(value: Array<CompteChargeDto>) {
        this.service.items = value;
    }

    get charges(): Array<ChargeDto> {
        return this.chargeService.items;
    }

    set charges(value: Array<ChargeDto>) {
        this.chargeService.items = value;
    }


    get selections(): Array<CompteChargeDto> {
        return this.service.selections;
    }

    set selections(value: Array<CompteChargeDto>) {
        this.service.selections = value;
    }

    get item(): ChargeDto {
        return this.chargeService.item;
    }

    set item(value: ChargeDto) {
        this.chargeService.item = value;
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



    get criteria(): CompteChargeCriteria {
        return this.service.criteria;
    }

    set criteria(value: CompteChargeCriteria) {
        this.service.criteria = value;
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

    get compteCharge(): CompteChargeDto {
        return this.service.item;
    }
    set compteCharge(value: CompteChargeDto) {
        this.service.item = value;
    }

    viewCharges(dto: CompteChargeDto) {
        this.charges = dto.charges;
        this.compteCharge = dto;
        this.viewDialog = true;
    }

    edit(element: CompteChargeDto) {
        this.service.item = element;
        this.editDialog = true;
    }

    hideViewDialog() {
        this.viewSousComptes = false;
        this.viewDialog = false;
        this.compteCharge = new CompteChargeDto();
    }
}
