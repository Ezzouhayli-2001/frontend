import {CompteCriteria} from './CompteCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class CompteAdminCriteria extends BaseCriteria {

    public id: number;
     public solde: number;
     public soldeMin: number;
     public soldeMax: number;
    public dateCreation: Date;
    public dateCreationFrom: Date;
    public dateCreationTo: Date;
      public comptes: Array<CompteCriteria>;

}
