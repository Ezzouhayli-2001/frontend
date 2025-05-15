
import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class CaisseCriteria extends BaseCriteria {

    public id: number;
    public code: string;
    public codeLike: string;
    public libelle: string;
    public libelleLike: string;
     public solde: number;
     public soldeMin: number;
     public soldeMax: number;
     public dateCreation: Date;
     public dateCreationMin: Date;
     public dateCreationMax: Date;

}
