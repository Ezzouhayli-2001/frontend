

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {StatutLocalDto} from "../locataire/StatutLocal.model";
import {LocationDto} from "../locataire/Location.model";
import {TypeLocalDto} from "./TypeLocal.model";
import { LocataireDto } from '../locataire/Locataire.model';


export class LocalDto extends BaseDto{

    public code: string;

    public adresse: string;

    public dateCreation: Date;

    public label: string;

    public superficie: null | number;

    public prix: null | number;

    public description: string;

    public montantMensuel: null | number;
    public statutLocal: StatutLocalDto ;
    public typeLocal: TypeLocalDto ;
    public locations: Array<LocationDto>;


    constructor() {
        super();

        this.code = '';
        this.adresse = '';
        this.dateCreation = null;
        this.label = '';
        this.superficie = null;
        this.prix = null;
        this.description = '';
        this.montantMensuel = null;
        this.statutLocal = new StatutLocalDto() ;
        this.typeLocal = new TypeLocalDto() ;
        this.locations = new Array<LocationDto>();

    }

}
