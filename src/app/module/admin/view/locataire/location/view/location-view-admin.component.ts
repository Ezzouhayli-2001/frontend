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


import {LocationAdminService} from 'src/app/shared/service/admin/locataire/LocationAdmin.service';
import {LocationDto} from 'src/app/shared/model/locataire/Location.model';
import {LocationCriteria} from 'src/app/shared/criteria/locataire/LocationCriteria.model';

import {TransactionDto} from 'src/app/shared/model/locataire/Transaction.model';
import {TransactionAdminService} from 'src/app/shared/service/admin/locataire/TransactionAdmin.service';
import {TypePaiementDto} from 'src/app/shared/model/locataire/TypePaiement.model';
import {TypePaiementAdminService} from 'src/app/shared/service/admin/locataire/TypePaiementAdmin.service';
import {CompteDto} from 'src/app/shared/model/finance/Compte.model';
import {CompteAdminService} from 'src/app/shared/service/admin/finance/CompteAdmin.service';
import {CompteLocataireDto} from 'src/app/shared/model/finance/CompteLocataire.model';
import {CompteLocataireAdminService} from 'src/app/shared/service/admin/finance/CompteLocataireAdmin.service';
import {TypeLocataireDto} from 'src/app/shared/model/locataire/TypeLocataire.model';
import {TypeLocataireAdminService} from 'src/app/shared/service/admin/locataire/TypeLocataireAdmin.service';
import {LocataireDto} from 'src/app/shared/model/locataire/Locataire.model';
import {LocataireAdminService} from 'src/app/shared/service/admin/locataire/LocataireAdmin.service';
@Component({
  selector: 'app-location-view-admin',
  standalone: false,
  templateUrl: './location-view-admin.component.html'
})
export class LocationViewAdminComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;



    constructor(private service: LocationAdminService, private transactionService: TransactionAdminService, private typePaiementService: TypePaiementAdminService, private compteService: CompteAdminService, private compteLocataireService: CompteLocataireAdminService, private typeLocataireService: TypeLocataireAdminService, private locataireService: LocataireAdminService){
		this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
	}

    ngOnInit(): void {
    }


    get compteLocataire(): CompteLocataireDto {
        return this.compteLocataireService.item;
    }
    set compteLocataire(value: CompteLocataireDto) {
        this.compteLocataireService.item = value;
    }
    get compteLocataires(): Array<CompteLocataireDto> {
        return this.compteLocataireService.items;
    }
    set compteLocataires(value: Array<CompteLocataireDto>) {
        this.compteLocataireService.items = value;
    }
    get transaction(): TransactionDto {
        return this.transactionService.item;
    }
    set transaction(value: TransactionDto) {
        this.transactionService.item = value;
    }
    get transactions(): Array<TransactionDto> {
        return this.transactionService.items;
    }
    set transactions(value: Array<TransactionDto>) {
        this.transactionService.items = value;
    }
    get locataire(): LocataireDto {
        return this.locataireService.item;
    }
    set locataire(value: LocataireDto) {
        this.locataireService.item = value;
    }
    get locataires(): Array<LocataireDto> {
        return this.locataireService.items;
    }
    set locataires(value: Array<LocataireDto>) {
        this.locataireService.items = value;
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
    get compte(): CompteDto {
        return this.compteService.item;
    }
    set compte(value: CompteDto) {
        this.compteService.item = value;
    }
    get comptes(): Array<CompteDto> {
        return this.compteService.items;
    }
    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
    }

    public hideViewDialog() {
        this.viewDialog = false;
    }

    get items(): Array<LocationDto> {
        return this.service.items;
    }

    set items(value: Array<LocationDto>) {
        this.service.items = value;
    }

    get item(): LocationDto {
        return this.service.item;
    }

    set item(value: LocationDto) {
        this.service.item = value;
    }

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): LocationCriteria {
        return this.service.criteria;
    }

    set criteria(value: LocationCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }


}
