import {LocationDto} from './Location.model';

import {BaseDto} from 'src/app/zynerator/dto/BaseDto.model';
import {BanqueDto} from "../finance/Banque.model";
import {CaisseDto} from "../finance/Caisse.model";
import {ModePaiementDto} from "./ModePaiement.model";
import {CompteDto} from "../finance/Compte.model";


export class ReglementDto extends BaseDto{

    public montant: null | number;

   public date: Date;

   public code: string;

    public motif: string;

    public modePaiement: ModePaiementDto;

    public location: LocationDto ;

    public compteSource: CompteDto;
    public compteDestination: CompteDto;

    public banque: BanqueDto;
    public caisse: CaisseDto;


    constructor() {
        super();
        this.code = '';
        this.montant = null;
        this.date = null;
        this.motif = '';
        this.compteSource = new CompteDto();
        this.compteDestination = new CompteDto();
        this.location = new LocationDto() ;
        this.banque = new BanqueDto();
        this.caisse = new CaisseDto();
        this.modePaiement = new ModePaiementDto();
        }

}
