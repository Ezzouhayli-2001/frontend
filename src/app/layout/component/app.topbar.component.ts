import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem, SelectItem } from 'primeng/api';
import {LayoutService} from 'src/app/layout/service/layout.service';
import {AppLayout} from './app.layout.component';
import {AppComponent} from 'src/app/app.component';
import {TranslateModule,TranslateService} from '@ngx-translate/core';
import {UserService} from 'src/app/zynerator/security/shared/service/User.service';
import {UserDto} from 'src/app/zynerator/security/shared/model/User.model';
import {AuthService} from 'src/app/zynerator/security/shared/service/Auth.service';
import { NgClass, NgForOf } from '@angular/common';
import { StyleClass } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { Popover } from 'primeng/popover';
import { Dialog } from 'primeng/dialog';
import { TabPanel, TabView } from 'primeng/tabview';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-topbar',
    imports: [AppConfigurator, Popover, Dialog, TabView, TabPanel, TranslateModule, NgClass, StyleClass, FormsModule, NgForOf],
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{
    roleAdmin = false;
    editDialog = false ;
    items!: MenuItem[];
    languageOptions: SelectItem[];
    selectedLanguage: string = 'en';




    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
    public async edit(dto: UserDto) {
        this.userService.findByUsername(dto.username).subscribe(res => {
            this.item = res;
            this.editDialog = true;
        });

    }
    public editUser(){
        this.userService.edit().subscribe(data => this.authenticatedUser = data);
        this.authService.loadInfos();
        this.editDialog = false;
    }

    public hideEditDialog() {
        this.editDialog = false;
    }



    constructor(public  layoutService:LayoutService ,public app: AppComponent, public appMain: AppLayout, private authService: AuthService, private translateService: TranslateService, private userService: UserService) {
        this.languageOptions = [
            { label: 'English', value: 'en' },
            { label: 'Français', value: 'fr' },
            { label: 'العربية', value: 'ar' }
        ];
    }

    useLanguage(language: string): void {
        this.translateService.use(language);
    }
    ngOnInit(): void {
        this.authService.loadInfos();
        if ( this.authService.authenticatedUser.roleUsers[0].role.authority === 'ROLE_ADMIN') {
            this.roleAdmin = true;
        }
    }

    logout(){
        this.authService.logout();
    }
    get item(): UserDto {
        return this.userService.item;
    }

    set item(value: UserDto) {
        this.userService.item = value;
    }
    get authenticatedUser(): UserDto{
        return this.authService.authenticatedUser;
    }
    set authenticatedUser(userDto: UserDto){
        this.authService.authenticatedUser = userDto;
    }


}
