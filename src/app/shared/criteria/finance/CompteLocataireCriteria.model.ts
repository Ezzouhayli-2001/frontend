import {TransactionCriteria} from '../locataire/TransactionCriteria.model';
import {LocataireCriteria} from '../locataire/LocataireCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class CompteLocataireCriteria extends BaseCriteria {

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
    public locataire: LocataireCriteria ;
    public locataires: Array<LocataireCriteria> ;
    public transactions: Array<TransactionCriteria>;

}
