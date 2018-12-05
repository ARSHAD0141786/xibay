import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsAndPoliciesPage } from './terms-and-policies';

@NgModule({
  declarations: [
    TermsAndPoliciesPage,
  ],
  imports: [
    IonicPageModule.forChild(TermsAndPoliciesPage),
  ],
})
export class TermsAndPoliciesPageModule {}
