
import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {CompteChargeDto} from "./CompteCharge.model";


export class TypeChargeDto extends BaseDto{

    public code: string;

    public label: string;

    public style: string;

    public description: string;

    public comptesCharges: Array<CompteChargeDto>;



    constructor() {
        super();

        this.code = '';
        this.label = '';
        this.style = '';
        this.description = '';
        this.comptesCharges = new Array<CompteChargeDto>() ;

        }

}
