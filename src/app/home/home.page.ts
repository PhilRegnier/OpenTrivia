import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categorie } from '../models/categorie';
import { User } from '../models/user';
import { OpenTriviaService } from '../services/opentrivia.service';
import { UserService } from '../services/user.service';
import { MessageModule } from '../tools/message/message.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

/*
TODO:
  - Créer un utilisateur "anonyme"
  - stockage des datas de réussite de l'utilisateur
  - ajouter des icones de navigation
  - ajouter une page de consultation des stats du joueur
  - gérer les Tokens d'appel à l'api
  - gérer la vérif du pseudo avec l'évènement ionChange sur l'input
*/

export class HomePage implements OnInit {

  pseudo: string = "";
  difficultes: string[] = ["Easy", "Medium", "Hard"];
  values: number[] = [2, 5, 8, 10];
  categories: Categorie[] = [];
  nbQuestions: number = 5;
  sauvegarde: boolean = false;
  difficulteChoisie: string = "Easy";
  categoriesChoisies: Categorie[] = [];

  constructor(
    private msgCtrl: MessageModule,
    private openTriviaService: OpenTriviaService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (this.userService.currentUser) {
      this.pseudo = this.userService.currentUser.pseudo;
      this.sauvegarde = this.userService.currentUser.sauvegarde;
      this.nbQuestions = this.userService.currentUser.nbQuestions;
    };
    this.openTriviaService.getCategories()
      .then((result: Categorie[]) => {
        this.categories = result;
        this.categoriesChoisies.push(this.categories[0]);
      })
      .catch(error => {
        this.msgCtrl.toast(error);
      });
  }

  start() {
    if (this.pseudo === "" && this.pseudo.trim().length < 3) {
      this.msgCtrl.toast('Veuillez rentrer un pseudo');
    }
    else {
      if (this.userService.getUser(this.pseudo, this.sauvegarde) == null) {
        let user: User = {
          pseudo: this.pseudo,
          nbQuestions: this.nbQuestions,
          difficulty: this.difficulteChoisie,
          sauvegarde: this.sauvegarde,
          score: 0
        };
        this.userService.setCurrentUser(user);
      }
      this.openTriviaService.selectedCategories = this.categoriesChoisies;
      this.router.navigate(['/jeu']);
    }
  }

  compareCategories(c1: Categorie, c2: Categorie): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  reset() {
    this.nbQuestions = 5;
  }

}


