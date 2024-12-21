import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { OtherComponent } from './other/other.component';

const routes: Routes = [
  { path: '', component: AppComponent }, // Default route
  { path: 'users', component: UserListComponent },
  { path: 'other', component: OtherComponent },
  { path: '**', redirectTo: '' }, // Redirect invalid paths to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutesModule {}

export { routes };
