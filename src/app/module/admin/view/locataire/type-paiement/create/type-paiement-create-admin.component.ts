import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {TypePaiementAdminService} from 'src/app/shared/service/admin/locataire/TypePaiementAdmin.service';
import {TypePaiementDto} from 'src/app/shared/model/locataire/TypePaiement.model';
import {TypePaiementCriteria} from 'src/app/shared/criteria/locataire/TypePaiementCriteria.model';
@Component({
  selector: 'app-type-paiement-create-admin',
  standalone: false,
  templateUrl: './type-paiement-create-admin.component.html'
})
export class TypePaiementCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;



   private _validTypePaiementCode = true;
   private _validTypePaiementLabel = true;
   private _validTypePaiementStyle = true;

	constructor(private service: TypePaiementAdminService , @Inject(PLATFORM_ID) private platformId? ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
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
                this.item = new TypePaiementDto();
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
        this.validTypePaiementCode = value;
        this.validTypePaiementLabel = value;
        this.validTypePaiementStyle = value;
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateTypePaiementCode();
        this.validateTypePaiementLabel();
        this.validateTypePaiementStyle();
    }

    public validateTypePaiementCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
        this.errorMessages.push('Code non valide');
        this.validTypePaiementCode = false;
        } else {
            this.validTypePaiementCode = true;
        }
    }
    public validateTypePaiementLabel(){
        if (this.stringUtilService.isEmpty(this.item.label)) {
        this.errorMessages.push('Label non valide');
        this.validTypePaiementLabel = false;
        } else {
            this.validTypePaiementLabel = true;
        }
    }
    public validateTypePaiementStyle(){
        if (this.stringUtilService.isEmpty(this.item.style)) {
        this.errorMessages.push('Style non valide');
        this.validTypePaiementStyle = false;
        } else {
            this.validTypePaiementStyle = true;
        }
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



    get items(): Array<TypePaiementDto> {
        return this.service.items;
    }

    set items(value: Array<TypePaiementDto>) {
        this.service.items = value;
    }

    get item(): TypePaiementDto {
        return this.service.item;
    }

    set item(value: TypePaiementDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): TypePaiementCriteria {
        return this.service.criteria;
    }

    set criteria(value: TypePaiementCriteria) {
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
