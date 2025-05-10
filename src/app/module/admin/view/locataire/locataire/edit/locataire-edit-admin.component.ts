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




import {LocataireAdminService} from 'src/app/shared/service/admin/locataire/LocataireAdmin.service';
import {LocataireDto} from 'src/app/shared/model/locataire/Locataire.model';
import {LocataireCriteria} from 'src/app/shared/criteria/locataire/LocataireCriteria.model';


import {TypeLocataireDto} from 'src/app/shared/model/locataire/TypeLocataire.model';
import {TypeLocataireAdminService} from 'src/app/shared/service/admin/locataire/TypeLocataireAdmin.service';

@Component({
  selector: 'app-locataire-edit-admin',
  standalone: false,
  templateUrl: './locataire-edit-admin.component.html'
})
export class LocataireEditAdminComponent implements OnInit {

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



    private _validLocataireCode = true;
    private _validLocataireLibelle = true;
    private _validLocataireNom = true;
    private _validLocatairePrenom = true;

    private _validTypeLocataireCode = true;
    private _validTypeLocataireLabel = true;
    private _validTypeLocataireStyle = true;



    constructor(private service: LocataireAdminService , private typeLocataireService: TypeLocataireAdminService, @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.typeLocataireService.findAll().subscribe((data) => this.typeLocataires = data);
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
            this.item = new LocataireDto();
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.item = new LocataireDto();
        this.editDialog = false;
        this.setValidation(true);
    }





    public setValidation(value: boolean){
        this.validLocataireCode = value;
        this.validLocataireLibelle = value;
        this.validLocataireNom = value;
        this.validLocatairePrenom = value;
    }


    public validateForm(): void{
        this.errorMessages = new Array<string>();
        this.validateLocataireCode();
        this.validateLocataireLibelle();
        this.validateLocataireNom();
        this.validateLocatairePrenom();
    }

    public validateLocataireCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
            this.errorMessages.push('Code non valide');
            this.validLocataireCode = false;
        } else {
            this.validLocataireCode = true;
        }
    }

    public validateLocataireLibelle(){
        if (this.stringUtilService.isEmpty(this.item.nom)) {
            this.errorMessages.push('Libelle non valide');
            this.validLocataireLibelle = false;
        } else {
            this.validLocataireLibelle = true;
        }
    }

    public validateLocataireNom(){
        if (this.stringUtilService.isEmpty(this.item.nom)) {
            this.errorMessages.push('Nom non valide');
            this.validLocataireNom = false;
        } else {
            this.validLocataireNom = true;
        }
    }

    public validateLocatairePrenom(){
        if (this.stringUtilService.isEmpty(this.item.prenom)) {
            this.errorMessages.push('Prenom non valide');
            this.validLocatairePrenom = false;
        } else {
            this.validLocatairePrenom = true;
        }
    }




   public async openCreateTypeLocataire(typeLocataire: string) {
        const isPermistted = await this.roleService.isPermitted('TypeLocataire', 'edit');
        if (isPermistted) {
             this.typeLocataire = new TypeLocataireDto();
             this.createTypeLocataireDialog = true;
        }else {
             this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }

    get typeLocataire(): TypeLocataireDto {
        return this.typeLocataireService.item;
    }
    set typeLocataire(value: TypeLocataireDto) {
        this.typeLocataireService.item = value;
    }
    get typeLocataires(): Array<TypeLocataireDto> {
        return this.typeLocataireService.items;
    }
    set typeLocataires(value: Array<TypeLocataireDto>) {
        this.typeLocataireService.items = value;
    }
    get createTypeLocataireDialog(): boolean {
        return this.typeLocataireService.createDialog;
    }
    set createTypeLocataireDialog(value: boolean) {
        this.typeLocataireService.createDialog= value;
    }


    get validLocataireCode(): boolean {
        return this._validLocataireCode;
    }
    set validLocataireCode(value: boolean) {
        this._validLocataireCode = value;
    }
    get validLocataireLibelle(): boolean {
        return this._validLocataireLibelle;
    }
    set validLocataireLibelle(value: boolean) {
        this._validLocataireLibelle = value;
    }
    get validLocataireNom(): boolean {
        return this._validLocataireNom;
    }
    set validLocataireNom(value: boolean) {
        this._validLocataireNom = value;
    }
    get validLocatairePrenom(): boolean {
        return this._validLocatairePrenom;
    }
    set validLocatairePrenom(value: boolean) {
        this._validLocatairePrenom = value;
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

	get items(): Array<LocataireDto> {
        return this.service.items;
    }

    set items(value: Array<LocataireDto>) {
        this.service.items = value;
    }

    get item(): LocataireDto {
        return this.service.item;
    }

    set item(value: LocataireDto) {
        this.service.item = value;
    }

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
    }

    get criteria(): LocataireCriteria {
        return this.service.criteria;
    }

    set criteria(value: LocataireCriteria) {
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
