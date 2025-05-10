import {StatutLocalCriteria} from '../locataire/StatutLocalCriteria.model';
import {TypeLocataireCriteria} from '../locataire/TypeLocataireCriteria.model';
import {LocataireCriteria} from '../locataire/LocataireCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class LocalCriteria extends BaseCriteria {

    public id: number;
    public code: string;
    public codeLike: string;
    public label: string;
    public labelLike: string;
    public adresse: string;
    public adresseLike: string;
    public description: string;
    public descriptionLike: string;
     public montantMensuel: number;
     public montantMensuelMin: number;
     public montantMensuelMax: number;
  public typeLocataire: TypeLocataireCriteria ;
  public typeLocataires: Array<TypeLocataireCriteria> ;
  public locataire: LocataireCriteria ;
  public locataires: Array<LocataireCriteria> ;
  public statutLocal: StatutLocalCriteria ;
  public statutLocals: Array<StatutLocalCriteria> ;

}
