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


import {AvoirAdminService} from 'src/app/shared/service/admin/locataire/AvoirAdmin.service';
import {AvoirDto} from 'src/app/shared/model/locataire/Avoir.model';
import {AvoirCriteria} from 'src/app/shared/criteria/locataire/AvoirCriteria.model';

import {LocationDto} from 'src/app/shared/model/locataire/Location.model';
import {LocationAdminService} from 'src/app/shared/service/admin/locataire/LocationAdmin.service';
@Component({
  selector: 'app-avoir-view-admin',
  standalone: false,
  templateUrl: './avoir-view-admin.component.html',
    styleUrls: ['./avoir-view-admin.component.scss']
})
export class AvoirViewAdminComponent implements OnInit {


	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;



    constructor(private service: AvoirAdminService, private locationService: LocationAdminService){
		this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
	}

    ngOnInit(): void {
    }


    get location(): LocationDto {
        return this.locationService.item;
    }
    set location(value: LocationDto) {
        this.locationService.item = value;
    }
    get locations(): Array<LocationDto> {
        return this.locationService.items;
    }
    set locations(value: Array<LocationDto>) {
        this.locationService.items = value;
    }

    public hideViewDialog() {
        this.item = new AvoirDto();
        this.viewDialog = false;
    }

    get items(): Array<AvoirDto> {
        return this.service.items;
    }

    set items(value: Array<AvoirDto>) {
        this.service.items = value;
    }

    get item(): AvoirDto {
        return this.service.item;
    }

    set item(value: AvoirDto) {
        this.service.item = value;
    }

    get viewDialog(): boolean {
        return this.service.viewDialog;
    }

    set viewDialog(value: boolean) {
        this.service.viewDialog = value;
    }

    get criteria(): AvoirCriteria {
        return this.service.criteria;
    }

    set criteria(value: AvoirCriteria) {
        this.service.criteria = value;
    }

    get dateFormat(){
        return environment.dateFormatView;
    }

    get dateFormatColumn(){
        return environment.dateFormatList;
    }


}
