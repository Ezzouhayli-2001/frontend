import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ChargeAdminService} from "../../../../../shared/service/admin/finance/ChargeAdmin.service";
import {BanqueAdminService} from "../../../../../shared/service/admin/finance/BanqueAdmin.service";
import {CompteAdminService} from "../../../../../shared/service/admin/finance/CompteAdmin.service";
import {CompteChargeAdminService} from "../../../../../shared/service/admin/finance/CompteChargeAdmin.service";
import {ModePaiementAdminService} from "../../../../../shared/service/admin/finance/ModePaiementAdmin.service";
import {CaisseAdminService} from "../../../../../shared/service/admin/finance/CaisseAdmin.service";
import {LocalAdminService} from "../../../../../shared/service/admin/locaux/LocalAdmin.service";
import {TypeChargeAdminService} from "../../../../../shared/service/admin/finance/TypeChargeAdmin.service";
import {ServiceLocator} from "../../../../../zynerator/service/ServiceLocator";
import {DatePipe, isPlatformBrowser} from "@angular/common";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {RoleService} from "../../../../../zynerator/security/shared/service/Role.service";
import {Router} from "@angular/router";
import {StringUtilService} from "../../../../../zynerator/util/StringUtil.service";
import {CompteDto} from "../../../../../shared/model/finance/Compte.model";
import {CompteChargeDto} from "../../../../../shared/model/finance/CompteCharge.model";
import {BanqueDto} from "../../../../../shared/model/finance/Banque.model";
import {CaisseDto} from "../../../../../shared/model/finance/Caisse.model";
import {ChargeDto} from "../../../../../shared/model/finance/Charge.model";

@Component({
    selector: 'app-relever-generale',
    standalone: false,
    templateUrl: './relever-generale.component.html',
    styleUrl: './relever-generale.component.scss'
})
export class ReleverGeneraleComponent implements OnInit {
    protected datePipe: DatePipe;
    protected messageService: MessageService;
    protected confirmationService: ConfirmationService;
    protected roleService: RoleService;
    protected router: Router;
    protected stringUtilService: StringUtilService;

    // Data properties
    private _charges: Array<ChargeDto> = [];
    private _totalBanques: number = 0;
    private _totalCaisses: number = 0;
    private _totalCharges: number = 0;
    private _totalDebitsBanques: number = 0;
    private _totalCreditsBanques: number = 0;
    private _totalDebitsCaisses: number = 0;
    private _totalCreditsCaisses: number = 0;

    protected comptsBanques: Array<CompteDto> = [];
    protected comptsCaisses: Array<CompteDto> = [];

    // UI related properties
    dateFormatColumn: string = 'dd/MM/yyyy';
    exportButtonsBanques: MenuItem[] = [];
    exportButtonsCaisses: MenuItem[] = [];
    exportButtonsCharges: MenuItem[] = [];
    chartData: any;
    chartOptions: any;

    // Form validation
    private _validChargeCode = true;
    private _validChargeLabel = true;
    private _validTypeChargeCode = true;
    private _validTypeChargeStyle = true;
    private _validLocalCode = true;

    constructor(
        private chargeAdminService: ChargeAdminService,
        private banqueService: BanqueAdminService,
        private compteService: CompteAdminService,
        private compteChargeService: CompteChargeAdminService,
        private modePaiementService: ModePaiementAdminService,
        private caisseService: CaisseAdminService,
        private localService: LocalAdminService,
        private typeChargeService: TypeChargeAdminService,
        @Inject(PLATFORM_ID) private platformId?
    ) {
        this.datePipe = ServiceLocator.injector.get(DatePipe);
        this.messageService = ServiceLocator.injector.get(MessageService);
        this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
        this.roleService = ServiceLocator.injector.get(RoleService);
        this.router = ServiceLocator.injector.get(Router);
        this.stringUtilService = ServiceLocator.injector.get(StringUtilService);
    }

    ngOnInit(): void {
        this.loadComptes();

        this.loadModePaiements();
        this.loadCompteCharges();
        this.initExportButtons();
        this.initChartData();
        this.loadBanques();
        this.loadCaisses();
        this.loadCharges();
    }

    private loadBanques(): void {
        this.banqueService.findPaginatedByCriteria(this.banqueService.criteria).subscribe((data) => {
            this.banqueService.items = data.list;

        });
    }

    private loadCaisses(): void {
        this.caisseService.findPaginatedByCriteria(this.caisseService.criteria).subscribe((data) => {
            this.caisseService.items = data.list;
        });
    }

    private loadCharges(): void {
        this.chargeAdminService.findAll().subscribe((data) => {
            this._charges = data;

            this.calculateChargeTotals();
        });
    }

    private loadComptes(): void {
        this.compteService.findAll().subscribe((data) => {
            this.comptes = data;
            this.comptsBanques = this.comptes.filter(e => e.banque !== null&&e.caisse==null);
            this.comptsCaisses = this.comptes.filter(e => e.caisse !== null&&e.banque==null);
            this.calculateBanqueTotals();
            this.calculateCaisseTotals();
        });
    }

    private loadModePaiements(): void {
        this.modePaiementService.findPaginatedByCriteria(this.modePaiementService.criteria).subscribe((data) => {
            this.modePaiementService.items = data.list;
        });
    }

