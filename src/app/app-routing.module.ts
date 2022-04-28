import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'marvel-characters',
    loadChildren: () => import('@app-smart-test/marvel-characters/character-list/character-list.module').then(m => m.CharacterListModule),
  },
  { path: '**', redirectTo: 'marvel-characters', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
