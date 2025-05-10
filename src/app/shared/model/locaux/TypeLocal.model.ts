
import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';


export class TypeLocalDto extends BaseDto{

    public code: string;

    public label: string;

    public style: string;



    constructor() {
        super();

        this.code = '';
        this.label = '';
        this.style = '';

        }

}
