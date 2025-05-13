
// const root = environment.rootAppUrl;



import {UserListComponent} from 'src/app/module/security/user/list/user-list.component';
import {ModelPermissionListComponent} from 'src/app/module/security/model-permission/list/model-permission-list.component';
import {ActionPermissionListComponent} from 'src/app/module/security/action-permission/list/action-permission-list.component';
import {ModelPermissionUserListComponent} from 'src/app/module/security/model-permission-utilisateur/list/model-permission-user-list.component';
import {RoleListComponent} from 'src/app/module/security/role/list/role-list.component';



import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AuthGuard} from 'src/app/zynerator/security/guards/auth.guard';



import { CaisseListAdminComponent } from './caisse/list/caisse-list-admin.component';
import { BanqueListAdminComponent } from './banque/list/banque-list-admin.component';
import { CompteListAdminComponent } from './compte/list/compte-list-admin.component';
import { ChargeListAdminComponent } from './charge/list/charge-list-admin.component';
import { CompteLocataireListAdminComponent } from './compte-locataire/list/compte-locataire-list-admin.component';
import {CompteChargeListAdminComponent} from "./compte-charge/list/compte-charge-list-admin.component";
import {CompteAdminListAdminComponent} from "./compte-admin/list/compte-admin-list-admin.component";
import {CaisseCreateAdminComponent} from "./caisse/create/caisse-create-admin.component";
import {BanqueCreateAdminComponent} from "./banque/create/banque-create-admin.component";
import {ChargeCreateAdminComponent} from "./charge/create/charge-create-admin.component";
import {CompteChargeCreateAdminComponent} from "./compte-charge/create/compte-charge-create-admin.component";
import {
    CompteInstantaneeCreateAdminComponent
} from "./compte-instantanee/create/compte-instantanee-create-admin.component";
import {CompteInstantaneeListAdminComponent} from "./compte-instantanee/list/compte-instantanee-list-admin.component";
import {ReleverGeneraleComponent} from "./relever-generale/relever-generale.component";
@NgModule({
    imports: [
        RouterModule.forChild(
            [
                {
                    path: '',
                    children: [
                        {

                            path: 'action-permission',
                            children: [
                                {
                                    path: 'list',
                                    component: ActionPermissionListComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'model-permission-user',
                            children: [
                                {
                                    path: 'list',
                                    component: ModelPermissionUserListComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },
                        {

                            path: 'role',
                            children: [
                                {
                                    path: 'list',
                                    component: RoleListComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },
                        {

                            path: 'user',
                            children: [
                                {
                                    path: 'list',
                                    component: UserListComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'model-permission',
                            children: [
                                {
                                    path: 'list',
                                    component: ModelPermissionListComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },


                        {

                            path: 'caisse',
                            children: [
                                {
                                    path: 'list',
                                    component: CaisseListAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'create',
                                    component: CaisseCreateAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'banque',
                            children: [
                                {
                                    path: 'list',
                                    component: BanqueListAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'create',
                                    component: BanqueCreateAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },
                        {
                            path: 'releve-general',
                            component: ReleverGeneraleComponent ,
                            canActivate: [AuthGuard]
                        },

                        {

                            path: 'compte',
                            children: [
                                {
                                    path: 'list',
                                    component: CompteListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },
                        {

                            path: 'compte-admin',
                            children: [
                                {
                                    path: 'list',
                                    component: CompteAdminListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'compte-charge',
                            children: [
                                {
                                    path: 'list',
                                    component: CompteChargeListAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'create',
                                    component: CompteChargeCreateAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },
                        {

                            path: 'compte-instantanee',
                            children: [
                                {
                                    path: 'list',
                                    component: CompteInstantaneeListAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'create',
                                    component: CompteInstantaneeCreateAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },


                        {

                            path: 'compte-locataire',
                            children: [
                                {
                                    path: 'list',
                                    component: CompteLocataireListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },
                        {

                            path: 'charge',
                            children: [
                                {
                                    path: 'list',
                                    component: ChargeListAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'create',
                                    component: ChargeCreateAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'compte-locataire',
                            children: [
                                {
                                    path: 'list',
                                    component: CompteLocataireListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                    ]
                },
            ]
        ),
    ],
    exports: [RouterModule],
})
export class FinanceAdminRoutingModule { }
