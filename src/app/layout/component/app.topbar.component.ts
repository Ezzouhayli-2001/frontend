import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem, MessageService, SelectItem} from 'primeng/api';
import {LayoutService} from 'src/app/layout/service/layout.service';
import {AppLayout} from './app.layout.component';
import {AppComponent} from 'src/app/app.component';
import {TranslateModule,TranslateService} from '@ngx-translate/core';
import {UserService} from 'src/app/zynerator/security/shared/service/User.service';
import {UserDto} from 'src/app/zynerator/security/shared/model/User.model';
import {AuthService} from 'src/app/zynerator/security/shared/service/Auth.service';
import {CommonModule, NgClass, NgForOf} from '@angular/common';
import { StyleClass } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { Popover } from 'primeng/popover';
import { Dialog } from 'primeng/dialog';
import { TabPanel, TabView } from 'primeng/tabview';
import { FormsModule } from '@angular/forms';
import {ChangePasswordRequestDto} from "../../shared/model/ChangePasswordRequestDto";
import {MessageModule} from "primeng/message";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";

@Component({
    selector: 'app-topbar',
    imports: [AppConfigurator, Popover, Dialog, TabView, TabPanel, TranslateModule, NgClass, StyleClass, FormsModule, NgForOf, ButtonModule,CommonModule,
        InputTextModule,
        MessageModule ],
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss']
})
export class AppTopBarComponent implements OnInit{
    roleAdmin = false;
    editDialog = false;
    items!: MenuItem[];
    languageOptions: SelectItem[];
    selectedLanguage: string = 'en';

    // Properties for password dialog
    passwordDialogVisible: boolean = false;
    hideCurrentPassword: boolean = true;
    hideNewPassword: boolean = true;
    hideConfirmPassword: boolean = true;

    passwordFormSubmitted: boolean = false;
    passwordError: string | null = null;
    loadingPasswordChange: boolean = false;
    preferencesDialogVisible: boolean = false;

    // Single password form object
    passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private messageService: MessageService,
        public app: AppComponent,
        public appMain: AppLayout,
        private authService: AuthService,
        private translateService: TranslateService,
        private userService: UserService
    ) {
        this.languageOptions = [
            { label: 'English', value: 'en' },
            { label: 'Français', value: 'fr' },
            { label: 'العربية', value: 'ar' }
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    public async edit(dto: UserDto) {
        this.userService.findByUsername(dto.username).subscribe(res => {
            this.item = res;
            this.editDialog = true;
        });
    }

    public editUser() {
        this.userService.edit().subscribe(data => this.authenticatedUser = data);
        this.authService.loadInfos();
        this.editDialog = false;
    }

    public hideEditDialog() {
        this.editDialog = false;
    }

    useLanguage(language: string): void {
        this.translateService.use(language);
        this.selectedLanguage = language;
    }

    ngOnInit(): void {
        this.authService.loadInfos();
        if (this.authService.authenticatedUser.roleUsers[0].role.authority === 'ROLE_ADMIN') {
            this.roleAdmin = true;
        }
    }

    logout() {
        this.authService.logout();
    }

    get item(): UserDto {
        return this.userService.item;
    }

    set item(value: UserDto) {
        this.userService.item = value;
    }

    get authenticatedUser(): UserDto {
        return this.authService.authenticatedUser;
    }

    set authenticatedUser(userDto: UserDto) {
        this.authService.authenticatedUser = userDto;
    }

    // Method to hide the password dialog
    hidePasswordDialog() {
        this.passwordDialogVisible = false;
        this.resetPasswordForm();
    }

    // Method to reset the password form
    resetPasswordForm() {
        this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
        this.passwordFormSubmitted = false;
        this.passwordError = null;
        this.hideCurrentPassword = true;
        this.hideNewPassword = true;
        this.hideConfirmPassword = true;
    }

    // Method to change the password
    changePassword() {
        this.passwordFormSubmitted = true;
        this.passwordError = null;



/*        if (!this.passwordForm.newPassword || this.passwordForm.newPassword.length < 3) {
            return;
        }*/

        if (!this.passwordForm.confirmPassword || this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
            return;
        }

        // All validations passed, proceed with password change
        this.loadingPasswordChange = true;

        // Call your password change service
        const changePasswordRequestDto: ChangePasswordRequestDto = {
            username: this.authenticatedUser.username,
            password: this.passwordForm.newPassword // Changed from passwordData.confirmPassword to passwordForm.newPassword
        };

        this.userService.changePassword(changePasswordRequestDto).subscribe(
            (response) => {
                this.loadingPasswordChange = false;
                this.hidePasswordDialog();

                // Show success message
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Votre mot de passe a été modifié avec succès',
                    life: 3000
                });
            },
            (error) => {
                this.loadingPasswordChange = false;

                // Handle error
                if (error?.error?.message) {
                    this.passwordError = error.error.message;
                } else {
                    this.passwordError = 'Une erreur est survenue lors du changement de mot de passe';
                }
            }
        );
    }

    // Method to show the password dialog
    showPasswordDialog() {
        this.passwordDialogVisible = true;
    }
}
