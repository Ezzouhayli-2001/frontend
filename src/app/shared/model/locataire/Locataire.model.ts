import {AvoirDto} from './Avoir.model';
import {CompteLocataireDto} from '../finance/CompteLocataire.model';
import {TypeLocataireDto} from './TypeLocataire.model';
import {LocationDto} from './Location.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';


export class LocataireDto extends BaseDto{

    public code: string;

    public nom: string;

    public prenom: string;

    public telephone: string;

    public dateCreation: Date;

    public typeLocataire: TypeLocataireDto ;
    public compteLocataire: CompteLocataireDto ;
    public locations: Array<LocationDto>;
    public avoirs: Array<AvoirDto>;


    constructor() {
        super();

        this.code = '';
        this.nom = '';
        this.prenom = '';
        this.telephone = '';
        this.dateCreation = null;
        this.locations = new Array<LocationDto>();
        this.avoirs = new Array<AvoirDto>();

    }

}
