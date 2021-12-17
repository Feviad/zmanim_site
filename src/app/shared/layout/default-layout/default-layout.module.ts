import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefaultLayoutComponent} from './default-layout.component';
import {DefaultLayoutFormDirective} from './default-layout-form.directive';
import {DefaultLayoutInfoDirective} from './default-layout-info.directive';
import {TuiIslandModule} from '@taiga-ui/kit';


@NgModule({
  declarations: [
    DefaultLayoutComponent,
    DefaultLayoutFormDirective,
    DefaultLayoutInfoDirective
  ],
  exports: [
    DefaultLayoutComponent,
    DefaultLayoutFormDirective,
    DefaultLayoutInfoDirective
  ],
  imports: [
    CommonModule,
    TuiIslandModule
  ]
})
export class DefaultLayoutModule {
}
