import { Routes } from '@angular/router';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { PokemonComponent } from './pokemon/pokemon.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {  path: 'main-nav',  component: MainNavComponent,

      children: [
        { path: '', redirectTo: 'profile', pathMatch: 'full' },
        { path: 'users', component: UsersComponent },
        { path: 'pokemon', component: PokemonComponent }
      ]
     }
  ];