import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickerController } from '@ionic/angular';
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
  - reconnection avec le dernier profil utilisé si save
  - ion-loading (afficher un spinner ou un message pendant les chargements de data et la recherche de questions)
  - stockage des datas de réussite de l'utilisateur
  - ajouter des icones de navigation
  - ajouter une page de consultation des stats du joueur
  - gérer les Tokens d'appel à l'api
  - gérer la vérif du pseudo avec l'évènement ionChange sur l'input
*/

export class HomePage implements OnInit {

  difficultes: string[] = ['Easy', 'Medium', 'Hard'];
  values: number[] = [2, 5, 8, 10, 15, 20];
  categories: Categorie[] = [];
  difficulteChoisie: string;
  categoriesChoisies: Categorie[] = [];
  user: User;
  isOldUser = false;

  constructor(
    private msgCtrl: MessageModule,
    private openTriviaService: OpenTriviaService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.user = this.userService.currentUser;
    this.openTriviaService.getCategories()
      .then((result: Categorie[]) => {
        this.categories = result;
        this.categoriesChoisies.push(this.categories[0]);
      })
      .catch(error => {
        this.msgCtrl.toast(error);
      });
  }

  identify() {
    if (this.user.pseudo.trim().length < 3) {
      this.msgCtrl.toast('Veuillez rentrer un pseudo d\'au moins 3 caractères');
      return;
    }
    if (this.user.pseudo.toLowerCase() === 'anonymous') { this.user.save = false; }
    this.userService.getUser(this.user)
    .then((result: User) => {
      this.user = result;
      this.isOldUser = true;
    })
    .catch(error => {
      this.msgCtrl.toast(error);
    });
  }

  start() {
    if (this.user.pseudo.toLowerCase() === 'anonymous' && this.user.save) {
      this.msgCtrl.toast('Pseudo non valide !');
      return;
    }
    else {
      this.openTriviaService.selectedCategories = this.categoriesChoisies;
      this.router.navigate(['/jeu']);
    }
  }

  compareCategories(c1: Categorie, c2: Categorie): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}


