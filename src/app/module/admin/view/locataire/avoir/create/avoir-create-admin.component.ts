import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

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
import {CompteDto} from "../../../../../../shared/model/finance/Compte.model";
import {CompteAdminService} from "../../../../../../shared/service/admin/finance/CompteAdmin.service";
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {LocataireAdminService} from "../../../../../../shared/service/admin/locataire/LocataireAdmin.service";
import {CaisseAdminService} from "../../../../../../shared/service/admin/finance/CaisseAdmin.service";
import {LocalDto} from "../../../../../../shared/model/locaux/Local.model";
import {LocataireDto} from "../../../../../../shared/model/locataire/Locataire.model";
import {ReglementAdminService} from "../../../../../../shared/service/admin/locataire/ReglementAdmin.service";
import {ModePaiementAdminService} from "../../../../../../shared/service/admin/finance/ModePaiementAdmin.service";
import {ModePaiementDto} from "../../../../../../shared/model/finance/ModePaiement.model";
@Component({
  selector: 'app-avoir-create-admin',
  standalone: false,
  templateUrl: './avoir-create-admin.component.html'
})
export class AvoirCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;
    locataire: LocataireDto;
    local: LocalDto;
    locationsFiltres: any[] = [];
    locatairesFiltres: any[] = [];
    compte = new CompteDto()

    private _validLocationCode = true;

	constructor(
        private compteService: CompteAdminService,
        private localService: LocalAdminService,
        private locataireService: LocataireAdminService,
        private reglementService: ReglementAdminService,
        private caisseService: CaisseAdminService,
        private modePaiementService: ModePaiementAdminService,
        private service: AvoirAdminService , private locationService: LocationAdminService, @Inject(PLATFORM_ID) private platformId? ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.compteService.findPaginatedByCriteria(this.compteService.criteria).subscribe((data) => {
            this.comptes = data.list.filter(c => c.code !== 'CHARGE');
        });
        this.locationService.findPaginatedByCriteria(this.locationService.criteria).subscribe((data) => {
            this.locations = data.list;
            this.locationService.items = data.list;
        });
        this.modePaiementService.findPaginatedByCriteria(this.modePaiementService.criteria).subscribe((data) => {
            this.modePaiementService.items = data.list;
        });

        this.localService.findPaginatedByCriteria(this.localService.criteria).subscribe((data) => this.localService.items = data.list);
        this.locataireService.findPaginatedByCriteria(this.locataireService.criteria).subscribe((data) => this.locataireService.items = data.list);
        this.reglementService.findPaginatedByCriteria(this.reglementService.criteria).subscribe((data) => this.reglementService.items = data.list);

    }

    public initCode(){
        this.item.code = `AVOIR-${Math.random().toFixed(6).toString()}`
    }

    public save(): void {
        this.submitted = true;
        this.initCode();
        this.validateForm();
        this.item.banque = this.compte.banque;
        this.item.caisse = this.compte.caisse;
        this.item.compteSource = this.compte.code;

        if (this.locataire != null && this.local != null) {
            this.item.locataire = this.locataire;

            // Add null checks to avoid "Cannot read properties of undefined" error
            const matchingLocation = this.locationService.items?.find(e =>
                e && e.local && e.locataire &&
                e.local.code === this.local?.code &&
                e.locataire.code === this.locataire?.code
            );

            // Only assign if a matching location is found
            if (matchingLocation) {
                this.item.location = matchingLocation;
            } else {
                // Handle the case where no matching location is found
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Aucune location trouvée pour ce local et ce locataire'
                });
                return; // Exit the save method to prevent saving incomplete data
            }
        }

        console.log(this.compte);
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
                this.messageService.add({severity: 'success', summary: '', detail: 'Avoir créé avec Success'})
                this.findPaginatedByCriteria();
                this.createDialog = false;
                this.submitted = false;
                this.item = new AvoirDto();
                this.item.caisse = null;
                this.item.banque = null;
                this.local = new LocalDto();
                this.locataire = new LocataireDto()
                this.location = new LocationDto()
                this.compte = new CompteDto()
            } else {
                this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Element existant'});
            }

        }, error => {
            this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Erreur lors de la création de l\'avoir'});
        });
    }

    onLocalChange(event: any) {
        if (!event.value) {
            // Si aucun local n'est sélectionné, vider la liste des locataires filtrés
            this.locationsFiltres = [];
            this.locatairesFiltres = [];
            return;
        }

        const localId = event.value.id;
        this.locationsFiltres = this.locations.filter(location => location.local.id === localId);
        // Met à jour les locataires selon les locations filtrées
        this.locatairesFiltres = this.locataires.filter(locataire =>
            this.locations.some(location => location.local.id === localId)
        );

    }

    public findPaginatedByCriteria() {
        this.service.findPaginatedByCriteria(this.criteria).subscribe(paginatedItems => {
            this.items = paginatedItems.list;
        }, error => console.log(error));
    }
    public hideCreateDialog() {
        this.createDialog = false;
        this.setValidation(true);
    }





    public  setValidation(value: boolean){
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
    }



    public async openCreateLocation(location: string) {
    const isPermistted = await this.roleService.isPermitted('Location', 'add');
    if(isPermistted) {
         this.location = new LocationDto();
         this.createLocationDialog = true;
    }else{
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

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
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
    get comptes(): Array<CompteDto> {
        return this.compteService.items;
    }

    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
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

    get modePaiements(): Array<ModePaiementDto> {
        return this.modePaiementService.items;
    }

    set modePaiements(value: Array<ModePaiementDto>) {
        this.modePaiementService.items = value;
    }
    cancel() {
        this.item = new AvoirDto();
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
        this.router.navigate(['/app/admin/locataire/avoir/list']);
    }
}
