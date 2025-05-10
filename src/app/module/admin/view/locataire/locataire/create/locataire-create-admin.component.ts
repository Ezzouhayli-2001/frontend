import {Component, OnInit, Input} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';


import {environment} from 'src/environments/environment';

import {RoleService} from 'src/app/zynerator/security/shared/service/Role.service';
import {StringUtilService} from 'src/app/zynerator/util/StringUtil.service';
import {ServiceLocator} from 'src/app/zynerator/service/ServiceLocator';




import {LocataireAdminService} from 'src/app/shared/service/admin/locataire/LocataireAdmin.service';
import {LocataireDto} from 'src/app/shared/model/locataire/Locataire.model';
import {LocataireCriteria} from 'src/app/shared/criteria/locataire/LocataireCriteria.model';
import {TypeLocataireDto} from 'src/app/shared/model/locataire/TypeLocataire.model';
import {TypeLocataireAdminService} from 'src/app/shared/service/admin/locataire/TypeLocataireAdmin.service';
import {LocalDto} from "../../../../../../shared/model/locaux/Local.model";
import {LocalAdminService} from "../../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {LocationDto} from "../../../../../../shared/model/locataire/Location.model";
import {LocationAdminService} from "../../../../../../shared/service/admin/locataire/LocationAdmin.service";
@Component({
  selector: 'app-locataire-create-admin',
  standalone: false,
  templateUrl: './locataire-create-admin.component.html'
})
export class LocataireCreateAdminComponent  implements OnInit {

	protected _submitted = false;
    protected _errorMessages = new Array<string>();

    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;
    private _activeTab = 0;



   private _validLocataireCode = true;
   private _validLocataireLibelle = true;
   private _validLocataireNom = true;
   private _validLocatairePrenom = true;
    private _validTypeLocataireCode = true;
    private _validTypeLocataireLabel = true;
    private _validTypeLocataireStyle = true;
    location: LocationDto = new LocationDto();
    availabilityList: { start: Date, end: Date | null }[] = [];

    minDate: Date = new Date();

    // Propriétés pour la gestion des dates de location
    disabledDates: Date[] = [];
    dateConflictWarning: string | null = null;
    dateConflictError: boolean = false;
    existingLocations: any[] = [];
	constructor(private service: LocataireAdminService ,private locationService: LocationAdminService ,private localService: LocalAdminService, private typeLocataireService: TypeLocataireAdminService, @Inject(PLATFORM_ID) private platformId? ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.service.findAll().subscribe((data) => this.items = data);
        this.localService.findAll().subscribe((data) => {
            this.locals = data.filter(e => e.statutLocal?.code === 'disponible');
        });
        this.typeLocataireService.findAll().subscribe((data) => this.typeLocataires = data);
        this.getExistingLocations();
        this.initCode();
    }


    public initCode(): void {
    }

    getExistingLocations() {
        // Récupération des locations existantes
        this.locationService.findPaginatedByCriteria(this.locationService.criteria).subscribe(data => {
            this.existingLocations = data.list;

        });
    }

