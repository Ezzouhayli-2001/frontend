import {TypeChargeDto} from './TypeCharge.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {LocalDto} from "../locaux/Local.model";
import {CompteChargeDto} from "./CompteCharge.model";
import {CompteDto} from "./Compte.model";
import {ModePaiementDto} from "./ModePaiement.model";


export class ChargeDto extends BaseDto{

    public code: string;

    public modePaiement: ModePaiementDto;
    public label: string;

    public montant: null | number;

   public date: Date;

   public isPaid: null | boolean;

    public description: string;

    public typeCharge: TypeChargeDto ;
    public compteCharge: CompteChargeDto ;
    public compteSource: CompteDto ;
    public local: LocalDto ;


    constructor() {
        super();

        this.modePaiement = new ModePaiementDto() ;
        this.code = '';
        this.compteCharge = new CompteChargeDto() ;
        this.compteSource = new CompteDto() ;
        this.label = '';
        this.montant = null;
        this.date = null;
        this.isPaid = null;
        this.description = '';
        this.typeCharge = new TypeChargeDto() ;
        this.local = new LocalDto() ;

        }

}
