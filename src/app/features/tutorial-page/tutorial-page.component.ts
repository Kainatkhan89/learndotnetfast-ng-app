import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TutorialService} from "../../core/services/tutorial/tutorial.service";
import {Subscription} from "rxjs";
import {ITutorial} from "../../core/models/learning-path/tutorial.model";
import {LoadingSpinnerComponent} from "../../shared/loading-spinner/loading-spinner.component";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {VideoPlayerComponent} from "./video-player/video-player.component";
import {UserLearningDataService} from "../../core/services/user-learning-data/user-learning-data.service";
import {ILearningPath} from "../../core/models/learning-path/learning-path.model";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'lsbf-tutorial-page',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    NgSwitch,
    NgSwitchCase,
    VideoPlayerComponent,
    NgIf,
    NgForOf,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './tutorial-page.component.html',
  styleUrl: './tutorial-page.component.css'
})
export class TutorialPageComponent implements OnInit, OnDestroy {
  private _userLearningDataService: UserLearningDataService = inject(UserLearningDataService);
  private _userLearningDataSubscription: Subscription | undefined;

  userLearningData: ILearningPath | undefined;

  ngOnInit(): void {
    this._subscribeToUserLearningData$();
  }

  ngOnDestroy(): void {
     this._userLearningDataSubscription?.unsubscribe();
  }

  private _subscribeToUserLearningData$(): void {
    this._userLearningDataSubscription = this._userLearningDataService.userLearningData$?.subscribe(value => {
      this.userLearningData = value;
    });
  }
}
