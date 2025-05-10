import {TransactionCriteria} from '../locataire/TransactionCriteria.model';
import {BanqueCriteria} from './BanqueCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class CompteCriteria extends BaseCriteria {

    public id: number;
     public solde: number;
     public soldeMin: number;
     public soldeMax: number;
     public debit: number;
     public debitMin: number;
     public debitMax: number;
     public credit: number;
     public creditMin: number;
     public creditMax: number;
     public numeroCompte: number;
     public numeroCompteMin: number;
     public numeroCompteMax: number;
    public dateCreation: Date;
    public dateCreationFrom: Date;
    public dateCreationTo: Date;
  public banque: BanqueCriteria ;
  public banques: Array<BanqueCriteria> ;
      public transactions: Array<TransactionCriteria>;

}
