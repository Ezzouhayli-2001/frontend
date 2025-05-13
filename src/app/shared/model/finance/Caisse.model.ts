
import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';


export class CaisseDto extends BaseDto{

    public code: string;

    public libelle: string;

    public solde: null | number;


    public dateCreation: Date;

    constructor() {
        super();

        this.dateCreation = null;
        this.code = '';
        this.libelle = '';
        this.solde = null;

        }

}
