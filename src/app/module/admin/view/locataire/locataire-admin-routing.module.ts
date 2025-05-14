
// const root = environment.rootAppUrl;



import {UserListComponent} from 'src/app/module/security/user/list/user-list.component';
import {ModelPermissionListComponent} from 'src/app/module/security/model-permission/list/model-permission-list.component';
import {ActionPermissionListComponent} from 'src/app/module/security/action-permission/list/action-permission-list.component';
import {ModelPermissionUserListComponent} from 'src/app/module/security/model-permission-utilisateur/list/model-permission-user-list.component';
import {RoleListComponent} from 'src/app/module/security/role/list/role-list.component';



import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AuthGuard} from 'src/app/zynerator/security/guards/auth.guard';



import { StatutLocalListAdminComponent } from './statut-local/list/statut-local-list-admin.component';
import { LocataireListAdminComponent } from './locataire/list/locataire-list-admin.component';
import { TypeLocataireListAdminComponent } from './type-locataire/list/type-locataire-list-admin.component';
import { LocationListAdminComponent } from './location/list/location-list-admin.component';
import { ModePaiementListAdminComponent } from './mode-paiement/list/mode-paiement-list-admin.component';
import { TransactionListAdminComponent } from './transaction/list/transaction-list-admin.component';
import { TypePaiementListAdminComponent } from './type-paiement/list/type-paiement-list-admin.component';
import {AvoirListAdminComponent} from "./avoir/list/avoir-list-admin.component";
import {ReglementListAdminComponent} from "./reglement/list/reglement-list-admin.component";
import {LocataireCreateAdminComponent} from "./locataire/create/locataire-create-admin.component";
import {AvoirCreateAdminComponent} from "./avoir/create/avoir-create-admin.component";
import {ReglementCreateAdminComponent} from "./reglement/create/reglement-create-admin.component";
import {CreateForInstantaneeComponent} from "./reglement/create-for-instantanee/create-for-instantanee.component";
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

                            path: 'reglement',
                            children: [
                                {
                                    path: 'list',
                                    component: ReglementListAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'create',
                                    component: ReglementCreateAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'create-for-instantanee',
                                    component: CreateForInstantaneeComponent ,
                                    canActivate: [AuthGuard]
                                },
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

                            path: 'statut-local',
                            children: [
                                {
                                    path: 'list',
                                    component: StatutLocalListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'locataire',
                            children: [
                                {
                                    path: 'list',
                                    component: LocataireListAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'create',
                                    component: LocataireCreateAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'edit',
                                    component: LocataireListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },
                        {

                            path: 'avoir',
                            children: [
                                {
                                    path: 'list',
                                    component: AvoirListAdminComponent ,
                                    canActivate: [AuthGuard]
                                },
                                {
                                    path: 'create',
                                    component: AvoirCreateAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },
                        {

                            path: 'type-locataire',
                            children: [
                                {
                                    path: 'list',
                                    component: TypeLocataireListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'location',
                            children: [
                                {
                                    path: 'list',
                                    component: LocationListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'mode-paiement',
                            children: [
                                {
                                    path: 'list',
                                    component: ModePaiementListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'transaction',
                            children: [
                                {
                                    path: 'list',
                                    component: TransactionListAdminComponent ,
                                    canActivate: [AuthGuard]
                                }
                            ]
                        },

                        {

                            path: 'type-paiement',
                            children: [
                                {
                                    path: 'list',
                                    component: TypePaiementListAdminComponent ,
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
export class LocataireAdminRoutingModule { }
