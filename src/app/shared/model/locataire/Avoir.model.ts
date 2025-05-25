import {LocationDto} from './Location.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {LocataireDto} from "./Locataire.model";
import {CaisseDto} from "../finance/Caisse.model";
import {BanqueDto} from "../finance/Banque.model";
import {ModePaiementDto} from "./ModePaiement.model";


export class AvoirDto extends BaseDto{

    public montant: null | number;

    public compteSource: string;

    public modePaiement: ModePaiementDto;

   public date: Date;

   public code: string;

    public motif: string;

    public location: LocationDto ;
    public banque: BanqueDto;
    public caisse: CaisseDto;
    public locataire: LocataireDto ;


    constructor() {
        super();
        this.code = '';
        this.modePaiement = new ModePaiementDto() ;
        this.location = new LocationDto();
        this.compteSource = '';
        this.montant = null;
        this.date = null;
        this.motif = '';
        this.locataire = new LocataireDto() ;
        this.banque = new BanqueDto() ;
        this.caisse = new CaisseDto() ;
        }

}
