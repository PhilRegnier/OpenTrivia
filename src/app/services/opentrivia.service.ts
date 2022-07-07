import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categorie } from '../models/categorie';
import { OpentdbApiData } from '../models/opentdbapidata';
import { Question } from '../models/question';

@Injectable({
    providedIn: 'root'
})
export class OpenTriviaService {

    categories: Categorie[] = [];
    selectedCategories: Categorie[] =  [{id: 0, name: 'Any Category'}];

    baseUrl = 'https://opentdb.com/api.php?';

    constructor(private http: HttpClient) {}

    async getCategories(): Promise<Categorie[]> {
        return new Promise((resolve, reject) => {
            this.http.get<any>('https://opentdb.com/api_category.php').toPromise()
            .then((response) => {
                this.categories = response.trivia_categories;
                this.categories.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                this.categories.unshift(this.selectedCategories[0]);
                resolve(this.categories);
            })
            .catch(error => {
                reject('Impossible de récupérer les catégories. Veuillez vérifier votre connexion internet [' + error + ']');
            });
        });
    }

    async getQuestions(difficulty: string, amount: number, category: Categorie): Promise<Question[]> {
        return new Promise((resolve, reject) => {
            let url = this.baseUrl + 'amount=' + amount;
            if (category.id > 0) { url += 'category=' + category.id; }
            url += '&difficulty=' + difficulty.toLowerCase();
            this.http.get<OpentdbApiData>(url).toPromise()
            .then((response) => {
                resolve(response.results);
            })
            .catch(error => {
                reject('Impossible de récupérer les questions. Veuillez vérifier votre connexion internet [' + error + ']');
            });
        });
    }
}
