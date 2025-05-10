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




import {CaisseAdminService} from 'src/app/shared/service/admin/finance/CaisseAdmin.service';
import {CaisseDto} from 'src/app/shared/model/finance/Caisse.model';
import {CaisseCriteria} from 'src/app/shared/criteria/finance/CaisseCriteria.model';
import {CompteDto} from "../../../../../../shared/model/finance/Compte.model";
import {CompteAdminService} from "../../../../../../shared/service/admin/finance/CompteAdmin.service";



@Component({
  selector: 'app-caisse-edit-admin',
  standalone: false,
  templateUrl: './caisse-edit-admin.component.html'
})
export class CaisseEditAdminComponent implements OnInit {

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



    private _validCaisseCode = true;
    private _validCaisseLibelle = true;




    constructor(
        private compteService: CompteAdminService,
        private service: CaisseAdminService , @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
    }


    public findPaginatedByCriteria() {
        this.service.findPaginatedByCriteria(this.criteria).subscribe(paginatedItems => {
            this.items = paginatedItems.list;
            this.compteService.findPaginatedByCriteria(this.compteService.criteria).subscribe((data) => {
                this.comptes = data.list.filter(compte => compte?.caisse?.libelle != null);
            });
        }, error => console.log(error));
    }

    get comptes(): Array<CompteDto> {
        return this.compteService.items;
    }

    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
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
            this.findPaginatedByCriteria();
            this.editDialog = false;
            this.submitted = false;
            this.item = new CaisseDto();
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.item = new CaisseDto();
        this.editDialog = false;
        this.setValidation(true);
    }





    public setValidation(value: boolean){
        this.validCaisseCode = value;
        this.validCaisseLibelle = value;
    }


    public validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateCaisseCode();
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

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
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


}
