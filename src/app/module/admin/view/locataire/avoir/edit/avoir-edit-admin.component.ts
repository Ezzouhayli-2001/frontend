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




import {AvoirAdminService} from 'src/app/shared/service/admin/locataire/AvoirAdmin.service';
import {AvoirDto} from 'src/app/shared/model/locataire/Avoir.model';
import {AvoirCriteria} from 'src/app/shared/criteria/locataire/AvoirCriteria.model';


import {LocationDto} from 'src/app/shared/model/locataire/Location.model';
import {LocationAdminService} from 'src/app/shared/service/admin/locataire/LocationAdmin.service';

@Component({
  selector: 'app-avoir-edit-admin',
  standalone: false,
  templateUrl: './avoir-edit-admin.component.html'
})
export class AvoirEditAdminComponent implements OnInit {

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




    private _validLocationCode = true;



    constructor(private service: AvoirAdminService , private locationService: LocationAdminService, @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.locationService.findAll().subscribe((data) => this.locations = data);
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
            this.item = new AvoirDto();
        } , error =>{
            console.log(error);
        });
    }

    public hideEditDialog() {
        this.item = new AvoirDto();
        this.editDialog = false;
        this.setValidation(true);
    }





    public setValidation(value: boolean){
    }


    public validateForm(): void{
        this.errorMessages = new Array<string>();
    }




   public async openCreateLocation(location: string) {
        const isPermistted = await this.roleService.isPermitted('Location', 'edit');
        if (isPermistted) {
             this.location = new LocationDto();
             this.createLocationDialog = true;
        }else {
             this.messageService.add({
                severity: 'error', summary: 'erreur', detail: 'problème de permission'
            });
        }
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
    get createLocationDialog(): boolean {
        return this.locationService.createDialog;
    }
    set createLocationDialog(value: boolean) {
        this.locationService.createDialog= value;
    }



    get validLocationCode(): boolean {
        return this._validLocationCode;
    }
    set validLocationCode(value: boolean) {
        this._validLocationCode = value;
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

    get editDialog(): boolean {
        return this.service.editDialog;
    }

    set editDialog(value: boolean) {
        this.service.editDialog = value;
    }

    get criteria(): AvoirCriteria {
        return this.service.criteria;
    }

    set criteria(value: AvoirCriteria) {
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
