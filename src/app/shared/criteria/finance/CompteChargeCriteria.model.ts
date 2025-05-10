import {ChargeCriteria} from './ChargeCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class CompteChargeCriteria extends BaseCriteria {

    public id: number;
    public code: string;
    public codeLike: string;
    public label: string;
    public labelLike: string;
    public nom: string;
    public nomLike: string;
     public solde: number;
     public soldeMin: number;
     public soldeMax: number;
      public charges: Array<ChargeCriteria>;

}
