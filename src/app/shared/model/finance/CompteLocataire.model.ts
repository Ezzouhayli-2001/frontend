import {TransactionDto} from '../locataire/Transaction.model';
import {LocataireDto} from '../locataire/Locataire.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {LocationDto} from "../locataire/Location.model";


export class CompteLocataireDto extends BaseDto{

    public solde: null | number;

    public soldeInitial: null | number;

    public debit: null | number;

    public credit: null | number;

    public locataire: LocataireDto ;
    public location: LocationDto ;
    public transactions: Array<TransactionDto>;


    constructor() {
        super();
        this.soldeInitial = null;
        this.solde = null;
        this.debit = null;
        this.credit = null;
        this.location = new LocationDto() ;
        this.locataire = new LocataireDto() ;
        this.transactions = new Array<TransactionDto>();

    }

}
