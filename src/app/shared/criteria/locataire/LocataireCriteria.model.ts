import {TypeLocataireCriteria} from './TypeLocataireCriteria.model';

import {BaseCriteria} from 'src/app/zynerator/criteria/BaseCriteria.model';

export class LocataireCriteria extends BaseCriteria {

    public id: number;
    public code: string;
    public codeLike: string;
    public libelle: string;
    public libelleLike: string;
    public nom: string;
    public nomLike: string;
    public prenom: string;
    public prenomLike: string;
    public dateCreation: Date;
    public dateCreationFrom: Date;
    public dateCreationTo: Date;

}
