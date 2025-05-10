import {BanqueDto} from './Banque.model';
import {CompteDto} from './Compte.model';
import {CompteLocataireDto} from './CompteLocataire.model';
import {ReglementDto} from '../locataire/Reglement.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';


export class ChequeDto extends BaseDto{

    public montant: null | number;

   public dateEmission: Date;

   public dateEncaissement: Date;

    public numeroCheque: string;

    public banque: BanqueDto ;
    public compte: CompteDto ;
    public compteLocataire: CompteLocataireDto ;
    public reglement: ReglementDto ;


    constructor() {
        super();

        this.montant = null;
        this.dateEmission = null;
        this.dateEncaissement = null;
        this.numeroCheque = '';
        this.banque = new BanqueDto() ;
        this.reglement = new ReglementDto() ;

        }

}
