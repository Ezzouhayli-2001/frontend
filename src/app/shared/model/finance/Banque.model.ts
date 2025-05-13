
import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';


export class BanqueDto extends BaseDto{

    public code: string;

    public label: string;

    public nom: string;

    public numeroCompte: string;

    public solde: null | number;

    public dateCreation: Date;



    constructor() {
        super();

        this.code = '';
        this.dateCreation = null;
        this.label = '';
        this.nom = '';
        this.numeroCompte = '';
        this.solde = null;

        }

}
