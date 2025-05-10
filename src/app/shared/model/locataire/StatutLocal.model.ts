
import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';


export class StatutLocalDto extends BaseDto{

    public indexation: null | number;

    public code: string;

    public label: string;

    public style: string;

    public color: string;



    constructor() {
        super();

        this.indexation = null;
        this.code = '';
        this.label = '';
        this.style = '';
        this.color = '';

        }

}
