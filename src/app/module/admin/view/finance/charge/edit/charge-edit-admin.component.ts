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




import {ChargeAdminService} from 'src/app/shared/service/admin/finance/ChargeAdmin.service';
import {ChargeDto} from 'src/app/shared/model/finance/Charge.model';
import {ChargeCriteria} from 'src/app/shared/criteria/finance/ChargeCriteria.model';


import {TypeChargeDto} from 'src/app/shared/model/finance/TypeCharge.model';
import {TypeChargeAdminService} from 'src/app/shared/service/admin/finance/TypeChargeAdmin.service';
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {LocalDto} from "../../../../../../shared/model/locaux/Local.model";

@Component({
  selector: 'app-charge-edit-admin',
  standalone: false,
  templateUrl: './charge-edit-admin.component.html'
})
export class ChargeEditAdminComponent implements OnInit {

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



    private _validChargeCode = true;
    private _validChargeLabel = true;

    private _validTypeChargeCode = true;
    private _validTypeChargeStyle = true;
    private _validLocalCode = true;



    constructor(private service: ChargeAdminService , private localService: LocalAdminService, private typeChargeService: TypeChargeAdminService, @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.typeChargeService.findAll().subscribe((data) => this.typeCharges = data);
        this.localService.findAll().subscribe((data) => this.locals = data);
    }

    public prepareEdit() {
        this.item.date = this.service.format(this.item.date);
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
            this.item = new ChargeDto();
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.editDialog = false;
        this.setValidation(true);
    }





    public setValidation(value: boolean){
        this.validChargeCode = value;
        this.validChargeLabel = value;
    }


    public validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateChargeCode();
        this.validateChargeLabel();
    }

    public validateChargeCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
            this.errorMessages.push('Code non valide');
            this.validChargeCode = false;
        } else {
            this.validChargeCode = true;
        }
    }

    public validateChargeLabel(){
        if (this.stringUtilService.isEmpty(this.item.label)) {
            this.errorMessages.push('Label non valide');
            this.validChargeLabel = false;
        } else {
            this.validChargeLabel = true;
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


    get validChargeCode(): boolean {
        return this._validChargeCode;
    }
    set validChargeCode(value: boolean) {
        this._validChargeCode = value;
    }
    get validChargeLabel(): boolean {
        return this._validChargeLabel;
    }
    set validChargeLabel(value: boolean) {
        this._validChargeLabel = value;
    }

    get validTypeChargeCode(): boolean {
        return this._validTypeChargeCode;
    }
    set validTypeChargeCode(value: boolean) {
        this._validTypeChargeCode = value;
    }
    get validTypeChargeStyle(): boolean {
        return this._validTypeChargeStyle;
    }
    set validTypeChargeStyle(value: boolean) {
        this._validTypeChargeStyle = value;
    }
    get validLocalCode(): boolean {
        return this._validLocalCode;
    }
    set validLocalCode(value: boolean) {
        this._validLocalCode = value;
    }

	get items(): Array<ChargeDto> {
        return this.service.items;
    }

    set items(value: Array<ChargeDto>) {
        this.service.items = value;
    }

    get item(): ChargeDto {
        return this.service.item;
    }

    set item(value: ChargeDto) {
        this.service.item = value;
    }

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
    }

    get criteria(): ChargeCriteria {
        return this.service.criteria;
    }

    set criteria(value: ChargeCriteria) {
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
