import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {LayoutService} from 'src/app/layout/service/layout.service';
import {RoleService} from "src/app/zynerator/security/shared/service/Role.service";
import {AppComponent} from "src/app/app.component";
import {AuthService} from "src/app/zynerator/security/shared/service/Auth.service";
import {Router} from "@angular/router";
import {AppLayout} from "./app.layout.component";
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
  model: MenuItem[] = [];
  modelanonymous: MenuItem[] = [];
    modelAdmin: MenuItem[] = [];
constructor(public layoutService: LayoutService, public app: AppComponent, public appMain: AppLayout, private roleService: RoleService, private authService: AuthService, private router: Router) { }
  ngOnInit() {
      this.modelAdmin = [
         /* {
              label: 'Home',
              items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/app/admin'] }]
          },*/
          {
              label: '',
              icon: 'pi pi-fw pi-briefcase',
              items: [
                  {
                      label: 'Locaux',
                      icon: 'pi pi-fw pi-building',
                      items: [
                          {
                              label: 'Creation',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/app/admin/locaux/local/create']
                          },/*
                          {
                              label: 'Saisie',
                              icon: 'pi pi-fw pi-pencil',
                              routerLink: ['/app/admin/locaux/local/edit']
                          },*/
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/locaux/local/list']
                          },
                      ]
                  },
                  {
                      label: 'Locataires',
                      icon: 'pi pi-fw pi-users',
                      items: [
                          {
                              label: 'Creation',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/app/admin/locataire/locataire/create']
                          },
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/locataire/locataire/list']
                          }

                      ]
                  },

                  {
                      label: 'Banques',
                      icon: 'pi pi-fw pi-wallet',
                      items: [
                          {
                                  label: 'Creation',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/app/admin/finance/banque/create']
                          },
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/finance/banque/list']
                          },
                      ]
                  },
                  {
                      label: 'Caisses',
                      icon: 'pi pi-fw pi-box',
                      items: [
                          {
                              label: 'Creation',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/app/admin/finance/caisse/create']
                          },
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/finance/caisse/list']
                          }
                      ]
                  },
                  {
                      label: 'Charges',
                      icon: 'pi pi-fw pi-calculator',
                      items: [
                          {
                              label: 'Saisie',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/app/admin/finance/charge/create'],
                          },
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/finance/charge/list']
                          }
                      ]
                  },

                  {
                      label: 'Reglements',
                      icon: 'pi pi-fw pi-wallet',
                      items: [
                          {
                              label: 'Saisie pour Locataire',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/app/admin/locataire/reglement/create']
                          },
                          {
                              label: 'Saisie pour Instantanée',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/app/admin/locataire/reglement/create-for-instantanee']
                          },
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/locataire/reglement/list']
                          }
                      ]
                  },
                  {
                      label: 'Avoirs',
                      icon: 'pi pi-fw pi-money-bill',
                      items: [
                          {
                              label: 'Saisie',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/app/admin/locataire/avoir/create']
                          },
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/locataire/avoir/list']
                          }
                      ]
                  },

                  {
                      label: 'Comptes Instantanés',
                      icon: 'pi pi-fw pi-wallet',
                      items: [
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/finance/compte-instantanee/list']
                          },
                          {
                              label: 'Création',
                              icon: 'pi pi-fw pi-plus',
                              routerLink: ['/app/admin/finance/compte-instantanee/create']
                          }
                      ]
                  },
                   {
                       label: 'Comptes Charge',
                        icon: 'pi pi-fw pi-wallet',
                        items: [
                            {
                                label: 'Consultation',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/app/admin/finance/compte-charge/list']
                            },
                            {
                                label: 'Création',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/app/admin/finance/compte-charge/create']
                            }
                        ]
                   },
                  {
                      label: 'Comptes Locataire',
                      icon: 'pi pi-fw pi-wallet',
                      items: [
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/finance/compte-locataire/list']
                          }
                      ]
                  },
                  {
                      label: 'Relevé General',
                      icon: 'pi pi-fw pi-wallet',
                      items: [
                          {
                              label: 'Consultation',
                              icon: 'pi pi-fw pi-list',
                              routerLink: ['/app/admin/finance/releve-general']
                          }
                      ]
                  },
                 /* {
                      label: 'Administration',
                      icon: 'pi pi-fw pi-shield',
                      items: [
                          {
                              label: 'Utilisateurs',
                              icon: 'pi pi-fw pi-user',
                              routerLink: ['/app/admin/security/user/list']
                          },
                          {
                              label: 'Permissions',
                              icon: 'pi pi-fw pi-lock',
                              items: [
                                  {
                                      label: 'Modèles',
                                      icon: 'pi pi-fw pi-table',
                                      routerLink: ['/app/admin/security/model-permission/list']
                                  },
                                  {
                                      label: 'Actions',
                                      icon: 'pi pi-fw pi-key',
                                      routerLink: ['/app/admin/security/action-permission/list']
                                  }
                              ]
                          }
                      ]
                  }*/
              ]
          }
      ];


     /* this.modelAdmin =
          [
              {
                  label: 'Home',
                  items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/app/admin'] }]
              },
              {
                  label: 'Pages',
                  icon: 'pi pi-fw pi-briefcase',
                  items: [
                      {
                          label: 'Gestion Charges',
                          icon: 'pi pi-wallet',
                          items: [
                              {
                                  label: 'Liste charge',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/finance/charge/list']
                              },
                          ]
                      },
                      {
                          label: 'Gestion Banques',
                          icon: 'pi pi-wallet',
                          items: [
                              {
                                  label: 'Liste banque',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/finance/banque/list']
                              },
                              {
                                  label: 'Liste compte',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/finance/compte/list']
                              },
                              {
                                  label: 'Liste compte locataire',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/finance/compte-locataire/list']
                              },
                          ]
                      },
                      {
                          label: 'Gestion Locataires',
                          icon: 'pi pi-wallet',
                          items: [
                              {
                                  label: 'Liste statut local',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/locataire/statut-local/list']
                              },
                              {
                                  label: 'Liste locataire',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/locataire/locataire/list']
                              },
                              {
                                  label: 'Liste type locataire',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/locataire/type-locataire/list']
                              },
                              {
                                  label: 'Liste location',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/locataire/location/list']
                              },
                              {
                                  label: 'Liste mode paiement',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/locataire/mode-paiement/list']
                              },
                              {
                                  label: 'Liste transaction',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/locataire/transaction/list']
                              },
                              {
                                  label: 'Liste type paiement',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/locataire/type-paiement/list']
                              },
                          ]
                      },
                      {
                          label: 'Gestion Locaux Commerciaux',
                          icon: 'pi pi-wallet',
                          items: [
                              {
                                  label: 'Liste local',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/locaux/local/list']
                              },
                          ]
                      },
                      {
                          label: 'Gestion Caisses',
                          icon: 'pi pi-wallet',
                          items: [
                              {
                                  label: 'Liste caisse',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/finance/caisse/list']
                              },
                          ]
                      },

                      {
                          label: 'Security Management',
                          icon: 'pi pi-wallet',
                          items: [
                              {
                                  label: 'List User',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/security/user/list']
                              },
                              {
                                  label: 'List Model',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/security/model-permission/list']
                              },
                              {
                                  label: 'List Action Permission',
                                  icon: 'pi pi-fw pi-plus-circle',
                                  routerLink: ['/app/admin/security/action-permission/list']
                              },
                          ]
                      }
                  ]
              }
          ];*/

        if (this.authService.authenticated) {
            if (this.authService.authenticatedUser.roleUsers) {
              this.authService.authenticatedUser.roleUsers.forEach(role => {
                  const roleName: string = this.getRole(role.role.authority);
                  this.roleService._role.next(roleName.toUpperCase());
                  eval('this.model = this.model' + this.getRole(role.role.authority));
              })
            }
        }
  }

    getRole(text){
        const [role, ...rest] = text.split('_');
        return this.upperCaseFirstLetter(rest.join(''));
    }

    upperCaseFirstLetter(word: string) {
      if (!word) { return word; }
      return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }


}
