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




import {CompteAdminAdminService} from 'src/app/shared/service/admin/finance/CompteAdminAdmin.service';
import {CompteAdminDto} from 'src/app/shared/model/finance/CompteAdmin.model';
import {CompteAdminCriteria} from 'src/app/shared/criteria/finance/CompteAdminCriteria.model';


import {TransactionDto} from 'src/app/shared/model/locataire/Transaction.model';
import {TransactionAdminService} from 'src/app/shared/service/admin/locataire/TransactionAdmin.service';
import {CompteDto} from 'src/app/shared/model/finance/Compte.model';
import {CompteAdminService} from 'src/app/shared/service/admin/finance/CompteAdmin.service';
import {BanqueDto} from 'src/app/shared/model/finance/Banque.model';
import {BanqueAdminService} from 'src/app/shared/service/admin/finance/BanqueAdmin.service';

@Component({
  selector: 'app-compte-admin-edit-admin',
  standalone: false,
  templateUrl: './compte-admin-edit-admin.component.html'
})
export class CompteAdminEditAdminComponent implements OnInit {

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

    protected comptesIndex = -1;

    private _comptesElement = new CompteDto();





    constructor(private service: CompteAdminAdminService , private compteService: CompteAdminService, private banqueService: BanqueAdminService, @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.comptesElement.banque = new BanqueDto();
        this.banqueService.findAll().subscribe((data) => this.banques = data);

    }

    public prepareEdit() {
        this.item.dateCreation = this.service.format(this.item.dateCreation);
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
            this.item = new CompteAdminDto();
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.editDialog = false;
        this.setValidation(true);
    }





    public validateComptes(){
        this.errorMessages = new Array();
    }

    public setValidation(value: boolean){
    }

    public addComptes() {
        if( this.item.comptes == null )
            this.item.comptes = new Array<CompteDto>();

       this.validateComptes();

       if (this.errorMessages.length === 0) {
            if (this.comptesIndex == -1){
                this.item.comptes.push({... this.comptesElement});
            }else {
                this.item.comptes[this.comptesIndex] =this.comptesElement;
            }
              this.comptesElement = new CompteDto();
              this.comptesIndex = -1;
       }else{
           this.messageService.add({severity: 'error',summary: 'Erreurs',detail: 'Merci de corrigé les erreurs suivant : ' + this.errorMessages});
       }
    }

    public deleteComptes(p: CompteDto, index: number) {
        this.item.comptes.splice(index, 1);
    }

    public editComptes(p: CompteDto, index: number) {
        this.comptesElement = {... p};
        this.comptesIndex = index;
        this.activeTab = 0;
    }

    public validateForm(): void{
        this.errorMessages = new Array<string>();
    }




   public async openCreateBanque(banque: string) {
        const isPermistted = await this.roleService.isPermitted('Banque', 'edit');
        if (isPermistted) {
             this.banque = new BanqueDto();
             this.createBanqueDialog = true;
        }else {
             this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }

    get banque(): BanqueDto {
        return this.banqueService.item;
    }
    set banque(value: BanqueDto) {
        this.banqueService.item = value;
    }
    get banques(): Array<BanqueDto> {
        return this.banqueService.items;
    }
    set banques(value: Array<BanqueDto>) {
        this.banqueService.items = value;
    }
    get createBanqueDialog(): boolean {
        return this.banqueService.createDialog;
    }
    set createBanqueDialog(value: boolean) {
        this.banqueService.createDialog= value;
    }

    get comptesElement(): CompteDto {
        if( this._comptesElement == null )
            this._comptesElement = new CompteDto();
         return this._comptesElement;
    }

    set comptesElement(value: CompteDto) {
        this._comptesElement = value;
    }



	get items(): Array<CompteAdminDto> {
        return this.service.items;
    }

    set items(value: Array<CompteAdminDto>) {
        this.service.items = value;
    }

    get item(): CompteAdminDto {
        return this.service.item;
    }

    set item(value: CompteAdminDto) {
        this.service.item = value;
    }

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
    }

    get criteria(): CompteAdminCriteria {
        return this.service.criteria;
    }

    set criteria(value: CompteAdminCriteria) {
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
