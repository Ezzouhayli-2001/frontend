
import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';


export class CaisseDto extends BaseDto{

    public code: string;

    public libelle: string;

    public solde: null | number;



    constructor() {
        super();

        this.code = '';
        this.libelle = '';
        this.solde = null;

        }

}
