import {LocationCriteria} from './LocationCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class ReglementCriteria extends BaseCriteria {

    public id: number;
     public montant: number;
     public montantMin: number;
     public montantMax: number;
    public date: Date;
    public dateFrom: Date;
    public dateTo: Date;
    public motif: string;
    public motifLike: string;

}
