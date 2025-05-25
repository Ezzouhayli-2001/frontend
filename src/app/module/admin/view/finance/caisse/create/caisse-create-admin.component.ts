import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {CaisseAdminService} from 'src/app/shared/service/admin/finance/CaisseAdmin.service';
import {CaisseDto} from 'src/app/shared/model/finance/Caisse.model';
import {CaisseCriteria} from 'src/app/shared/criteria/finance/CaisseCriteria.model';
@Component({
  selector: 'app-caisse-create-admin',
  standalone: false,
  templateUrl: './caisse-create-admin.component.html'
})
export class CaisseCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;



   private _validCaisseCode = true;
   private _validCaisseLibelle = true;

	constructor(private service: CaisseAdminService , @Inject(PLATFORM_ID) private platformId? ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.initCode();
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
               this.findPaginatedByCriteria();
                this.createDialog = false;
                this.submitted = false;
                this.item = new CaisseDto();
                this.messageService.add({severity: 'success', summary: '', detail: 'Caisse Cree avec Success'})
            } else {
                this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Element existant'});
            }

        }, error => {
            console.log(error);
            this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Une caisse existe déjà'});
        });
    }



    public hideCreateDialog() {
        this.createDialog = false;
        this.setValidation(true);
    }





    public  setValidation(value: boolean){
        this.validCaisseCode = value;
        this.validCaisseLibelle = value;
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
        //this.validateCaisseCode();
        this.validateCaisseLibelle();
    }

    public validateCaisseCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
        this.errorMessages.push('Code non valide');
        this.validCaisseCode = false;
        } else {
            this.validCaisseCode = true;
        }
    }
    public validateCaisseLibelle(){
        if (this.stringUtilService.isEmpty(this.item.libelle)) {
        this.errorMessages.push('Libelle non valide');
        this.validCaisseLibelle = false;
        } else {
            this.validCaisseLibelle = true;
        }
    }






    get validCaisseCode(): boolean {
        return this._validCaisseCode;
    }

    set validCaisseCode(value: boolean) {
         this._validCaisseCode = value;
    }
    get validCaisseLibelle(): boolean {
        return this._validCaisseLibelle;
    }

    set validCaisseLibelle(value: boolean) {
         this._validCaisseLibelle = value;
    }



    get items(): Array<CaisseDto> {
        return this.service.items;
    }

    set items(value: Array<CaisseDto>) {
        this.service.items = value;
    }

    get item(): CaisseDto {
        return this.service.item;
    }

    set item(value: CaisseDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): CaisseCriteria {
        return this.service.criteria;
    }

    set criteria(value: CaisseCriteria) {
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
        this.router.navigate(['/app/admin/finance/caisse/list']);
    }

    private initCode() {
        this.item.code = `CAISSE-${Math.random().toFixed(6).toString()}`
    }
}
