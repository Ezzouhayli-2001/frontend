import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {ChargeAdminService} from 'src/app/shared/service/admin/finance/ChargeAdmin.service';
import {ChargeDto} from 'src/app/shared/model/finance/Charge.model';
import {ChargeCriteria} from 'src/app/shared/criteria/finance/ChargeCriteria.model';
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {LocalDto} from "../../../../../../shared/model/locaux/Local.model";
import {TypeChargeDto} from 'src/app/shared/model/finance/TypeCharge.model';
import {TypeChargeAdminService} from 'src/app/shared/service/admin/finance/TypeChargeAdmin.service';
import {CompteDto} from "../../../../../../shared/model/finance/Compte.model";
import {BanqueAdminService} from "../../../../../../shared/service/admin/finance/BanqueAdmin.service";
import {CompteAdminService} from "../../../../../../shared/service/admin/finance/CompteAdmin.service";
import {CaisseAdminService} from "../../../../../../shared/service/admin/finance/CaisseAdmin.service";
import {ModePaiementAdminService} from "../../../../../../shared/service/admin/finance/ModePaiementAdmin.service";
import {ModePaiementDto} from "../../../../../../shared/model/finance/ModePaiement.model";
import {CompteChargeAdminService} from "../../../../../../shared/service/admin/finance/CompteChargeAdmin.service";
import {CompteChargeDto} from "../../../../../../shared/model/finance/CompteCharge.model";
@Component({
  selector: 'app-charge-create-admin',
  standalone: false,
  templateUrl: './charge-create-admin.component.html'
})
export class ChargeCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;



   private _validChargeCode = true;
   private _validChargeLabel = true;
    private _validTypeChargeCode = true;
    private _validTypeChargeStyle = true;
    private _validLocalCode = true;

	constructor(private service: ChargeAdminService ,
                private banqueService: BanqueAdminService,
                private compteService: CompteAdminService,
                private compteChargeService: CompteChargeAdminService,
                private modePaiementService: ModePaiementAdminService,
                private caisseService: CaisseAdminService,
                private localService: LocalAdminService, private typeChargeService: TypeChargeAdminService, @Inject(PLATFORM_ID) private platformId? ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.typeChargeService.findAll().subscribe((data) => this.typeCharges = data);
        this.localService.findAll().subscribe((data) => this.locals = data);
        this.banqueService.findPaginatedByCriteria(this.banqueService.criteria).subscribe((data) => {
            this.banqueService.items = data.list;
        });
        this.caisseService.findPaginatedByCriteria(this.caisseService.criteria).subscribe((data) => {
            this.caisseService.items = data.list;
        });
        this.compteService.findPaginatedByCriteria(this.compteService.criteria).subscribe((data) => {
            this.comptes = data.list.filter(e=>e.code!="CHARGE");
        });
        this.modePaiementService.findPaginatedByCriteria(this.modePaiementService.criteria).subscribe((data) => {
            this.modePaiementService.items = data.list;
        });
        this.compteChargeService.findPaginatedByCriteria(this.compteChargeService.criteria).subscribe((data) => {
            this.compteCharges = data.list.filter(e=>e.code!="CHARGE");
        });
        this.initCode();
    }

    public initCode(): void {
        const timestamp = Date.now(); // nombre de millisecondes depuis 1970
        this.item.code = `CHARGE-${timestamp}`;
    }



    public save(): void {
        this.submitted = true;
        this.item.local = this.item.compteCharge.local;
        this.validateForm();
        if (this.errorMessages.length === 0) {
            this.saveWithShowOption(false);
        } else {
            this.messageService.add({severity: 'error',summary: 'Erreurs',detail: 'Merci de corrigé les erreurs sur le formulaire'});
        }
    }

    public saveWithShowOption(showList: boolean) {
        this.service.save().subscribe(item => {
            if (item != null) {
                this.findPaginatedByCriteria();
                this.createDialog = false;
                this.submitted = false;
                this.item = new ChargeDto();

            } else {
                this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Element existant'});
            }

        }, error => {
            console.log(error);
        });
    }


    public hideCreateDialog() {
        this.createDialog = false;
        this.setValidation(true);
    }

    get comptes(): Array<CompteDto> {
            return this.compteService.items;
    }

    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
    }




    public  setValidation(value: boolean){
        this.validChargeCode = value;
        this.validChargeLabel = value;
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
    }

    public validateChargeCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
        this.errorMessages.push('Code non valide');
        this.validChargeCode = false;
        } else {
            this.validChargeCode = true;
        }
    }
    public validateChargeLabel(){
        if (this.stringUtilService.isEmpty(this.item.label)) {
        this.errorMessages.push('Label non valide');
        this.validChargeLabel = false;
        } else {
            this.validChargeLabel = true;
        }
    }


    public async openCreateTypeCharge(typeCharge: string) {
    const isPermistted = await this.roleService.isPermitted('TypeCharge', 'add');
    if(isPermistted) {
         this.typeCharge = new TypeChargeDto();
         this.createTypeChargeDialog = true;
    }else{
        this.messageService.add({
        severity: 'error', summary: 'erreur', detail: 'problème de permission'
        });
     }
    }

    get local(): LocalDto {
        return this.localService.item;
    }
    set local(value: LocalDto) {
        this.localService.item = value;
    }
    get locals(): Array<LocalDto> {
        return this.localService.items;
    }
    set locals(value: Array<LocalDto>) {
        this.localService.items = value;
    }
    get createLocalDialog(): boolean {
        return this.localService.createDialog;
    }
    set createLocalDialog(value: boolean) {
        this.localService.createDialog= value;
    }
    get typeCharge(): TypeChargeDto {
        return this.typeChargeService.item;
    }
    set typeCharge(value: TypeChargeDto) {
        this.typeChargeService.item = value;
    }
    get typeCharges(): Array<TypeChargeDto> {
        return this.typeChargeService.items;
    }
    set typeCharges(value: Array<TypeChargeDto>) {
        this.typeChargeService.items = value;
    }
    get createTypeChargeDialog(): boolean {
        return this.typeChargeService.createDialog;
    }
    set createTypeChargeDialog(value: boolean) {
        this.typeChargeService.createDialog= value;
    }



    get validChargeCode(): boolean {
        return this._validChargeCode;
    }

    set validChargeCode(value: boolean) {
         this._validChargeCode = value;
    }
    get validChargeLabel(): boolean {
        return this._validChargeLabel;
    }

    set validChargeLabel(value: boolean) {
         this._validChargeLabel = value;
    }

    get validTypeChargeCode(): boolean {
        return this._validTypeChargeCode;
    }
    set validTypeChargeCode(value: boolean) {
        this._validTypeChargeCode = value;
    }
    get validTypeChargeStyle(): boolean {
        return this._validTypeChargeStyle;
    }
    set validTypeChargeStyle(value: boolean) {
        this._validTypeChargeStyle = value;
    }
    get validLocalCode(): boolean {
        return this._validLocalCode;
    }
    set validLocalCode(value: boolean) {
        this._validLocalCode = value;
    }


    get items(): Array<ChargeDto> {
        return this.service.items;
    }

    set items(value: Array<ChargeDto>) {
        this.service.items = value;
    }

    get item(): ChargeDto {
        return this.service.item;
    }

    set item(value: ChargeDto) {
        this.service.item = value;
    }

    get compteCharge(): CompteChargeDto {
        return this.compteChargeService.item;
    }

    set compteCharge(value: CompteChargeDto) {
        this.compteChargeService.item = value;
    }
    get compteCharges(): Array<CompteChargeDto> {
        return this.compteChargeService.items;
    }
    set compteCharges(value: Array<CompteChargeDto>) {
        this.compteChargeService.items = value;
    }
    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): ChargeCriteria {
        return this.service.criteria;
    }

    set criteria(value: ChargeCriteria) {
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
            this.compteService.findPaginatedByCriteria(this.compteService.criteria).subscribe((data) => {
                this.comptes = data.list;
            });
        }, error => console.log(error));
    }

    get compte(): CompteDto {
        return this.compteService.item;
    }

    set compte(value: CompteDto) {
        this.compteService.item = value;
    }

    get modePaiements(): Array<ModePaiementDto> {
        return this.modePaiementService.items;
    }

    set modePaiements(value: Array<ModePaiementDto>) {
        this.modePaiementService.items = value;
    }
    cancel() {
        this.navigateToList();
    }

    navigateToList() {
        // Naviguer vers la liste des locaux
        this.router.navigate(['/app/admin/finance/charge/list']);
    }
}
