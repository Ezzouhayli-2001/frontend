import {ChargeDto} from './Charge.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import { TypeChargeDto } from './TypeCharge.model';
import {LocalDto} from "../locaux/Local.model";


export class CompteChargeDto extends BaseDto{

    public code: string;

    public label: string;

    public nom: string;

    public solde: null | number;

    public local: LocalDto;
    public dateCreation: Date;

    public typeCharges: Array<TypeChargeDto>;

    public description: string;
     public charges: Array<ChargeDto>;


    constructor() {
        super();

        this.local = new LocalDto() ;
        this.dateCreation = null;
        this.code = '';
        this.label = '';
        this.nom = '';
        this.solde = null;
        this.description = '';
        this.typeCharges = new Array<TypeChargeDto>();
        this.charges = new Array<ChargeDto>();

        }

}
