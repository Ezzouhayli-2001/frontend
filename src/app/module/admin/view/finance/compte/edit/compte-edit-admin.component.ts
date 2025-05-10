import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FileTempDto} from 'src/app/zynerator/dto/FileTempDto.model';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';

import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {CompteAdminService} from 'src/app/shared/service/admin/finance/CompteAdmin.service';
import {CompteDto} from 'src/app/shared/model/finance/Compte.model';
import {CompteCriteria} from 'src/app/shared/criteria/finance/CompteCriteria.model';


import {TransactionDto} from 'src/app/shared/model/locataire/Transaction.model';
import {TransactionAdminService} from 'src/app/shared/service/admin/locataire/TransactionAdmin.service';
import {TypePaiementDto} from 'src/app/shared/model/finance/TypePaiement.model';
import {TypePaiementAdminService} from 'src/app/shared/service/admin/finance/TypePaiementAdmin.service';
import {BanqueDto} from 'src/app/shared/model/finance/Banque.model';
import {BanqueAdminService} from 'src/app/shared/service/admin/finance/BanqueAdmin.service';
import {ModePaiementDto} from 'src/app/shared/model/finance/ModePaiement.model';
import {ModePaiementAdminService} from 'src/app/shared/service/admin/finance/ModePaiementAdmin.service';
import {TypeTransactiontDto} from 'src/app/shared/model/locataire/TypeTransactiont.model';
import {TypeTransactiontAdminService} from 'src/app/shared/service/admin/locataire/TypeTransactiontAdmin.service';

