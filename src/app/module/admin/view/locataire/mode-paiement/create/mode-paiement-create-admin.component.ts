import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {ModePaiementAdminService} from 'src/app/shared/service/admin/locataire/ModePaiementAdmin.service';
import {ModePaiementDto} from 'src/app/shared/model/locataire/ModePaiement.model';
import {ModePaiementCriteria} from 'src/app/shared/criteria/locataire/ModePaiementCriteria.model';
@Component({
  selector: 'app-mode-paiement-create-admin',
  standalone: false,
  templateUrl: './mode-paiement-create-admin.component.html'
})
export class ModePaiementCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;



   private _validModePaiementCode = true;
   private _validModePaiementLabel = true;
   private _validModePaiementStyle = true;

	constructor(private service: ModePaiementAdminService , @Inject(PLATFORM_ID) private platformId? ) {
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
                this.item = new ModePaiementDto();
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
        this.validModePaiementCode = value;
        this.validModePaiementLabel = value;
        this.validModePaiementStyle = value;
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateModePaiementCode();
        this.validateModePaiementLabel();
        this.validateModePaiementStyle();
    }

    public validateModePaiementCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
        this.errorMessages.push('Code non valide');
        this.validModePaiementCode = false;
        } else {
            this.validModePaiementCode = true;
        }
    }
    public validateModePaiementLabel(){
        if (this.stringUtilService.isEmpty(this.item.label)) {
        this.errorMessages.push('Label non valide');
        this.validModePaiementLabel = false;
        } else {
            this.validModePaiementLabel = true;
        }
    }
    public validateModePaiementStyle(){
        if (this.stringUtilService.isEmpty(this.item.style)) {
        this.errorMessages.push('Style non valide');
        this.validModePaiementStyle = false;
        } else {
            this.validModePaiementStyle = true;
        }
    }






    get validModePaiementCode(): boolean {
        return this._validModePaiementCode;
    }

    set validModePaiementCode(value: boolean) {
         this._validModePaiementCode = value;
    }
    get validModePaiementLabel(): boolean {
        return this._validModePaiementLabel;
    }

    set validModePaiementLabel(value: boolean) {
         this._validModePaiementLabel = value;
    }
    get validModePaiementStyle(): boolean {
        return this._validModePaiementStyle;
    }

    set validModePaiementStyle(value: boolean) {
         this._validModePaiementStyle = value;
    }



    get items(): Array<ModePaiementDto> {
        return this.service.items;
    }

    set items(value: Array<ModePaiementDto>) {
        this.service.items = value;
    }

    get item(): ModePaiementDto {
        return this.service.item;
    }

    set item(value: ModePaiementDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): ModePaiementCriteria {
        return this.service.criteria;
    }

    set criteria(value: ModePaiementCriteria) {
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
