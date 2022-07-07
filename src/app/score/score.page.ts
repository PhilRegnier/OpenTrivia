import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
})
export class ScorePage implements OnInit {

  pseudo: string = "";
  score: number = 0;
  maxScore: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.pseudo = this.userService.currentUser.pseudo;
    this.score = this.userService.currentUser.score;
    this.maxScore = this.activatedRoute.snapshot.params.maxScore;
  }

  restart() {
    this.router.navigate(['/home']);
  }

}
