import {TransactionDto} from '../locataire/Transaction.model';
import {LocataireDto} from '../locataire/Locataire.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {LocationDto} from "../locataire/Location.model";
import {LocalDto} from "../locaux/Local.model";


export class CompteInstantaneeDto extends BaseDto{

    public solde: null | number;

    public soldeInitial: null | number;

    public debit: null | number;

    public code: string;
    public credit: null | number;

    public nom: string;

    public locataire: LocataireDto ;
    public location: LocationDto ;
    public locale: LocalDto;
    public dateCreation: Date;
    public description: string;
     public transactions: Array<TransactionDto>;


    constructor() {
        super();
        this.code = null;
        this.soldeInitial = null;
        this.nom = null;
        this.description = null;
        this.solde = null;
        this.debit = null;
        this.dateCreation = null;
        this.credit = null;
        this.locale = new LocalDto();
        this.location = new LocationDto() ;
        this.locataire = new LocataireDto() ;
        this.transactions = new Array<TransactionDto>();

        }

}
