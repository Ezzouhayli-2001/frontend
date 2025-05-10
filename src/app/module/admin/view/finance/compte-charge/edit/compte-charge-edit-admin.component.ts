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




import {CompteChargeAdminService} from 'src/app/shared/service/admin/finance/CompteChargeAdmin.service';
import {CompteChargeDto} from 'src/app/shared/model/finance/CompteCharge.model';
import {CompteChargeCriteria} from 'src/app/shared/criteria/finance/CompteChargeCriteria.model';


import {TypeChargeDto} from 'src/app/shared/model/finance/TypeCharge.model';
import {TypeChargeAdminService} from 'src/app/shared/service/admin/finance/TypeChargeAdmin.service';
import {ChargeDto} from 'src/app/shared/model/finance/Charge.model';
import {ChargeAdminService} from 'src/app/shared/service/admin/finance/ChargeAdmin.service';
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {LocalDto} from "../../../../../../shared/model/locaux/Local.model";

@Component({
  selector: 'app-compte-charge-edit-admin',
  standalone: false,
  templateUrl: './compte-charge-edit-admin.component.html'
})
export class CompteChargeEditAdminComponent implements OnInit {

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

    protected chargesIndex = -1;

    private _chargesElement = new ChargeDto();

    private _validCompteChargeCode = true;

    private _validChargesCode = true;
    private _validChargesLabel = true;

    chargesGroupedByLocal: any = {};
    filteredItems = new Array<CompteChargeDto>();
    chargesFilteredByLocal = new Array<ChargeDto>();
    constructor(private service: CompteChargeAdminService , private localService: LocalAdminService, private typeChargeService: TypeChargeAdminService, private chargeService: ChargeAdminService, @Inject(PLATFORM_ID) private platformId?) {
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

    }

    public prepareEdit() {
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
        })
    }

    public editWithShowOption(showList: boolean) {
        this.service.edit().subscribe(religion=>{
            this.findPaginatedByCriteria();
            this.editDialog = false;
            this.submitted = false;
            this.item = new CompteChargeDto();
            this.messageService.add({severity: 'success', summary: '', detail: 'Compte charge a été modifié avec succès'});
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.item = new CompteChargeDto();
        this.editDialog = false;
        this.setValidation(true);
    }





    public validateCharges(){
        this.errorMessages = new Array();
        this.validateChargesCode();
        this.validateChargesLabel();
    }

    public setValidation(value: boolean){
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

    public validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateCompteChargeCode();
    }

    public validateCompteChargeCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
            this.errorMessages.push('Code non valide');
            this.validCompteChargeCode = false;
        } else {
            this.validCompteChargeCode = true;
        }
    }



    private validateChargesCode(){
        if (this.chargesElement.code == null) {
        this.errorMessages.push('Code de la charge est  invalide');
            this.validChargesCode = false;
        } else {
            this.validChargesCode = true;
        }
    }
    private validateChargesLabel(){
        if (this.chargesElement.label == null) {
        this.errorMessages.push('Label de la charge est  invalide');
            this.validChargesLabel = false;
        } else {
            this.validChargesLabel = true;
        }
    }

   public async openCreateTypeCharge(typeCharge: string) {
        const isPermistted = await this.roleService.isPermitted('TypeCharge', 'edit');
        if (isPermistted) {
             this.typeCharge = new TypeChargeDto();
             this.createTypeChargeDialog = true;
        }else {
             this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
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

    get chargesElement(): ChargeDto {
        if( this._chargesElement == null )
            this._chargesElement = new ChargeDto();
         return this._chargesElement;
    }

    set chargesElement(value: ChargeDto) {
        this._chargesElement = value;
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

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
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


}
