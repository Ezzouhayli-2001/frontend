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
  selector: 'app-transaction-view-admin',
  standalone: false,
  templateUrl: './transaction-view-admin.component.html'
})
export class TransactionViewAdminComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;



    constructor(private service: TransactionAdminService, private typePaiementService: TypePaiementAdminService, private compteService: CompteAdminService, private modePaiementService: ModePaiementAdminService){
		this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
	}

    ngOnInit(): void {
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

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): TransactionCriteria {
        return this.service.criteria;
    }

    set criteria(value: TransactionCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }


}
