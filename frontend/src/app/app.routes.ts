import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersTableComponent } from './users-table/users-table.component';

export const routes: Routes = [
  { path: 'users', component: UsersTableComponent},{
    path: '', component: UsersTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule{ }
