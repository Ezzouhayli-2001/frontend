import { Component } from '@angular/core';
import {LayoutService} from 'src/app/layout/service/layout.service';

@Component({
    selector: 'app-footer',
    standalone: false,
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent {
    constructor(public layoutService: LayoutService) { }
}
