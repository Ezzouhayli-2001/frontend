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




import {BanqueAdminService} from 'src/app/shared/service/admin/finance/BanqueAdmin.service';
import {BanqueDto} from 'src/app/shared/model/finance/Banque.model';
import {BanqueCriteria} from 'src/app/shared/criteria/finance/BanqueCriteria.model';
import {CompteAdminService} from "../../../../../../shared/service/admin/finance/CompteAdmin.service";
import {CompteDto} from "../../../../../../shared/model/finance/Compte.model";



@Component({
  selector: 'app-banque-edit-admin',
  standalone: false,
  templateUrl: './banque-edit-admin.component.html'
})
export class BanqueEditAdminComponent implements OnInit {

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



    private _validBanqueCode = true;




    constructor(
        private compteService: CompteAdminService,
        private service: BanqueAdminService , @Inject(PLATFORM_ID) private platformId?) {
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

    public findPaginatedByCriteria() {
        this.service.findPaginatedByCriteria(this.criteria).subscribe(paginatedItems => {
            this.items = paginatedItems.list;
            this.compteService.findPaginatedByCriteria(this.compteService.criteria).subscribe((data) => {
                this.comptes = data.list.filter(compte => compte?.banque?.nom != null);
            });
        }, error => console.log(error));
    }

    get comptes(): Array<CompteDto> {
        return this.compteService.items;
    }

    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
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
            this.findPaginatedByCriteria();
            this.editDialog = false;
            this.submitted = false;
            this.item = new BanqueDto();
            this.messageService.add({severity: 'success', summary: '', detail: 'Banque a été modifiée avec succès'});
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.item = new BanqueDto();
        this.editDialog = false;
        this.setValidation(true);
    }





    public setValidation(value: boolean){
        this.validBanqueCode = value;
    }


    public validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateBanqueCode();
    }

    public validateBanqueCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
            this.errorMessages.push('Code non valide');
            this.validBanqueCode = false;
        } else {
            this.validBanqueCode = true;
        }
    }







    get validBanqueCode(): boolean {
        return this._validBanqueCode;
    }
    set validBanqueCode(value: boolean) {
        this._validBanqueCode = value;
    }


	get items(): Array<BanqueDto> {
        return this.service.items;
    }

    set items(value: Array<BanqueDto>) {
        this.service.items = value;
    }

    get item(): BanqueDto {
        return this.service.item;
    }

    set item(value: BanqueDto) {
        this.service.item = value;
    }

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
    }

    get criteria(): BanqueCriteria {
        return this.service.criteria;
    }

    set criteria(value: BanqueCriteria) {
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
