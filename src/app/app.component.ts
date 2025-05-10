import { Component, OnInit } from '@angular/core';
import {RoleService} from "./zynerator/security/shared/service/Role.service";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";

@Component({
    selector: 'app-root',
    standalone:false,
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    ripple = true;
    private role$: Observable<string>;


    constructor( private roleService: RoleService, private translateService: TranslateService) {
        translateService.addLangs(['ar','en', 'fr']);
        translateService.setDefaultLang('en');
        const browserLang = translateService.getBrowserLang();
        console.log('browser lang ==>  ' +browserLang);
        translateService.use('en');
        //translateService.use(browserLang.match(/ar|en|fr/) ? browserLang : 'eng');
    }

    ngOnInit() {

    }
}
