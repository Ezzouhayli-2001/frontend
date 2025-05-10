
import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class TypePaiementCriteria extends BaseCriteria {

    public id: number;
     public indexation: number;
     public indexationMin: number;
     public indexationMax: number;
    public code: string;
    public codeLike: string;
    public label: string;
    public labelLike: string;
    public style: string;
    public styleLike: string;

}
