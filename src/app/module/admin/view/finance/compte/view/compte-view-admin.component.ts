import {Component, OnInit} from '@angular/core';


import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {AbstractService} from 'src/app/zynerator/service/AbstractService';
import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';
import {ConfirmationService, MessageService,MenuItem} from 'primeng/api';
import {FileTempDto} from 'src/app/zynerator/dto/FileTempDto.model';


import {CompteAdminService} from 'src/app/shared/service/admin/finance/CompteAdmin.service';
import {CompteDto} from 'src/app/shared/model/finance/Compte.model';
import {CompteCriteria} from 'src/app/shared/criteria/finance/CompteCriteria.model';

import {TransactionDto} from 'src/app/shared/model/locataire/Transaction.model';
import {TransactionAdminService} from 'src/app/shared/service/admin/locataire/TransactionAdmin.service';
import {TypePaiementDto} from 'src/app/shared/model/finance/TypePaiement.model';
import {TypePaiementAdminService} from 'src/app/shared/service/admin/finance/TypePaiementAdmin.service';
import {BanqueDto} from 'src/app/shared/model/finance/Banque.model';
import {BanqueAdminService} from 'src/app/shared/service/admin/finance/BanqueAdmin.service';
import {ModePaiementDto} from 'src/app/shared/model/finance/ModePaiement.model';
import {ModePaiementAdminService} from 'src/app/shared/service/admin/finance/ModePaiementAdmin.service';
import {TypeTransactiontDto} from 'src/app/shared/model/locataire/TypeTransactiont.model';
import {TypeTransactiontAdminService} from 'src/app/shared/service/admin/locataire/TypeTransactiontAdmin.service';
@Component({
  selector: 'app-compte-view-admin',
  standalone: false,
  templateUrl: './compte-view-admin.component.html'
})
export class CompteViewAdminComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;


    transactions = new TransactionDto();
    transactionss: Array<TransactionDto> = [];

    constructor(private service: CompteAdminService, private transactionService: TransactionAdminService, private typePaiementService: TypePaiementAdminService, private banqueService: BanqueAdminService, private modePaiementService: ModePaiementAdminService, private typeTransactiontService: TypeTransactiontAdminService){
		this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
	}

    ngOnInit(): void {
    }


    get typeTransaction(): TypeTransactiontDto {
        return this.typeTransactiontService.item;
    }
    set typeTransaction(value: TypeTransactiontDto) {
        this.typeTransactiontService.item = value;
    }
    get typeTransactions(): Array<TypeTransactiontDto> {
        return this.typeTransactiontService.items;
    }
    set typeTransactions(value: Array<TypeTransactiontDto>) {
        this.typeTransactiontService.items = value;
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

    public hideViewDialog() {
        this.viewDialog = false;
    }

    get items(): Array<CompteDto> {
        return this.service.items;
    }

    set items(value: Array<CompteDto>) {
        this.service.items = value;
    }

    get item(): CompteDto {
        return this.service.item;
    }

    set item(value: CompteDto) {
        this.service.item = value;
    }

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): CompteCriteria {
        return this.service.criteria;
    }

    set criteria(value: CompteCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }


}
