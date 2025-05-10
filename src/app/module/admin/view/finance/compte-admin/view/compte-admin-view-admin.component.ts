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
  selector: 'app-compte-admin-view-admin',
  standalone: false,
  templateUrl: './compte-admin-view-admin.component.html'
})
export class CompteAdminViewAdminComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;


    comptes = new CompteDto();
    comptess: Array<CompteDto> = [];

    constructor(private service: CompteAdminAdminService, private compteService: CompteAdminService, private banqueService: BanqueAdminService){
		this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
	}

    ngOnInit(): void {
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

    public hideViewDialog() {
        this.viewDialog = false;
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

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): CompteAdminCriteria {
        return this.service.criteria;
    }

    set criteria(value: CompteAdminCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }


}
