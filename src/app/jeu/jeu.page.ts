import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../models/question';
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

  pseudo: string = "";
  difficulteChoisie: string = "";

  score: number = 0;
  maxTime: number = 10;
  timer: ReturnType<typeof setInterval>;
  counter: number = 0;
  isTimer: boolean = false;

  questions: Question[];
  currentQuestion: Question;
  index: number = 0;
  answers: string[];
  verdict: string;

  isAnswered: boolean = false;
  isEnding: boolean = false;

  constructor(
    private msgCtrl: MessageModule,
    private router: Router,
    private openTriviaService: OpenTriviaService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.score = 0;
    this.questions = [];
    this.pseudo = this.userService.currentUser.pseudo;
    this.difficulteChoisie = this.userService.currentUser.difficulty;
    this.openTriviaService.getQuestions(
        this.difficulteChoisie,
        this.userService.currentUser.nbQuestions,
        this.openTriviaService.selectedCategories[Math.floor(Math.random() * this.openTriviaService.selectedCategories.length)]
        )
        .then((result: Question[]) => {
          this.questions = result;
          this.showNextQuestion();
        })
        .catch(error => {
          this.msgCtrl.toast(error);
        });
  }

  count() {
    this.counter--;
    if (this.counter == 0) {
      this.msgCtrl.toast('Temps expiré !')
      this.answer("");
    }
  }

  showNextQuestion() {
    this.currentQuestion = this.questions[this.index];
    this.index++;
    this.answers = [];
    this.isAnswered = false;
    this.isTimer = true;
    for (let answer of this.currentQuestion.incorrect_answers) {
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
        this.verdict = "Bravo !";
        this.score++;
      }
      else {
        if (this.counter == 0)
          this.verdict = "Trop tard"
        else
          this.verdict ="Faux !"
      }
      if (this.index >= this.questions.length) {
        this.isEnding = true;
      }
    }
  }

  showScore() {
    this.userService.currentUser.score = this.score;
    this.router.navigate(['/score', this.questions.length]);
  }

}
