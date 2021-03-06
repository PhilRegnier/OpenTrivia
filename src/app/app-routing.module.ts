import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'jeu',
    loadChildren: () => import('./jeu/jeu.module').then( m => m.JeuPageModule)
  },
  {
    path: 'score/:maxScore',
    loadChildren: () => import('./score/score.module').then( m => m.ScorePageModule)
  },
  {
    path: 'stat',
    loadChildren: () => import('./stat/stat.module').then( m => m.StatPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
