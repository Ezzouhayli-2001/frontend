import {BanqueCriteria} from './BanqueCriteria.model';
import {CompteCriteria} from './CompteCriteria.model';
import {CompteInstantaneeCriteria} from './CompteInstantaneeCriteria.model';
import {ReglementCriteria} from '../locataire/ReglementCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class ChequeCriteria extends BaseCriteria {

    public id: number;
     public montant: number;
     public montantMin: number;
     public montantMax: number;
    public dateEmission: Date;
    public dateEmissionFrom: Date;
    public dateEmissionTo: Date;
    public dateEncaissement: Date;
    public dateEncaissementFrom: Date;
    public dateEncaissementTo: Date;
    public numeroCheque: string;
    public numeroChequeLike: string;
  public banque: BanqueCriteria ;
  public banques: Array<BanqueCriteria> ;
  public reglement: ReglementCriteria ;
  public reglements: Array<ReglementCriteria> ;

}
