import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MerchantsMenusPage } from './merchants-menus';

@NgModule({
  declarations: [
    MerchantsMenusPage,
  ],
  imports: [
    IonicPageModule.forChild(MerchantsMenusPage),
  ],
})
export class MerchantsMenusPageModule {}
