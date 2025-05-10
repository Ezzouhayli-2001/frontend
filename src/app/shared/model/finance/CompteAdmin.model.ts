import {CompteDto} from './Compte.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';


export class CompteAdminDto extends BaseDto{

    public solde: null | number;

   public dateCreation: Date;

     public comptes: Array<CompteDto>;


    constructor() {
        super();

        this.solde = null;
        this.dateCreation = null;
        this.comptes = new Array<CompteDto>();

        }

}
