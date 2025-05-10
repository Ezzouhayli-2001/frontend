import {TransactionCriteria} from './TransactionCriteria.model';
import {TypePaiementCriteria} from './TypePaiementCriteria.model';
import {CompteCriteria} from '../finance/CompteCriteria.model';
import {CompteLocataireCriteria} from '../finance/CompteLocataireCriteria.model';
import {TypeLocataireCriteria} from './TypeLocataireCriteria.model';
import {LocataireCriteria} from './LocataireCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class LocationCriteria extends BaseCriteria {

    public id: number;
    public code: string;
    public codeLike: string;
    public dateCreation: Date;
    public dateCreationFrom: Date;
    public dateCreationTo: Date;
  public locataire: LocataireCriteria ;
  public locataires: Array<LocataireCriteria> ;
  public typeLocataire: TypeLocataireCriteria ;
  public typeLocataires: Array<TypeLocataireCriteria> ;

}