    updateDisabledDates() {
        this.disabledDates = [];

        // Si aucun local sélectionné, pas besoin de désactiver des dates
        if (!this.location.local?.id) {
            return;
        }

        // Filtrer les locations existantes pour le local sélectionné
        const locationsForLocal = this.local.locations.filter(
            loc => loc.local?.id === this.location.local?.id
        );

        // Pour chaque location existante, générer les dates à désactiver
        locationsForLocal.forEach(loc => {
            if (loc.dateDebut && loc.dateFin) {
                const startDate = new Date(loc.dateDebut);
                const endDate = new Date(loc.dateFin);

                // Générer toutes les dates entre dateDebut et dateFin
                const currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    this.disabledDates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });
    }
    public save(): void {
        this.submitted = true;
        this.validateForm();
        const exitingone = this.items.find(e => e.nom === this.item.nom && e.prenom !== this.item.prenom && e.telephone !== this.item.telephone)
        if(exitingone!=null){
            console.log(exitingone)
            this.location.code = exitingone.code;
            this.item.code = exitingone.code;
        }else {
            this.location.code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 6);
            this.item.code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 6);
        }
        if (this.errorMessages.length === 0 && !this.dateConflictError) {
            this.saveWithShowOption(false);
        } else {
            this.messageService.add({severity: 'error',summary: 'Erreurs',detail: 'Merci de corrigé les erreurs sur le formulaire'});
        }
    }

    public saveWithShowOption(showList: boolean) {
        this.service.save().subscribe(item => {
            if(item==null){
                this.locationService.item.locataire = this.item;
            }else {
                this.locationService.item.locataire = item;
            }
            this.findPaginatedByCriteria();
            this.createDialog = false;
            this.submitted = false;
            this.locationService.item.dateCreation = new Date();
            this.locationService.item.loyer = this.locationService.item.local.prix;
            this.locationService.item.actif = new Date(this.locationService.item.dateDebut).getTime() > new Date().getTime();
            this.locationService.save().subscribe(local => {
                if (local != null) {
                    this.location = new LocationDto();
                    this.item = new LocataireDto();
                    this.messageService.add({severity: 'success', summary: '', detail: 'Locataire a été créé avec succès'});
                } else {
                    this.messageService.add({severity: 'error', summary: 'Erreurs', detail: 'Element existant'});
                }

            });

        }, error => {
            console.log(error);
        });
    }



    public hideCreateDialog() {
        this.createDialog = false;
        this.setValidation(true);
    }

    onLocalChange(local: LocalDto) {
        // Mettre à jour le local et réinitialiser les dates
        this.location.local = local;
        this.location.dateDebut = null;
        this.location.dateFin = null;
        this.dateConflictWarning = null;
        this.dateConflictError = false;
        this.local = local;

        // Mettre à jour les dates désactivées pour ce local
        this.updateDisabledDates();
    }

    checkDateConflict() {
        // Vérifier si les dates sélectionnées sont en conflit avec des locations existantes
        if (!this.location.dateDebut || !this.location.dateFin || !this.location.local?.id) {
            this.dateConflictWarning = null;
            this.dateConflictError = false;
            return;
        }

        // Convertir les dates en objets Date pour la comparaison
        const startDate = new Date(this.location.dateDebut);
        const endDate = new Date(this.location.dateFin);

        if (endDate < startDate) {
            this.dateConflictWarning = "La date de fin doit être postérieure à la date de début.";
            this.dateConflictError = true;
            return;
        }

        // Filtrer les locations existantes pour le local sélectionné
        const locationsForLocal = this.existingLocations.filter(
            loc => loc.local?.id === this.location.local?.id
        );

        // Vérifier les conflits de dates
        let hasConflict = false;
        locationsForLocal.forEach(loc => {
            if (loc.dateDebut && loc.dateFin) {
                const existingStartDate = new Date(loc.dateDebut);
                const existingEndDate = new Date(loc.dateFin);

                // Vérifier si les périodes se chevauchent
                if (
                    (startDate <= existingEndDate && startDate >= existingStartDate) ||
                    (endDate <= existingEndDate && endDate >= existingStartDate) ||
                    (startDate <= existingStartDate && endDate >= existingEndDate)
                ) {
                    hasConflict = true;
                    const formattedStart = this.formatDate(existingStartDate);
                    const formattedEnd = this.formatDate(existingEndDate);
                    this.dateConflictWarning = `Ce local est déjà réservé du ${formattedStart} au ${formattedEnd}.`;
                    this.dateConflictError = true;
                }
            }
        });

        if (!hasConflict) {
            this.dateConflictWarning = null;
            this.dateConflictError = false;
        }
    }

    formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    public  setValidation(value: boolean){
        this.validLocataireCode = value;
        this.validLocataireLibelle = value;
        this.validLocataireNom = value;
        this.validLocatairePrenom = value;
    }



    public  validateForm(): void{
        this.errorMessages = new Array<string>();
        this.item.dateCreation = new Date();

        this.locationService.item = this.location;
       // this.validateLocataireNom();
        //this.validateLocatairePrenom();
    }

    public validateLocataireCode(){
        if (this.stringUtilService.isEmpty(this.item.code)) {
        this.errorMessages.push('Code non valide');
        this.validLocataireCode = false;
        } else {
            this.validLocataireCode = true;
        }
    }
    public validateLocataireLibelle(){
        if (this.stringUtilService.isEmpty(this.item.nom)) {
        this.errorMessages.push('Libelle non valide');
        this.validLocataireLibelle = false;
        } else {
            this.validLocataireLibelle = true;
        }
    }
    public validateLocataireNom(){
        if (this.stringUtilService.isEmpty(this.item.nom)) {
        this.errorMessages.push('Nom non valide');
        this.validLocataireNom = false;
        } else {
            this.validLocataireNom = true;
        }
    }
    public validateLocatairePrenom(){
        if (this.stringUtilService.isEmpty(this.item.prenom)) {
        this.errorMessages.push('Prenom non valide');
        this.validLocatairePrenom = false;
        } else {
            this.validLocatairePrenom = true;
        }
    }


    public async openCreateTypeLocataire(typeLocataire: string) {
    const isPermistted = await this.roleService.isPermitted('TypeLocataire', 'add');
    if(isPermistted) {
         this.typeLocataire = new TypeLocataireDto();
         this.createTypeLocataireDialog = true;
    }else{
        this.messageService.add({
        severity: 'error', summary: 'erreur', detail: 'problème de permission'
        });
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


    get items(): Array<LocataireDto> {
        return this.service.items;
    }

    set items(value: Array<LocataireDto>) {
        this.service.items = value;
    }

    get item(): LocataireDto {
        return this.service.item;
    }

    set item(value: LocataireDto) {
        this.service.item = value;
    }

    get createDialog(): boolean {
        return this.service.createDialog;
    }

    set createDialog(value: boolean) {
        this.service.createDialog = value;
    }

    get criteria(): LocataireCriteria {
        return this.service.criteria;
    }

    set criteria(value: LocataireCriteria) {
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
        this.router.navigate(['/app/admin/locataire/locataire/list']);
    }
}
