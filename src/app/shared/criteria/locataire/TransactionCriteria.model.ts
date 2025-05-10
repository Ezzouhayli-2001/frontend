import {TypePaiementCriteria} from '../finance/TypePaiementCriteria.model';
import {CompteCriteria} from '../finance/CompteCriteria.model';
import {ModePaiementCriteria} from '../finance/ModePaiementCriteria.model';
import {TypeTransactiontCriteria} from './TypeTransactiontCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class TransactionCriteria extends BaseCriteria {

    public id: number;
    public date: Date;
    public dateFrom: Date;
    public dateTo: Date;
     public montant: number;
     public montantMin: number;
     public montantMax: number;
    public description: string;
    public descriptionLike: string;
  public typeTransaction: TypeTransactiontCriteria ;
  public typeTransactions: Array<TypeTransactiontCriteria> ;
  public modePaiement: ModePaiementCriteria ;
  public modePaiements: Array<ModePaiementCriteria> ;
  public typePaiement: TypePaiementCriteria ;
  public typePaiements: Array<TypePaiementCriteria> ;

}
