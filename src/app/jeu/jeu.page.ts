import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Question } from '../models/question';
import { User } from '../models/user';
import { OpenTriviaService } from '../services/opentrivia.service';
import { UserService } from '../services/user.service';
import { MessageModule } from '../tools/message/message.module';
import { ToolsModule } from '../tools/tools.module';

@Component({
  selector: 'app-jeu',
  templateUrl: './jeu.page.html',
  styleUrls: ['./jeu.page.scss'],
})
export class JeuPage implements OnInit {

  user: User;

  score: number;
  maxTime = 10;
  timer: ReturnType<typeof setInterval>;
  counter: number;
  isTimer = false;

  questions: Question[];
  currentQuestion: Question;
  index: number;
  answers: string[];
  verdict: string;

  isAnswered: boolean;
  isEnding: boolean;

  constructor(
    private msgCtrl: MessageModule,
    private router: Router,
    private loadingCtrl: LoadingController,
    private openTriviaService: OpenTriviaService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading the quiz...',
      duration: 10000,
      spinner: 'crescent'
    });
    loading.present();
    this.score = 0;
    this.index = 0;
    this.questions = [];
    this.user = this.userService.currentUser;
    this.openTriviaService.getQuestions(
        this.user.difficulty,
        this.user.nbQuestions,
        this.openTriviaService.selectedCategories[Math.floor(Math.random() * this.openTriviaService.selectedCategories.length)]
        )
        .then((result: Question[]) => {
          this.questions = result;
          loading.dismiss();
          this.showNextQuestion();
        })
        .catch(error => {

          loading.dismiss();
          this.msgCtrl.toast(error);
          this.router.navigate(['/home']);
        });
  }

  count() {
    this.counter--;
    if (this.counter === 0) {
      this.msgCtrl.toast('Temps expiré !');
      this.answer('');
    }
  }

  showNextQuestion() {
    this.currentQuestion = this.questions[this.index];
    this.index++;
    this.answers = [];
    this.isAnswered = false;
    this.isTimer = true;
    for (const answer of this.currentQuestion.incorrect_answers) {
      this.answers.push(answer);
    }
    this.answers.push(this.currentQuestion.correct_answer);
    ToolsModule.shuffle(this.answers);
    this.counter = this.maxTime;
    this.timer = setInterval(this.count.bind(this), 1000);
  }

  answer(choix: string) {
    if (!this.isAnswered) {
      clearInterval(this.timer);
      this.isTimer = false;
      this.isAnswered = true;
      if (choix === this.currentQuestion.correct_answer) {
        this.verdict = 'Bravo !';
        this.score++;
      }
      else {
        if (this.counter === 0) {
          this.verdict = 'Trop tard';
        } else {
          this.verdict = 'Faux !';
        }
      }
      if (this.index >= this.questions.length) {
        this.isEnding = true;
      }
    }
  }

  showScore() {
    this.user.score = this.score;
    this.router.navigate(['/score', this.questions.length]);
  }

}
