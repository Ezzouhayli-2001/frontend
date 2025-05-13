import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {LocalAdminService} from 'src/app/shared/service/admin/locaux/LocalAdmin.service';
import {LocalDto} from 'src/app/shared/model/locaux/Local.model';
import {LocalCriteria} from 'src/app/shared/criteria/locaux/LocalCriteria.model';
import {StatutLocalDto} from 'src/app/shared/model/locataire/StatutLocal.model';
import {StatutLocalAdminService} from 'src/app/shared/service/admin/locataire/StatutLocalAdmin.service';
import {TypeLocataireDto} from 'src/app/shared/model/locataire/TypeLocataire.model';
import {TypeLocataireAdminService} from 'src/app/shared/service/admin/locataire/TypeLocataireAdmin.service';
import {LocataireDto} from 'src/app/shared/model/locataire/Locataire.model';
import {LocataireAdminService} from 'src/app/shared/service/admin/locataire/LocataireAdmin.service';
import {animate, style, transition, trigger} from "@angular/animations";
import {TypeLocalAdminService} from "../../../../../../shared/service/admin/locaux/TypeLocalAdmin.service";
import {TypeLocalDto} from "../../../../../../shared/model/locaux/TypeLocal.model";
@Component({
    selector: 'app-local-create-admin',
    standalone: false,
    templateUrl: './local-create-admin.component.html',
    styleUrls: ['./local-create-admin.component.scss'],
    animations: [
        trigger("pageAnimation", [
            transition(":enter", [style({ opacity: 0 }), animate("500ms ease-out", style({ opacity: 1 }))]),
        ]),
        trigger("cardAnimation", [
            transition(":enter", [
                style({ opacity: 0, transform: "translateY(20px)" }),
                animate("600ms 300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
            ]),
        ]),
        trigger("formControlAnimation", [
            transition(
                ":enter",
                [
                    style({ opacity: 0, transform: "translateY(15px)" }),
                    animate("500ms {{delay}} ease-out", style({ opacity: 1, transform: "translateY(0)" })),
                ],
                { params: { delay: "0ms" } },
            ),
        ]),
        trigger("footerAnimation", [
            transition(":enter", [
                style({ opacity: 0, transform: "translateY(20px)" }),
                animate("600ms 600ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
            ]),
        ]),
    ],
})
export class LocalCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;



   private _validLocalCode = true;
   private _validLocalLabel = true;
    private _validTypeLocataireCode = true;
    private _validTypeLocataireLabel = true;
    private _validTypeLocataireStyle = true;
    private _validLocataireCode = true;
    private _validLocataireLibelle = true;
    private _validLocataireNom = true;
    private _validLocatairePrenom = true;
    private _validStatutLocalCode = true;
    private _validStatutLocalLabel = true;
    private _validStatutLocalStyle = true;


    saving = false
    isEditMode = false

	constructor(private service: LocalAdminService , private statutLocalService: StatutLocalAdminService,private typeLocalService: TypeLocalAdminService, private typeLocataireService: TypeLocataireAdminService, private locataireService: LocataireAdminService, @Inject(PLATFORM_ID) private platformId? ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.typeLocataireService.findAll().subscribe((data) => this.typeLocataires = data);
        this.locataireService.findAll().subscribe((data) => this.locataires = data);
        this.statutLocalService.findAll().subscribe((data) => this.statutLocals = data);
        this.typeLocalService.findAll().subscribe((data) => this.typeLocals = data);
        this.checkIfEditMode()
    }




    checkIfEditMode(): void {
        // In a real application, you would check if an ID is present in the route
        // For this example, we'll assume it's a new local
        this.isEditMode = false
    }

    getStatusIconClass(status: any): string {
        if (!status || !status.color) return ""

        switch (status.color) {
            case "success":
                return "status-success"
            case "warning":
                return "status-warning"
            case "info":
                return "status-info"
            case "danger":
                return "status-danger"
            default:
                return ""
        }
    }


    goBack(): void {
    }

    public save(): void {
        this.submitted = true;
        this.saving = true
        this.validateForm();
        if (this.errorMessages.length === 0) {
            this.saveWithShowOption(false);
        } else {
            this.messageService.add({severity: 'error',summary: 'Erreurs',detail: 'Merci de corrigé les erreurs sur le formulaire'});
        }
    }

    public saveWithShowOption(showList: boolean) {
        this.item.code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 6);
        this.service.save().subscribe(item => {
            if (item != null) {
                this.findPaginatedByCriteria();
                this.createDialog = false;
                this.submitted = false;
                this.saving = false
                this.goBack()
                this.item = new LocalDto();
            } else {
                this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Element existant'});
            }
            this.messageService.add({severity: 'success', summary: '', detail: 'Local a été créé avec succès'});
        }, error => {
            console.log(error);
        });
    }


    public hideCreateDialog() {
        this.createDialog = false;
        this.setValidation(true);
        this.goBack();
    }





    public  setValidation(value: boolean){
        this.validLocalCode = value;
        this.validLocalLabel = value;
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
       // this.validateLocalCode();

        this.validateLocalLabel();
    }

    public validateLocalCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
        this.errorMessages.push('Code non valide');
        this.validLocalCode = false;
        } else {
            this.validLocalCode = true;
        }
    }
    public validateLocalLabel(){
        if (this.stringUtilService.isEmpty(this.item.label)) {
        this.errorMessages.push('Label non valide');
        this.validLocalLabel = false;
        } else {
            this.validLocalLabel = true;
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
    get createLocataireDialog(): boolean {
        return this.locataireService.createDialog;
    }
    set createLocataireDialog(value: boolean) {
        this.locataireService.createDialog= value;
    }
    get statutLocal(): StatutLocalDto {
        return this.statutLocalService.item;
    }
    set statutLocal(value: StatutLocalDto) {
        this.statutLocalService.item = value;
    }
    get statutLocals(): Array<StatutLocalDto> {
        return this.statutLocalService.items;
    }
    set statutLocals(value: Array<StatutLocalDto>) {
        this.statutLocalService.items = value;
    }
    get createStatutLocalDialog(): boolean {
        return this.statutLocalService.createDialog;
    }
    set createStatutLocalDialog(value: boolean) {
        this.statutLocalService.createDialog= value;
    }


    get typeLocals(): Array<TypeLocalDto> {
        return this.typeLocalService.items;
    }
    set typeLocals(value: Array<TypeLocalDto>) {
        this.typeLocalService.items = value;
    }
    get validLocalCode(): boolean {
        return this._validLocalCode;
    }

    set validLocalCode(value: boolean) {
         this._validLocalCode = value;
    }
    get validLocalLabel(): boolean {
        return this._validLocalLabel;
    }

    set validLocalLabel(value: boolean) {
         this._validLocalLabel = value;
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
    get validStatutLocalCode(): boolean {
        return this._validStatutLocalCode;
    }
    set validStatutLocalCode(value: boolean) {
        this._validStatutLocalCode = value;
    }
    get validStatutLocalLabel(): boolean {
        return this._validStatutLocalLabel;
    }
    set validStatutLocalLabel(value: boolean) {
        this._validStatutLocalLabel = value;
    }
    get validStatutLocalStyle(): boolean {
        return this._validStatutLocalStyle;
    }
    set validStatutLocalStyle(value: boolean) {
        this._validStatutLocalStyle = value;
    }


    get items(): Array<LocalDto> {
        return this.service.items;
    }

    set items(value: Array<LocalDto>) {
        this.service.items = value;
    }

    get item(): LocalDto {
        return this.service.item;
    }

    set item(value: LocalDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): LocalCriteria {
        return this.service.criteria;
    }

    set criteria(value: LocalCriteria) {
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

    private findPaginatedByCriteria() {
        this.service.findPaginatedByCriteria(this.criteria).subscribe(paginatedItems => {
            this.items = paginatedItems.list;
        }, error => console.log(error));
    }

    cancel() {
        this.navigateToList();
    }

    navigateToList() {
        // Naviguer vers la liste des locaux
        this.router.navigate(['/app/admin/locaux/local/list']);
    }
}