@Component({
  selector: 'app-compte-edit-admin',
  standalone: false,
  templateUrl: './compte-edit-admin.component.html'
})
export class CompteEditAdminComponent implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();


    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;
    private _file: any;
    private _files: any;

    protected transactionsIndex = -1;

    private _transactionsElement = new TransactionDto();


    private _validBanqueCode = true;



    constructor(private service: CompteAdminService , private transactionService: TransactionAdminService, private typePaiementService: TypePaiementAdminService, private banqueService: BanqueAdminService, private modePaiementService: ModePaiementAdminService, private typeTransactiontService: TypeTransactiontAdminService, @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.transactionsElement.typeTransaction = new TypeTransactiontDto();
        this.typeTransactiontService.findAll().subscribe((data) => this.typeTransactions = data);
        this.transactionsElement.modePaiement = new ModePaiementDto();
        this.modePaiementService.findAll().subscribe((data) => this.modePaiements = data);
        this.transactionsElement.typePaiement = new TypePaiementDto();
        this.typePaiementService.findAll().subscribe((data) => this.typePaiements = data);

        this.banqueService.findAll().subscribe((data) => this.banques = data);
    }

    public prepareEdit() {
        this.item.dateCreation = this.service.format(this.item.dateCreation);
    }



 public edit(): void {
        this.submitted = true;
        this.prepareEdit();
        this.validateForm();
        if (this.errorMessages.length === 0) {
            this.editWithShowOption(false);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreurs',
                detail: 'Merci de corrigé les erreurs sur le formulaire'
            });
        }
    }

    public editWithShowOption(showList: boolean) {
        this.service.edit().subscribe(religion=>{
            const myIndex = this.items.findIndex(e => e.id === this.item.id);
            this.items[myIndex] = religion;
            this.editDialog = false;
            this.submitted = false;
            this.item = new CompteDto();
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.editDialog = false;
        this.setValidation(true);
    }





    public validateTransactions(){
        this.errorMessages = new Array();
    }

    public setValidation(value: boolean){
    }

    public addTransactions() {
        if( this.item.transactions == null )
            this.item.transactions = new Array<TransactionDto>();

       this.validateTransactions();

       if (this.errorMessages.length === 0) {
            if (this.transactionsIndex == -1){
                this.item.transactions.push({... this.transactionsElement});
            }else {
                this.item.transactions[this.transactionsIndex] =this.transactionsElement;
            }
              this.transactionsElement = new TransactionDto();
              this.transactionsIndex = -1;
       }else{
           this.messageService.add({severity: 'error',summary: 'Erreurs',detail: 'Merci de corrigé les erreurs suivant : ' + this.errorMessages});
       }
    }

    public deleteTransactions(p: TransactionDto, index: number) {
        this.item.transactions.splice(index, 1);
    }

    public editTransactions(p: TransactionDto, index: number) {
        this.transactionsElement = {... p};
        this.transactionsIndex = index;
        this.activeTab = 0;
    }

    public validateForm(): void{
        this.errorMessages = new Array<string>();
    }




   public async openCreateBanque(banque: string) {
        const isPermistted = await this.roleService.isPermitted('Banque', 'edit');
        if (isPermistted) {
             this.banque = new BanqueDto();
             this.createBanqueDialog = true;
        }else {
             this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }
   public async openCreateTypePaiement(typePaiement: string) {
        const isPermistted = await this.roleService.isPermitted('TypePaiement', 'edit');
        if (isPermistted) {
             this.typePaiement = new TypePaiementDto();
             this.createTypePaiementDialog = true;
        }else {
             this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }
   public async openCreateModePaiement(modePaiement: string) {
        const isPermistted = await this.roleService.isPermitted('ModePaiement', 'edit');
        if (isPermistted) {
             this.modePaiement = new ModePaiementDto();
             this.createModePaiementDialog = true;
        }else {
             this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }

    get typeTransaction(): TypeTransactiontDto {
        return this.typeTransactiontService.item;
    }
    set typeTransaction(value: TypeTransactiontDto) {
        this.typeTransactiontService.item = value;
    }
    get typeTransactions(): Array<TypeTransactiontDto> {
        return this.typeTransactiontService.items;
    }
    set typeTransactions(value: Array<TypeTransactiontDto>) {
        this.typeTransactiontService.items = value;
    }
    get createTypeTransactionDialog(): boolean {
        return this.typeTransactiontService.createDialog;
    }
    set createTypeTransactionDialog(value: boolean) {
        this.typeTransactiontService.createDialog= value;
    }
    get banque(): BanqueDto {
        return this.banqueService.item;
    }
    set banque(value: BanqueDto) {
        this.banqueService.item = value;
    }
    get banques(): Array<BanqueDto> {
        return this.banqueService.items;
    }
    set banques(value: Array<BanqueDto>) {
        this.banqueService.items = value;
    }
    get createBanqueDialog(): boolean {
        return this.banqueService.createDialog;
    }
    set createBanqueDialog(value: boolean) {
        this.banqueService.createDialog= value;
    }
    get typePaiement(): TypePaiementDto {
        return this.typePaiementService.item;
    }
    set typePaiement(value: TypePaiementDto) {
        this.typePaiementService.item = value;
    }
    get typePaiements(): Array<TypePaiementDto> {
        return this.typePaiementService.items;
    }
    set typePaiements(value: Array<TypePaiementDto>) {
        this.typePaiementService.items = value;
    }
    get createTypePaiementDialog(): boolean {
        return this.typePaiementService.createDialog;
    }
    set createTypePaiementDialog(value: boolean) {
        this.typePaiementService.createDialog= value;
    }
    get modePaiement(): ModePaiementDto {
        return this.modePaiementService.item;
    }
    set modePaiement(value: ModePaiementDto) {
        this.modePaiementService.item = value;
    }
    get modePaiements(): Array<ModePaiementDto> {
        return this.modePaiementService.items;
    }
    set modePaiements(value: Array<ModePaiementDto>) {
        this.modePaiementService.items = value;
    }
    get createModePaiementDialog(): boolean {
        return this.modePaiementService.createDialog;
    }
    set createModePaiementDialog(value: boolean) {
        this.modePaiementService.createDialog= value;
    }

    get transactionsElement(): TransactionDto {
        if( this._transactionsElement == null )
            this._transactionsElement = new TransactionDto();
         return this._transactionsElement;
    }

    set transactionsElement(value: TransactionDto) {
        this._transactionsElement = value;
    }


    get validBanqueCode(): boolean {
        return this._validBanqueCode;
    }
    set validBanqueCode(value: boolean) {
        this._validBanqueCode = value;
    }

	get items(): Array<CompteDto> {
        return this.service.items;
    }

    set items(value: Array<CompteDto>) {
        this.service.items = value;
    }

    get item(): CompteDto {
        return this.service.item;
    }

    set item(value: CompteDto) {
        this.service.item = value;
    }

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
    }

    get criteria(): CompteCriteria {
        return this.service.criteria;
    }

    set criteria(value: CompteCriteria) {
        this.service.criteria = value;
    }

    get dateFormat() {
        return environment.dateFormatCreate;
    }

    get dateFormatColumn() {
        return environment.dateFormatCreate;
    }

    get submitted(): boolean {
        return this._submitted;
    }

    set submitted(value: boolean) {
        this._submitted = value;
    }

    get errorMessages(): string[] {
        if (this._errorMessages == null) {
            this._errorMessages = new Array<string>();
        }
        return this._errorMessages;
    }

    set errorMessages(value: string[]) {
        this._errorMessages = value;
    }

    get validate(): boolean {
        return this.service.validate;
    }

    set validate(value: boolean) {
        this.service.validate = value;
    }


    get activeTab(): number {
        return this._activeTab;
    }

    set activeTab(value: number) {
        this._activeTab = value;
    }


}
