import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {LocationAdminService} from 'src/app/shared/service/admin/locataire/LocationAdmin.service';
import {LocationDto} from 'src/app/shared/model/locataire/Location.model';
import {LocationCriteria} from 'src/app/shared/criteria/locataire/LocationCriteria.model';
import {TransactionDto} from 'src/app/shared/model/locataire/Transaction.model';
import {TransactionAdminService} from 'src/app/shared/service/admin/locataire/TransactionAdmin.service';
import {TypePaiementDto} from 'src/app/shared/model/locataire/TypePaiement.model';
import {TypePaiementAdminService} from 'src/app/shared/service/admin/locataire/TypePaiementAdmin.service';
import {CompteDto} from 'src/app/shared/model/finance/Compte.model';
import {CompteAdminService} from 'src/app/shared/service/admin/finance/CompteAdmin.service';
import {CompteLocataireDto} from 'src/app/shared/model/finance/CompteLocataire.model';
import {CompteLocataireAdminService} from 'src/app/shared/service/admin/finance/CompteLocataireAdmin.service';
import {TypeLocataireDto} from 'src/app/shared/model/locataire/TypeLocataire.model';
import {TypeLocataireAdminService} from 'src/app/shared/service/admin/locataire/TypeLocataireAdmin.service';
import {LocataireDto} from 'src/app/shared/model/locataire/Locataire.model';
import {LocataireAdminService} from 'src/app/shared/service/admin/locataire/LocataireAdmin.service';
@Component({
  selector: 'app-location-create-admin',
  standalone: false,
  templateUrl: './location-create-admin.component.html'
})
export class LocationCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;



   private _validLocationCode = true;
    private _validLocataireCode = true;
    private _validLocataireLibelle = true;
    private _validLocataireNom = true;
    private _validLocatairePrenom = true;
    private _validTypeLocataireCode = true;
    private _validTypeLocataireLabel = true;
    private _validTypeLocataireStyle = true;
    private _validTypePaiementCode = true;
    private _validTypePaiementLabel = true;
    private _validTypePaiementStyle = true;

	constructor(private service: LocationAdminService , private transactionService: TransactionAdminService, private typePaiementService: TypePaiementAdminService, private compteService: CompteAdminService, private compteLocataireService: CompteLocataireAdminService, private typeLocataireService: TypeLocataireAdminService, private locataireService: LocataireAdminService, @Inject(PLATFORM_ID) private platformId? ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.locataireService.findAll().subscribe((data) => this.locataires = data);
        this.compteService.findAll().subscribe((data) => this.comptes = data);
        this.compteLocataireService.findAll().subscribe((data) => this.compteLocataires = data);
        this.transactionService.findAll().subscribe((data) => this.transactions = data);
        this.typeLocataireService.findAll().subscribe((data) => this.typeLocataires = data);
        this.typePaiementService.findAll().subscribe((data) => this.typePaiements = data);
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
                this.item = new LocationDto();
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





    public  setValidation(value: boolean){
        this.validLocationCode = value;
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateLocationCode();
    }

    public validateLocationCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
        this.errorMessages.push('Code non valide');
        this.validLocationCode = false;
        } else {
            this.validLocationCode = true;
        }
    }


    public async openCreateTransaction(transaction: string) {
    const isPermistted = await this.roleService.isPermitted('Transaction', 'add');
    if(isPermistted) {
         this.transaction = new TransactionDto();
         this.createTransactionDialog = true;
    }else{
        this.messageService.add({
        severity: 'error', summary: 'erreur', detail: 'problème de permission'
        });
     }
    }
    public async openCreateLocataire(locataire: string) {
    const isPermistted = await this.roleService.isPermitted('Locataire', 'add');
    if(isPermistted) {
         this.locataire = new LocataireDto();
         this.createLocataireDialog = true;
    }else{
        this.messageService.add({
        severity: 'error', summary: 'erreur', detail: 'problème de permission'
        });
     }
    }
    public async openCreateTypeLocataire(typeLocataire: string) {
    const isPermistted = await this.roleService.isPermitted('TypeLocataire', 'add');
    if(isPermistted) {
         this.typeLocataire = new TypeLocataireDto();
         this.createTypeLocataireDialog = true;
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

    get compteLocataire(): CompteLocataireDto {
        return this.compteLocataireService.item;
    }
    set compteLocataire(value: CompteLocataireDto) {
        this.compteLocataireService.item = value;
    }
    get compteLocataires(): Array<CompteLocataireDto> {
        return this.compteLocataireService.items;
    }
    set compteLocataires(value: Array<CompteLocataireDto>) {
        this.compteLocataireService.items = value;
    }
    get createCompteLocataireDialog(): boolean {
        return this.compteLocataireService.createDialog;
    }
    set createCompteLocataireDialog(value: boolean) {
        this.compteLocataireService.createDialog= value;
    }
    get transaction(): TransactionDto {
        return this.transactionService.item;
    }
    set transaction(value: TransactionDto) {
        this.transactionService.item = value;
    }
    get transactions(): Array<TransactionDto> {
        return this.transactionService.items;
    }
    set transactions(value: Array<TransactionDto>) {
        this.transactionService.items = value;
    }
    get createTransactionDialog(): boolean {
        return this.transactionService.createDialog;
    }
    set createTransactionDialog(value: boolean) {
        this.transactionService.createDialog= value;
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
    get createTypeLocataireDialog(): boolean {
        return this.typeLocataireService.createDialog;
    }
    set createTypeLocataireDialog(value: boolean) {
        this.typeLocataireService.createDialog= value;
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
    get compte(): CompteDto {
        return this.compteService.item;
    }
    set compte(value: CompteDto) {
        this.compteService.item = value;
    }
    get comptes(): Array<CompteDto> {
        return this.compteService.items;
    }
    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
    }
    get createCompteDialog(): boolean {
        return this.compteService.createDialog;
    }
    set createCompteDialog(value: boolean) {
        this.compteService.createDialog= value;
    }



    get validLocationCode(): boolean {
        return this._validLocationCode;
    }

    set validLocationCode(value: boolean) {
         this._validLocationCode = value;
    }

    get validLocataireCode(): boolean {
        return this._validLocataireCode;
    }
    set validLocataireCode(value: boolean) {
        this._validLocataireCode = value;
    }
    get validLocataireLibelle(): boolean {
        return this._validLocataireLibelle;
    }
    set validLocataireLibelle(value: boolean) {
        this._validLocataireLibelle = value;
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
    get validTypeLocataireCode(): boolean {
        return this._validTypeLocataireCode;
    }
    set validTypeLocataireCode(value: boolean) {
        this._validTypeLocataireCode = value;
    }
    get validTypeLocataireLabel(): boolean {
        return this._validTypeLocataireLabel;
    }
    set validTypeLocataireLabel(value: boolean) {
        this._validTypeLocataireLabel = value;
    }
    get validTypeLocataireStyle(): boolean {
        return this._validTypeLocataireStyle;
    }
    set validTypeLocataireStyle(value: boolean) {
        this._validTypeLocataireStyle = value;
    }
    get validTypePaiementCode(): boolean {
        return this._validTypePaiementCode;
    }
    set validTypePaiementCode(value: boolean) {
        this._validTypePaiementCode = value;
    }
    get validTypePaiementLabel(): boolean {
        return this._validTypePaiementLabel;
    }
    set validTypePaiementLabel(value: boolean) {
        this._validTypePaiementLabel = value;
    }
    get validTypePaiementStyle(): boolean {
        return this._validTypePaiementStyle;
    }
    set validTypePaiementStyle(value: boolean) {
        this._validTypePaiementStyle = value;
    }


    get items(): Array<LocationDto> {
        return this.service.items;
    }

    set items(value: Array<LocationDto>) {
        this.service.items = value;
    }

    get item(): LocationDto {
        return this.service.item;
    }

    set item(value: LocationDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): LocationCriteria {
        return this.service.criteria;
    }

    set criteria(value: LocationCriteria) {
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