    private loadCompteCharges(): void {
        this.compteChargeService.findPaginatedByCriteria(this.compteChargeService.criteria).subscribe((data) => {
            this.compteCharges = data.list.filter(e => e.code != "CHARGE");
        });
    }

    private calculateBanqueTotals(): void {
        this._totalBanques = this.comptsBanques.reduce((sum, banque) => sum + (banque.solde || 0), 0);
        this._totalDebitsBanques = this.comptsBanques.reduce((sum, banque) => sum + (banque.debit || 0), 0);
        this._totalCreditsBanques = this.comptsBanques.reduce((sum, banque) => sum + (banque.credit || 0), 0);
    }

    private calculateCaisseTotals(): void {
        this._totalCaisses = this.comptsCaisses.reduce((sum, caisse) => sum + (caisse.solde || 0), 0);
        this._totalDebitsCaisses = this.comptsCaisses.reduce((sum, caisse) => sum + (caisse.debit || 0), 0);
        this._totalCreditsCaisses = this.comptsCaisses.reduce((sum, caisse) => sum + (caisse.credit || 0), 0);
    }

    private calculateChargeTotals(): void {
        this._totalCharges = this._charges.reduce((sum, charge) => sum + (charge.montant || 0), 0);
    }

    private initExportButtons(): void {
        this.exportButtonsBanques = [
            {
                label: 'Excel',
                icon: 'pi pi-file-excel',
                command: () => this.exportExcel('banques')
            },
            {
                label: 'PDF',
                icon: 'pi pi-file-pdf',
                command: () => this.exportPdf('banques')
            },
            {
                label: 'CSV',
                icon: 'pi pi-file',
                command: () => this.exportCSV('banques')
            }
        ];

        this.exportButtonsCaisses = [
            {
                label: 'Excel',
                icon: 'pi pi-file-excel',
                command: () => this.exportExcel('caisses')
            },
            {
                label: 'PDF',
                icon: 'pi pi-file-pdf',
                command: () => this.exportPdf('caisses')
            },
            {
                label: 'CSV',
                icon: 'pi pi-file',
                command: () => this.exportCSV('caisses')
            }
        ];

        this.exportButtonsCharges = [
            {
                label: 'Excel',
                icon: 'pi pi-file-excel',
                command: () => this.exportExcel('charges')
            },
            {
                label: 'PDF',
                icon: 'pi pi-file-pdf',
                command: () => this.exportPdf('charges')
            },
            {
                label: 'CSV',
                icon: 'pi pi-file',
                command: () => this.exportCSV('charges')
            }
        ];
    }

    private initChartData(): void {
        this.chartData = {
            labels: ['Banques', 'Caisses', 'Charges'],
            datasets: [
                {
                    data: [this._totalBanques, this._totalCaisses, this._totalCharges],
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
                    hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D']
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        };
    }

    // Action methods
    viewBanque(banque: BanqueDto): void {
        this.router.navigate(['/app/admin/finance/banque/view', banque.id]);
    }

    viewCaisse(caisse: CaisseDto): void {
        this.router.navigate(['/app/admin/finance/caisse/view', caisse.id]);
    }

    viewCharge(charge: ChargeDto): void {
        this.router.navigate(['/app/admin/finance/charge/view', charge.id]);
    }

    // Export methods
    exportExcel(type: string): void {
        // Implementation for Excel export
        console.log(`Exporting ${type} to Excel...`);
    }

    exportPdf(type: string): void {
        // Implementation for PDF export
        console.log(`Exporting ${type} to PDF...`);
    }

    exportCSV(type: string): void {
        // Implementation for CSV export
        console.log(`Exporting ${type} to CSV...`);
    }

    // Getters and setters
    get comptes(): Array<CompteDto> {
        return this.compteService.items;
    }

    set comptes(value: Array<CompteDto>) {
        this.compteService.items = value;
    }

    get compteCharges(): Array<CompteChargeDto> {
        return this.compteChargeService.items;
    }

    set compteCharges(value: Array<CompteChargeDto>) {
        this.compteChargeService.items = value;
    }

    get banques(): Array<BanqueDto> {
        return this.banqueService.items;
    }

    set banques(value: Array<BanqueDto>) {
        this.banqueService.items = value;
    }

    get caisses(): Array<CaisseDto> {
        return this.caisseService.items;
    }

    set caisses(value: Array<CaisseDto>) {
        this.caisseService.items = value;
    }

    get charges(): Array<ChargeDto> {
        return this._charges;
    }

    set charges(value: Array<ChargeDto>) {
        this._charges = value;
    }

    get totalBanques(): number {
        return this._totalBanques;
    }

    get totalCaisses(): number {
        return this._totalCaisses;
    }

    get totalCharges(): number {
        return this._totalCharges;
    }

    get totalDebitsBanques(): number {
        return this._totalDebitsBanques;
    }

    get totalCreditsBanques(): number {
        return this._totalCreditsBanques;
    }

    get totalDebitsCaisses(): number {
        return this._totalDebitsCaisses;
    }

    get totalCreditsCaisses(): number {
        return this._totalCreditsCaisses;
    }
}
