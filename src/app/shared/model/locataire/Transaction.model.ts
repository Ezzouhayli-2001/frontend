import {TypePaiementDto} from '../finance/TypePaiement.model';
import {CompteDto} from '../finance/Compte.model';
import {ModePaiementDto} from '../finance/ModePaiement.model';
import {TypeTransactiontDto} from './TypeTransactiont.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import { CompteInstantaneeDto } from '../finance/CompteInstantanee.model';
import {CompteLocataireDto} from "../finance/CompteLocataire.model";


export class TransactionDto extends BaseDto{

   public date: Date;

    public montant: null | number;

    public description: string;

    public typeTransaction: TypeTransactiontDto ;
    public modePaiement: ModePaiementDto ;
    public typePaiement: TypePaiementDto ;
    public compteSource: CompteDto ;
    public compteDestination: CompteDto ;
    public CompteInstantanee: CompteInstantaneeDto ;
    public compteLocataire: CompteLocataireDto ;


    constructor() {
        super();

        this.date = null;
        this.montant = null;
        this.description = '';
        this.typeTransaction = new TypeTransactiontDto() ;
        this.modePaiement = new ModePaiementDto() ;
        this.compteLocataire = new CompteLocataireDto() ;
        this.typePaiement = new TypePaiementDto() ;
        this.CompteInstantanee = new CompteInstantaneeDto() ;

        }

}
