import {TypeChargeCriteria} from './TypeChargeCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';
import {LocalCriteria} from "../locaux/LocalCriteria.model";

export class ChargeCriteria extends BaseCriteria {

    public id: number;
    public code: string;
    public codeLike: string;
    public label: string;
    public labelLike: string;
     public montant: number;
     public montantMin: number;
     public montantMax: number;
    public date: Date;
    public dateFrom: Date;
    public dateTo: Date;
    public isPaid: null | boolean;
    public description: string;
    public descriptionLike: string;
  public typeCharge: TypeChargeCriteria ;
  public typeCharges: Array<TypeChargeCriteria> ;
  public local: LocalCriteria ;
  public locals: Array<LocalCriteria> ;

}
