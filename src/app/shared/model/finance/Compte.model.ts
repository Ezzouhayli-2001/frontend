import {TransactionDto} from '../locataire/Transaction.model';
import {BanqueDto} from './Banque.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {CompteChargeDto} from "./CompteCharge.model";
import { CaisseDto } from './Caisse.model';
import {CompteInstantaneeDto} from "./CompteInstantanee.model";


export class CompteDto extends BaseDto{

    public code: string ;

    public compteCharge: CompteChargeDto;

    public compteInstantanee: CompteInstantaneeDto;

    public solde: null | number;

    public soldeInitial: null | number;

    public debit: null | number;

    public credit: null | number;

    public numeroCompte: null | number;

   public dateCreation: Date;
   public caisse: CaisseDto;

    public banque: BanqueDto ;
     public transactions: Array<TransactionDto>;


    constructor() {
        super();

        this.soldeInitial = null;
        this.compteInstantanee = new CompteInstantaneeDto();
        this.solde = null;
        this.debit = null;
        this.credit = null;
        this.numeroCompte = null;
        this.dateCreation = null;
        this.caisse = new CaisseDto() ;
        this.banque = new BanqueDto() ;
        this.compteCharge = new CompteChargeDto() ;
        this.transactions = new Array<TransactionDto>();

        }

}
