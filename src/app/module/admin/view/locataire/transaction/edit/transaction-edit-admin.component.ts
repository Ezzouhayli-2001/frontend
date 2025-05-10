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




import {TransactionAdminService} from 'src/app/shared/service/admin/locataire/TransactionAdmin.service';
import {TransactionDto} from 'src/app/shared/model/locataire/Transaction.model';
import {TransactionCriteria} from 'src/app/shared/criteria/locataire/TransactionCriteria.model';


import {TypePaiementDto} from 'src/app/shared/model/locataire/TypePaiement.model';
import {TypePaiementAdminService} from 'src/app/shared/service/admin/locataire/TypePaiementAdmin.service';
import {CompteDto} from 'src/app/shared/model/finance/Compte.model';
import {CompteAdminService} from 'src/app/shared/service/admin/finance/CompteAdmin.service';
import {ModePaiementDto} from 'src/app/shared/model/locataire/ModePaiement.model';
import {ModePaiementAdminService} from 'src/app/shared/service/admin/locataire/ModePaiementAdmin.service';

@Component({
  selector: 'app-transaction-edit-admin',
  standalone: false,
  templateUrl: './transaction-edit-admin.component.html'
})
export class TransactionEditAdminComponent implements OnInit {

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




    private _validModePaiementCode = true;
    private _validModePaiementLabel = true;
    private _validModePaiementStyle = true;
    private _validTypePaiementCode = true;
    private _validTypePaiementLabel = true;
    private _validTypePaiementStyle = true;



    constructor(private service: TransactionAdminService , private typePaiementService: TypePaiementAdminService, private compteService: CompteAdminService, private modePaiementService: ModePaiementAdminService, @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.modePaiementService.findAll().subscribe((data) => this.modePaiements = data);
        this.typePaiementService.findAll().subscribe((data) => this.typePaiements = data);
        this.compteService.findAll().subscribe((data) => this.compteSources = data);
        this.compteService.findAll().subscribe((data) => this.compteDestinations = data);
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
            this.item = new TransactionDto();
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.editDialog = false;
        this.setValidation(true);
    }





    public setValidation(value: boolean){
    }


    public validateForm(): void{
        this.errorMessages = new Array<string>();
    }




   public async openCreateTypePaiement(typePaiement: string) {
        const isPermistted = await this.roleService.isPermitted('TypePaiement', 'edit');
        if (isPermistted) {
             this.typePaiement = new TypePaiementDto();
             this.createTypePaiementDialog = true;
        }else {
             this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }
   public async openCreateModePaiement(modePaiement: string) {
        const isPermistted = await this.roleService.isPermitted('ModePaiement', 'edit');
        if (isPermistted) {
             this.modePaiement = new ModePaiementDto();
             this.createModePaiementDialog = true;
        }else {
             this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
    }

    get compteSource(): CompteDto {
        return this.compteService.item;
    }
    set compteSource(value: CompteDto) {
        this.compteService.item = value;
    }
    get compteSources(): Array<CompteDto> {
        return this.compteService.items;
    }
    set compteSources(value: Array<CompteDto>) {
        this.compteService.items = value;
    }
    get createCompteSourceDialog(): boolean {
        return this.compteService.createDialog;
    }
    set createCompteSourceDialog(value: boolean) {
        this.compteService.createDialog= value;
    }
    get typePaiement(): TypePaiementDto {
        return this.typePaiementService.item;
    }
    set typePaiement(value: TypePaiementDto) {
        this.typePaiementService.item = value;
    }
    get typePaiements(): Array<TypePaiementDto> {
        return this.typePaiementService.items;
    }
    set typePaiements(value: Array<TypePaiementDto>) {
        this.typePaiementService.items = value;
    }
    get createTypePaiementDialog(): boolean {
        return this.typePaiementService.createDialog;
    }
    set createTypePaiementDialog(value: boolean) {
        this.typePaiementService.createDialog= value;
    }
    get compteDestination(): CompteDto {
        return this.compteService.item;
    }
    set compteDestination(value: CompteDto) {
        this.compteService.item = value;
    }
    get compteDestinations(): Array<CompteDto> {
        return this.compteService.items;
    }
    set compteDestinations(value: Array<CompteDto>) {
        this.compteService.items = value;
    }
    get createCompteDestinationDialog(): boolean {
        return this.compteService.createDialog;
    }
    set createCompteDestinationDialog(value: boolean) {
        this.compteService.createDialog= value;
    }
    get modePaiement(): ModePaiementDto {
        return this.modePaiementService.item;
    }
    set modePaiement(value: ModePaiementDto) {
        this.modePaiementService.item = value;
    }
    get modePaiements(): Array<ModePaiementDto> {
        return this.modePaiementService.items;
    }
    set modePaiements(value: Array<ModePaiementDto>) {
        this.modePaiementService.items = value;
    }
    get createModePaiementDialog(): boolean {
        return this.modePaiementService.createDialog;
    }
    set createModePaiementDialog(value: boolean) {
        this.modePaiementService.createDialog= value;
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

	get items(): Array<TransactionDto> {
        return this.service.items;
    }

    set items(value: Array<TransactionDto>) {
        this.service.items = value;
    }

    get item(): TransactionDto {
        return this.service.item;
    }

    set item(value: TransactionDto) {
        this.service.item = value;
    }

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
    }

    get criteria(): TransactionCriteria {
        return this.service.criteria;
    }

    set criteria(value: TransactionCriteria) {
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
