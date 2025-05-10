import { Component, ElementRef } from '@angular/core';
import { AppLayoutModule } from './app.layout.module';
@Component({
    selector: 'app-sidebar',
    imports: [AppLayoutModule],
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent {
    constructor(public el: ElementRef) { }
}

