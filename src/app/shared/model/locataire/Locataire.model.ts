import {AvoirDto} from './Avoir.model';
import {CompteInstantaneeDto} from '../finance/CompteInstantanee.model';
import {TypeLocataireDto} from './TypeLocataire.model';
import {LocationDto} from './Location.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';


export class LocataireDto extends BaseDto{

    public code: string;

    public nom: string;

    public prenom: string;
    public fullName: string;

    public telephone: string;

    public dateCreation: Date;

    public typeLocataire: TypeLocataireDto ;
    public CompteInstantanee: CompteInstantaneeDto ;
    public locations: Array<LocationDto>;
    public avoirs: Array<AvoirDto>;


    constructor() {
        super();

        this.code = '';
        this.fullName = '';
        this.nom = '';
        this.prenom = '';
        this.telephone = '';
        this.dateCreation = null;
        this.locations = new Array<LocationDto>();
        this.avoirs = new Array<AvoirDto>();

    }

}
