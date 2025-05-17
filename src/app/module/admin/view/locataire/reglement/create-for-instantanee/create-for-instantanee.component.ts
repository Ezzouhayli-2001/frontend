import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {ReglementAdminService} from 'src/app/shared/service/admin/locataire/ReglementAdmin.service';
import {ReglementDto} from 'src/app/shared/model/locataire/Reglement.model';
import {ReglementCriteria} from 'src/app/shared/criteria/locataire/ReglementCriteria.model';
import {LocationDto} from 'src/app/shared/model/locataire/Location.model';
import {LocationAdminService} from 'src/app/shared/service/admin/locataire/LocationAdmin.service';
import {BanqueAdminService} from "../../../../../../shared/service/admin/finance/BanqueAdmin.service";
import {CaisseAdminService} from "../../../../../../shared/service/admin/finance/CaisseAdmin.service";
import {BanqueDto} from "../../../../../../shared/model/finance/Banque.model";
import { CaisseDto } from 'src/app/shared/model/finance/Caisse.model';
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {LocataireAdminService} from "../../../../../../shared/service/admin/locataire/LocataireAdmin.service";
import {LocalDto} from "../../../../../../shared/model/locaux/Local.model";
import {LocataireDto} from "../../../../../../shared/model/locataire/Locataire.model";
import {CompteDto} from "../../../../../../shared/model/finance/Compte.model";
import {CompteAdminService} from "../../../../../../shared/service/admin/finance/CompteAdmin.service";
import {ModePaiementAdminService} from "../../../../../../shared/service/admin/finance/ModePaiementAdmin.service";
import {ModePaiementDto} from "../../../../../../shared/model/finance/ModePaiement.model";
import {CompteLocataireAdminService} from "../../../../../../shared/service/admin/finance/CompteLocataireAdmin.service";
import {CompteLocataireDto} from "../../../../../../shared/model/finance/CompteLocataire.model";

@Component({
  selector: 'app-create-for-instantanee',
  standalone: false,
  templateUrl: './create-for-instantanee.component.html',
  styleUrl: './create-for-instantanee.component.scss'
})
export class CreateForInstantaneeComponent implements OnInit {

    protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;


    private _validLocationCode = true;
    locataire: LocataireDto;
    local: LocalDto;
    locationsFiltres: any[] = [];
    locatairesFiltres: any[] = [];
    compte = new CompteDto()

    constructor(
        private compteService: CompteAdminService,
        private CompteLocataireService: CompteLocataireAdminService,
        private service: ReglementAdminService,
        private banqueService: BanqueAdminService,
        private modePaiementService: ModePaiementAdminService,
        private localService: LocalAdminService,
        private locataireService: LocataireAdminService,
        private caisseService: CaisseAdminService,
        private locationService: LocationAdminService, @Inject(PLATFORM_ID) private platformId?) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.compteService.findAll().subscribe((data) => {
            this.comptes = data.filter(c => c.code !== 'CHARGE');
        });
        this.locationService.findPaginatedByCriteria(this.locationService.criteria).subscribe((data) => {
            this.locations = data.list;
            this.locationService.items = data.list;
        });
        this.localService.findPaginatedByCriteria(this.localService.criteria).subscribe((data) => this.localService.items = data.list);
        this.locataireService.findPaginatedByCriteria(this.locataireService.criteria).subscribe((data) => this.locataireService.items = data.list);
        this.banqueService.findPaginatedByCriteria(this.banqueService.criteria).subscribe((data) => {
            this.banqueService.items = data.list;
        });
        this.modePaiementService.findPaginatedByCriteria(this.modePaiementService.criteria).subscribe((data) => {
            this.modePaiementService.items = data.list;
        });

        this.caisseService.findPaginatedByCriteria(this.caisseService.criteria).subscribe((data) => {
            this.caisseService.items = data.list;
        });
    }

    public initCode() {
        this.item.code = `Reglement${Math.random().toFixed(6).toString()}`
    }



    public save(): void {
        this.submitted = true;
        this.initCode();
        this.item.caisse = null;
        this.item.banque = null;
        this.location = new LocationDto();
        this.validateForm();
        if (this.errorMessages.length === 0) {
            this.saveWithShowOption(false);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreurs',
                detail: 'Merci de corrigé les erreurs sur le formulaire'
            });
        }
    }

    public saveWithShowOption(showList: boolean) {
        this.service.save().subscribe(item => {
            if (item != null) {
                this.messageService.add({severity: 'success', summary: '', detail: 'Reglement créé avec Success'})
                this.findPaginatedByCriteria();
                this.createDialog = false;
                this.submitted = false;
                this.item = new ReglementDto();
                this.local = new LocalDto();
                this.item.caisse = null;
                this.item.banque = null;
                this.locataire = new LocataireDto()
                this.location = new LocationDto()
                this.compte = new CompteDto()
            } else {
                this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Element existant'});
            }

        }, error => {
            this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Erreur lors de la création de la reglement'});
        });
    }


    public hideCreateDialog() {
        this.createDialog = false;
        this.setValidation(true);
    }


    public setValidation(value: boolean) {
    }


    public validateForm(): void {
        this.errorMessages = new Array<string>();
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
        this.locationService.createDialog = value;
    }


    get validLocationCode(): boolean {
        return this._validLocationCode;
    }

    set validLocationCode(value: boolean) {
        this._validLocationCode = value;
    }


    get items(): Array<ReglementDto> {
        return this.service.items;
    }

    set items(value: Array<ReglementDto>) {
        this.service.items = value;
    }

    get locals(): Array<LocalDto> {
        return this.localService.items;
    }

    set locals(value: Array<LocalDto>) {
        this.localService.items = value;
    }

    get locataires(): Array<LocataireDto> {
        return this.locataireService.items;
    }

    set locataires(value: Array<LocataireDto>) {
        this.locataireService.items = value;
    }

    get caisses(): Array<CaisseDto> {
        return this.caisseService.items;
    }

    set caisses(value: Array<CaisseDto>) {
        this.caisseService.items = value;
    }

    get banques(): Array<BanqueDto> {
        return this.banqueService.items;
    }

    set banques(value: Array<BanqueDto>) {
        this.banqueService.items = value;
    }

    get item(): ReglementDto {
        return this.service.item;
    }

    set item(value: ReglementDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): ReglementCriteria {
        return this.service.criteria;
    }

    set criteria(value: ReglementCriteria) {
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

    get comptes(): Array<CompteDto> {
        return this.compteService.items;
    }

    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
    }

    get modePaiements(): Array<ModePaiementDto> {
        return this.modePaiementService.items;
    }

    set modePaiements(value: Array<ModePaiementDto>) {
        this.modePaiementService.items = value;
    }

    get CompteLocataires(): Array<CompteLocataireDto> {
        return this.CompteLocataireService.items;
    }

    set CompteLocataires(value: Array<CompteLocataireDto>) {
        this.CompteLocataireService.items = value;
    }

    cancel() {
        this.item = new ReglementDto();
        this.item.caisse = null;
        this.item.banque = null;
        this.local = new LocalDto();
        this.locataire = new LocataireDto()
        this.location = new LocationDto()
        this.compte = new CompteDto()
        this.navigateToList();
    }

    navigateToList() {
        // Naviguer vers la liste des locaux
        this.router.navigate(['/app/admin/locataire/reglement/list']);
    }
}
