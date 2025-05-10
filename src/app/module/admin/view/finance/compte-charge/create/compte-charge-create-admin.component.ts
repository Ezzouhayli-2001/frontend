import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {CompteChargeAdminService} from 'src/app/shared/service/admin/finance/CompteChargeAdmin.service';
import {CompteChargeDto} from 'src/app/shared/model/finance/CompteCharge.model';
import {CompteChargeCriteria} from 'src/app/shared/criteria/finance/CompteChargeCriteria.model';
import {TypeChargeDto} from 'src/app/shared/model/finance/TypeCharge.model';
import {TypeChargeAdminService} from 'src/app/shared/service/admin/finance/TypeChargeAdmin.service';
import {ChargeDto} from 'src/app/shared/model/finance/Charge.model';
import {ChargeAdminService} from 'src/app/shared/service/admin/finance/ChargeAdmin.service';
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {LocalDto} from "../../../../../../shared/model/locaux/Local.model";
import {CaisseDto} from "../../../../../../shared/model/finance/Caisse.model";
import {BanqueDto} from "../../../../../../shared/model/finance/Banque.model";
import {BanqueAdminService} from "../../../../../../shared/service/admin/finance/BanqueAdmin.service";
import {LocataireAdminService} from "../../../../../../shared/service/admin/locataire/LocataireAdmin.service";
import {CaisseAdminService} from "../../../../../../shared/service/admin/finance/CaisseAdmin.service";
import {CompteAdminService} from "../../../../../../shared/service/admin/finance/CompteAdmin.service";
import {CompteDto} from "../../../../../../shared/model/finance/Compte.model";
import {TranslateService} from "@ngx-translate/core";
@Component({
  selector: 'app-compte-charge-create-admin',
  standalone: false,
  templateUrl: './compte-charge-create-admin.component.html'
})
export class CompteChargeCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;
    protected chargesIndex = -1;

    private _chargesElement = new ChargeDto();


   private _validCompteChargeCode = true;
    private _validChargesCode = true;
    private _validChargesLabel = true;

    compteElement: CompteDto = new CompteDto();
    // Pour la gestion du nouveau type
    displayAddTypeDialog: boolean = false;


	constructor(private service: CompteChargeAdminService ,
                private banqueService: BanqueAdminService,
                private compteService: CompteAdminService,
                private translateService: TranslateService,
                private caisseService: CaisseAdminService,
                private localService: LocalAdminService, private typeChargeService: TypeChargeAdminService, private chargeService: ChargeAdminService, @Inject(PLATFORM_ID) private platformId? ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.chargesElement.typeCharge = new TypeChargeDto();
        this.typeChargeService.findAll().subscribe((data) => this.typeCharges = data);
        this.chargesElement.local = new LocalDto();
        this.localService.findAll().subscribe((data) => this.locals = data);
        this.banqueService.findPaginatedByCriteria(this.banqueService.criteria).subscribe((data) => {
            this.banqueService.items = data.list;
        });
        this.caisseService.findPaginatedByCriteria(this.caisseService.criteria).subscribe((data) => {
            this.caisseService.items = data.list;
        });
        this.compteService.findPaginatedByCriteria(this.compteService.criteria).subscribe((data) => {
            this.comptes = data.list;
        });
    }



    public save(): void {
        this.submitted = true;
        this.item.typeCharges.push(this.typeCharge);
        this.item.code = `CHARGE-${this.item.nom}`;
        this.item.solde = this.compte.solde;
        this.compte.banque = this.compteElement.banque;
        this.compte.caisse = this.compteElement.caisse;
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
                this.compte.code = item.code;
                this.compte.compteCharge = item;
                this.findPaginatedByCriteria();
                this.createDialog = false;
                this.submitted = false;
                this.typeCharge = new TypeChargeDto();
                this.item = new CompteChargeDto();
               /* this.compteService.save().subscribe(item => {
                    if (item != null) {
                        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Compte chargé créé'});
                    } else {
                        this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Compte chargé créé'});
                    }
                }, error => {
                    console.log(error);
                });*/
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



    validateCharges(){
        this.errorMessages = new Array();
        this.validateChargesCode();
        this.validateChargesLabel();
    }


    public  setValidation(value: boolean){
        this.validCompteChargeCode = value;
        this.validChargesCode = value;
        this.validChargesLabel = value;
    }

    public addCharges() {
        if( this.item.charges == null )
            this.item.charges = new Array<ChargeDto>();

       this.validateCharges();

       if (this.errorMessages.length === 0) {
            if (this.chargesIndex == -1){
                this.item.charges.push({... this.chargesElement});
            }else {
                this.item.charges[this.chargesIndex] =this.chargesElement;
            }
              this.chargesElement = new ChargeDto();
              this.chargesIndex = -1;
       }else{
           this.messageService.add({severity: 'error',summary: 'Erreurs',detail: 'Merci de corrigé les erreurs suivant : ' + this.errorMessages});
       }
    }

    public deleteCharges(p: ChargeDto, index: number) {
        this.item.charges.splice(index, 1);
    }

    public editCharges(p: ChargeDto, index: number) {
        this.chargesElement = {... p};
        this.chargesIndex = index;
        this.activeTab = 0;
    }


    public  validateForm(): void{
        this.errorMessages = new Array<string>();
    }

    public validateCompteChargeCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
        this.errorMessages.push('Code non valide');
        this.validCompteChargeCode = false;
        } else {
            this.validCompteChargeCode = true;
        }
    }

    public validateChargesCode(){
        if (this.chargesElement.code == null) {
            this.errorMessages.push('Code de la charge est  invalide');
            this.validChargesCode = false;
        } else {
            this.validChargesCode = true;
        }
    }
    public validateChargesLabel(){
        if (this.chargesElement.label == null) {
            this.errorMessages.push('Label de la charge est  invalide');
            this.validChargesLabel = false;
        } else {
            this.validChargesLabel = true;
        }
    }

    public async openCreateTypeCharge(typeCharge: string) {
    const isPermistted = await this.roleService.isPermitted('TypeCharge', 'add');
    if(isPermistted) {
         this.typeCharge = new TypeChargeDto();
         this.createTypeChargeDialog = true;
    }else{
        this.messageService.add({
        severity: 'error', summary: 'erreur', detail: 'problème de permission'
        });
     }
    }
    // Méthodes pour la gestion des nouveaux types de charge
    showAddTypeDialog() {
        this.typeCharge = new TypeChargeDto();
        this.displayAddTypeDialog = true;
    }

    cancelAddType() {
        this.displayAddTypeDialog = false;
    }

    saveNewType() {
        if (!this.typeCharge.label) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('warning'),
                detail: this.translateService.instant('form.required.fields')
            });
            return;
        }

        this.typeChargeService.save().subscribe({
            next: (result) => {
                // Ajouter le nouveau type à la liste et le sélectionner
                this.typeCharges.push(result);
                this.typeCharge = result;

                this.messageService.add({
                    severity: 'success',
                    summary: this.translateService.instant('success'),
                    detail: this.translateService.instant('typeCharge.created')
                });

                this.displayAddTypeDialog = false;
            },
            error: (err) => {
                console.error('Erreur lors de la création du type de charge', err);
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('error'),
                    detail: this.translateService.instant('error.creating.type')
                });
            }
        });
    }

    get local(): LocalDto {
        return this.localService.item;
    }
    set local(value: LocalDto) {
        this.localService.item = value;
    }
    get locals(): Array<LocalDto> {
        return this.localService.items;
    }
    set locals(value: Array<LocalDto>) {
        this.localService.items = value;
    }
    get createLocalDialog(): boolean {
        return this.localService.createDialog;
    }
    set createLocalDialog(value: boolean) {
        this.localService.createDialog= value;
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
    get createTypeChargeDialog(): boolean {
        return this.typeChargeService.createDialog;
    }
    set createTypeChargeDialog(value: boolean) {
        this.typeChargeService.createDialog= value;
    }



    get validCompteChargeCode(): boolean {
        return this._validCompteChargeCode;
    }

    set validCompteChargeCode(value: boolean) {
         this._validCompteChargeCode = value;
    }

    get validChargesCode(): boolean {
        return this._validChargesCode;
    }
    set validChargesCode(value: boolean) {
        this._validChargesCode = value;
    }
    get validChargesLabel(): boolean {
        return this._validChargesLabel;
    }
    set validChargesLabel(value: boolean) {
        this._validChargesLabel = value;
    }

    get chargesElement(): ChargeDto {
        if( this._chargesElement == null )
            this._chargesElement = new ChargeDto();
        return this._chargesElement;
    }

    set chargesElement(value: ChargeDto) {
        this._chargesElement = value;
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

    get compte(): CompteDto {
        return this.compteService.item;
    }

    set compte(value: CompteDto) {
        this.compteService.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): CompteChargeCriteria {
        return this.service.criteria;
    }

    set criteria(value: CompteChargeCriteria) {
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
    get caisses(): Array<CaisseDto> {
        return this.caisseService.items;
    }

    set caisses(value: Array<CaisseDto>) {
        this.caisseService.items = value;
    }
    get banques(): Array<BanqueDto> {
        return this.banqueService.items;
    }

    set banques(value: Array<BanqueDto>) {
        this.banqueService.items = value;
    }



    get comptes(): Array<CompteDto> {
        return this.compteService.items;
    }

    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
    }

    updateSolde($event: Event) {
        this.compte.solde = this.compte.credit-this.compte.debit
    }

    private findPaginatedByCriteria() {
        this.service.findPaginatedByCriteria(this.criteria).subscribe(paginatedItems => {
            this.items = paginatedItems.list;
        }, error => console.log(error));
    }

    cancel() {
        this.navigateToList();
    }

    navigateToList() {
        // Naviguer vers la liste des locaux
        this.router.navigate(['/app/admin/finance/compte-charge/list']);
    }
}
