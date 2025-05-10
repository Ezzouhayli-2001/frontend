import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from 'src/app/zynerator/security/guards/auth.guard';
import { Landing } from './pages/landing/landing';
import { AppLayout } from 'src/app/layout/component/app.layout.component';
import { Notfound } from 'src/app/pages/notfound/notfound';

import {LoginAdminComponent} from 'src/app/module/admin/login-admin/login-admin.component';
import {RegisterAdminComponent} from 'src/app/module/admin/register-admin/register-admin.component';
import {ChangePasswordAdminComponent} from 'src/app/module/admin/change-password-admin/change-password-admin.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
               /* {path: '', component: Landing},*/
                {path: 'notfound', component: Notfound },
                /*{path: 'admin/login', component: LoginAdminComponent },*/
                {path: '', component: LoginAdminComponent },
                {path: 'admin/register', component: RegisterAdminComponent },
                {path: 'admin/changePassword', component: ChangePasswordAdminComponent },
                {
                    path: 'app',
                    component: AppLayout,
                    children: [
                        {
                            path: 'admin',
                            loadChildren: () => import( './module/admin/admin-routing.module').then(x => x.AdminRoutingModule),
                            canActivate: [AuthGuard],
                        },
                    ],
                    canActivate: [AuthGuard]
                },
            ],
                { scrollPositionRestoration: 'enabled' }
            ),
        ],
    exports: [RouterModule],
    })
export class AppRoutingModule { }
