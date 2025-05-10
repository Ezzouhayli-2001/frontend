import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {CompteLocataireAdminService} from 'src/app/shared/service/admin/finance/CompteLocataireAdmin.service';
import {CompteLocataireDto} from 'src/app/shared/model/finance/CompteLocataire.model';
import {CompteLocataireCriteria} from 'src/app/shared/criteria/finance/CompteLocataireCriteria.model';
import {TransactionDto} from 'src/app/shared/model/locataire/Transaction.model';
import {TransactionAdminService} from 'src/app/shared/service/admin/locataire/TransactionAdmin.service';
import {TypePaiementDto} from 'src/app/shared/model/finance/TypePaiement.model';
import {TypePaiementAdminService} from 'src/app/shared/service/admin/finance/TypePaiementAdmin.service';
import {CompteDto} from 'src/app/shared/model/finance/Compte.model';
import {CompteAdminService} from 'src/app/shared/service/admin/finance/CompteAdmin.service';
import {ModePaiementDto} from 'src/app/shared/model/finance/ModePaiement.model';
import {ModePaiementAdminService} from 'src/app/shared/service/admin/finance/ModePaiementAdmin.service';
import {LocataireDto} from 'src/app/shared/model/locataire/Locataire.model';
import {LocataireAdminService} from 'src/app/shared/service/admin/locataire/LocataireAdmin.service';
import {TypeTransactiontDto} from 'src/app/shared/model/locataire/TypeTransactiont.model';
import {TypeTransactiontAdminService} from 'src/app/shared/service/admin/locataire/TypeTransactiontAdmin.service';
@Component({
  selector: 'app-compte-locataire-create-admin',
  standalone: false,
  templateUrl: './compte-locataire-create-admin.component.html'
})
export class CompteLocataireCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;
    protected transactionsIndex = -1;

    private _transactionsElement = new TransactionDto();


    private _validLocataireCode = true;
    private _validLocataireNom = true;
    private _validLocatairePrenom = true;

	constructor(private service: CompteLocataireAdminService , private transactionService: TransactionAdminService, private typePaiementService: TypePaiementAdminService, private compteService: CompteAdminService, private modePaiementService: ModePaiementAdminService, private locataireService: LocataireAdminService, private typeTransactiontService: TypeTransactiontAdminService, @Inject(PLATFORM_ID) private platformId? ) {
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
        this.transactionsElement.compteSource = new CompteDto();
        this.compteService.findAll().subscribe((data) => this.compteSources = data);
        this.transactionsElement.compteDestination = new CompteDto();
        this.compteService.findAll().subscribe((data) => this.compteDestinations = data);
        this.locataireService.findAll().subscribe((data) => this.locataires = data);
    }



    public save(): void {
        this.submitted = true;
        this.validateForm();
        if (this.errorMessages.length === 0) {
            this.saveWithShowOption(false);
        } else {
            this.messageService.add({severity: 'error',summary: 'Erreurs',detail: 'Merci de corrigé les erreurs sur le formulaire'});
        }
    }

    public saveWithShowOption(showList: boolean) {
        this.service.save().subscribe(item => {
            if (item != null) {
                this.items.push({...item});
                this.createDialog = false;
                this.submitted = false;
                this.item = new CompteLocataireDto();
            } else {
                this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Element existant'});
            }

        }, error => {
            console.log(error);
        });
    }


    public hideCreateDialog() {
        this.createDialog = false;
        this.setValidation(true);
    }



    validateTransactions(){
        this.errorMessages = new Array();
    }


    public  setValidation(value: boolean){
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


    public  validateForm(): void{
        this.errorMessages = new Array<string>();
    }



    public async openCreateCompteSource(compteSource: string) {
    const isPermistted = await this.roleService.isPermitted('Compte', 'add');
    if(isPermistted) {
         this.compteSource = new CompteDto();
         this.createCompteSourceDialog = true;
    }else{
        this.messageService.add({
        severity: 'error', summary: 'erreur', detail: 'problème de permission'
        });
     }
    }
    public async openCreateTypePaiement(typePaiement: string) {
    const isPermistted = await this.roleService.isPermitted('TypePaiement', 'add');
    if(isPermistted) {
         this.typePaiement = new TypePaiementDto();
         this.createTypePaiementDialog = true;
    }else{
        this.messageService.add({
        severity: 'error', summary: 'erreur', detail: 'problème de permission'
        });
     }
    }
    public async openCreateCompteDestination(compteDestination: string) {
    const isPermistted = await this.roleService.isPermitted('Compte', 'add');
    if(isPermistted) {
         this.compteDestination = new CompteDto();
         this.createCompteDestinationDialog = true;
    }else{
        this.messageService.add({
        severity: 'error', summary: 'erreur', detail: 'problème de permission'
        });
     }
    }
    public async openCreateModePaiement(modePaiement: string) {
    const isPermistted = await this.roleService.isPermitted('ModePaiement', 'add');
    if(isPermistted) {
         this.modePaiement = new ModePaiementDto();
         this.createModePaiementDialog = true;
    }else{
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
    get compteSource(): CompteDto {
        return this.compteService.item;
    }
    set compteSource(value: CompteDto) {
        this.compteService.item = value;
    }
    get compteSources(): Array<CompteDto> {
        return this.compteService.items;
    }
    set compteSources(value: Array<CompteDto>) {
        this.compteService.items = value;
    }
    get createCompteSourceDialog(): boolean {
        return this.compteService.createDialog;
    }
    set createCompteSourceDialog(value: boolean) {
        this.compteService.createDialog= value;
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
    get createLocataireDialog(): boolean {
        return this.locataireService.createDialog;
    }
    set createLocataireDialog(value: boolean) {
        this.locataireService.createDialog= value;
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
    get compteDestination(): CompteDto {
        return this.compteService.item;
    }
    set compteDestination(value: CompteDto) {
        this.compteService.item = value;
    }
    get compteDestinations(): Array<CompteDto> {
        return this.compteService.items;
    }
    set compteDestinations(value: Array<CompteDto>) {
        this.compteService.items = value;
    }
    get createCompteDestinationDialog(): boolean {
        return this.compteService.createDialog;
    }
    set createCompteDestinationDialog(value: boolean) {
        this.compteService.createDialog= value;
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




    get validLocataireCode(): boolean {
        return this._validLocataireCode;
    }
    set validLocataireCode(value: boolean) {
        this._validLocataireCode = value;
    }
    get validLocataireNom(): boolean {
        return this._validLocataireNom;
    }
    set validLocataireNom(value: boolean) {
        this._validLocataireNom = value;
    }
    get validLocatairePrenom(): boolean {
        return this._validLocatairePrenom;
    }
    set validLocatairePrenom(value: boolean) {
        this._validLocatairePrenom = value;
    }

    get transactionsElement(): TransactionDto {
        if( this._transactionsElement == null )
            this._transactionsElement = new TransactionDto();
        return this._transactionsElement;
    }

    set transactionsElement(value: TransactionDto) {
        this._transactionsElement = value;
    }

    get items(): Array<CompteLocataireDto> {
        return this.service.items;
    }

    set items(value: Array<CompteLocataireDto>) {
        this.service.items = value;
    }

    get item(): CompteLocataireDto {
        return this.service.item;
    }

    set item(value: CompteLocataireDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): CompteLocataireCriteria {
        return this.service.criteria;
    }

    set criteria(value: CompteLocataireCriteria) {
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
