import {LocataireDto} from './Locataire.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {LocalDto} from "../locaux/Local.model";


export class LocationDto extends BaseDto{

    public code: string;

    public reference: string;

    public dateCreation: Date;

    public dateDebut: Date;

    public dateFin: Date;

    public loyer: null | number;

    public caution: null | number;

    public actif: boolean;
    public locataire: LocataireDto ;
    public local: LocalDto ;


    constructor() {
        super();

        this.code = '';
        this.reference = '';
        this.actif = false;
        this.dateCreation = null;
        this.dateDebut = null;
        this.dateFin = null;
        this.loyer = null;
        this.caution = null;
        this.locataire = new LocataireDto() ;
        this.local = new LocalDto() ;

    }

}
