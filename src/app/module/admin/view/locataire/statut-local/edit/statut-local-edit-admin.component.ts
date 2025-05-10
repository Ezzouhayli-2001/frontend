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




import {StatutLocalAdminService} from 'src/app/shared/service/admin/locataire/StatutLocalAdmin.service';
import {StatutLocalDto} from 'src/app/shared/model/locataire/StatutLocal.model';
import {StatutLocalCriteria} from 'src/app/shared/criteria/locataire/StatutLocalCriteria.model';



@Component({
  selector: 'app-statut-local-edit-admin',
  standalone: false,
  templateUrl: './statut-local-edit-admin.component.html'
})
export class StatutLocalEditAdminComponent implements OnInit {

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



    private _validStatutLocalCode = true;
    private _validStatutLocalLabel = true;
    private _validStatutLocalStyle = true;




    constructor(private service: StatutLocalAdminService , @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
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

    public editWithShowOption(showList: boolean) {
        this.service.edit().subscribe(religion=>{
            const myIndex = this.items.findIndex(e => e.id === this.item.id);
            this.items[myIndex] = religion;
            this.editDialog = false;
            this.submitted = false;
            this.item = new StatutLocalDto();
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.editDialog = false;
        this.setValidation(true);
    }





    public setValidation(value: boolean){
        this.validStatutLocalCode = value;
        this.validStatutLocalLabel = value;
        this.validStatutLocalStyle = value;
    }


    public validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateStatutLocalCode();
        this.validateStatutLocalLabel();
        this.validateStatutLocalStyle();
    }

    public validateStatutLocalCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
            this.errorMessages.push('Code non valide');
            this.validStatutLocalCode = false;
        } else {
            this.validStatutLocalCode = true;
        }
    }

    public validateStatutLocalLabel(){
        if (this.stringUtilService.isEmpty(this.item.label)) {
            this.errorMessages.push('Label non valide');
            this.validStatutLocalLabel = false;
        } else {
            this.validStatutLocalLabel = true;
        }
    }

    public validateStatutLocalStyle(){
        if (this.stringUtilService.isEmpty(this.item.style)) {
            this.errorMessages.push('Style non valide');
            this.validStatutLocalStyle = false;
        } else {
            this.validStatutLocalStyle = true;
        }
    }







    get validStatutLocalCode(): boolean {
        return this._validStatutLocalCode;
    }
    set validStatutLocalCode(value: boolean) {
        this._validStatutLocalCode = value;
    }
    get validStatutLocalLabel(): boolean {
        return this._validStatutLocalLabel;
    }
    set validStatutLocalLabel(value: boolean) {
        this._validStatutLocalLabel = value;
    }
    get validStatutLocalStyle(): boolean {
        return this._validStatutLocalStyle;
    }
    set validStatutLocalStyle(value: boolean) {
        this._validStatutLocalStyle = value;
    }


	get items(): Array<StatutLocalDto> {
        return this.service.items;
    }

    set items(value: Array<StatutLocalDto>) {
        this.service.items = value;
    }

    get item(): StatutLocalDto {
        return this.service.item;
    }

    set item(value: StatutLocalDto) {
        this.service.item = value;
    }

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
    }

    get criteria(): StatutLocalCriteria {
        return this.service.criteria;
    }

    set criteria(value: StatutLocalCriteria) {
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
