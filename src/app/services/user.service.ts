import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: User = null;
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
}

  async getUser(pseudo: string): User {
    if ()
    return this.currentUser;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    if (user.sauvegarde)
      await this._storage.set(user.pseudo, JSON.stringify(user));
  }

}
