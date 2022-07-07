import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: User;
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
    this.currentUser = {
      pseudo: 'anonymous',
      score: 0,
      save: false,
      difficulty: 'Easy',
      nbQuestions: 5
    };
  }

  async init() {
    // eslint-disable-next-line no-underscore-dangle
    this._storage = await this.storage.create();
}

  async getUser(user: User): Promise<User> {
    // eslint-disable-next-line no-underscore-dangle
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-underscore-dangle
      this._storage.get(user.pseudo)
        .then((result: any) => {
          if (result.value != null) {
            this.currentUser = result.value;
          } else {
            this.currentUser = user;
          }
          resolve(this.currentUser);
        })
        .catch(error => {
          reject('Impossible d\'accéder au service de stockage');
        });
    });
  }

  async setCurrentUser(user: User) {
    this.currentUser = user;
    if (user.save) {
      // eslint-disable-next-line no-underscore-dangle
      await this._storage.set(user.pseudo, JSON.stringify(user));
    }
  }

}
