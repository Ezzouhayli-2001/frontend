import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {TypeLocataireAdminService} from 'src/app/shared/service/admin/locataire/TypeLocataireAdmin.service';
import {TypeLocataireDto} from 'src/app/shared/model/locataire/TypeLocataire.model';
import {TypeLocataireCriteria} from 'src/app/shared/criteria/locataire/TypeLocataireCriteria.model';
@Component({
  selector: 'app-type-locataire-create-admin',
  standalone: false,
  templateUrl: './type-locataire-create-admin.component.html'
})
export class TypeLocataireCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;



   private _validTypeLocataireCode = true;
   private _validTypeLocataireLabel = true;
   private _validTypeLocataireStyle = true;

	constructor(private service: TypeLocataireAdminService , @Inject(PLATFORM_ID) private platformId? ) {
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
                this.item = new TypeLocataireDto();
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
        this.validTypeLocataireCode = value;
        this.validTypeLocataireLabel = value;
        this.validTypeLocataireStyle = value;
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateTypeLocataireCode();
        this.validateTypeLocataireLabel();
        this.validateTypeLocataireStyle();
    }

    public validateTypeLocataireCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
        this.errorMessages.push('Code non valide');
        this.validTypeLocataireCode = false;
        } else {
            this.validTypeLocataireCode = true;
        }
    }
    public validateTypeLocataireLabel(){
        if (this.stringUtilService.isEmpty(this.item.label)) {
        this.errorMessages.push('Label non valide');
        this.validTypeLocataireLabel = false;
        } else {
            this.validTypeLocataireLabel = true;
        }
    }
    public validateTypeLocataireStyle(){
        if (this.stringUtilService.isEmpty(this.item.style)) {
        this.errorMessages.push('Style non valide');
        this.validTypeLocataireStyle = false;
        } else {
            this.validTypeLocataireStyle = true;
        }
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



    get items(): Array<TypeLocataireDto> {
        return this.service.items;
    }

    set items(value: Array<TypeLocataireDto>) {
        this.service.items = value;
    }

    get item(): TypeLocataireDto {
        return this.service.item;
    }

    set item(value: TypeLocataireDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): TypeLocataireCriteria {
        return this.service.criteria;
    }

    set criteria(value: TypeLocataireCriteria) {
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
