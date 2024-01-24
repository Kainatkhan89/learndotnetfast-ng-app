import {inject, Injectable} from '@angular/core';
import {LearningPathService} from "../learning-path/learning-path.service";
import {map, Observable, Subject} from "rxjs";
import {ITutorial} from "../../models/learning-path/tutorial.model";


@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private _learningPathService: LearningPathService = inject(LearningPathService);

  currentTutorialSubject: Subject<ITutorial> = new Subject<ITutorial>();
  currentTutorial$: Observable<ITutorial> | undefined;

  constructor() { }

  setCurrentTutorial(tutorial: ITutorial): void {
    this.currentTutorialSubject.next(tutorial);
  }

  getAllLearningPathTutorials(): Observable<ITutorial[]> {
    return this._learningPathService.getLearningPath().pipe(
      map((learningPath => {
        return learningPath.modules.flatMap(module => module.tutorials);
      }))
    );
  }

  getNextTutorial(currentTutorialId: number): Observable<ITutorial | null> {
    return this.getAllLearningPathTutorials().pipe(
      map(tutorials => {
        const currentIndex = tutorials.findIndex(tutorial => tutorial.id === currentTutorialId);
        if (currentIndex === -1 || currentIndex >= tutorials.length - 1) {
          return null;
        }
        return tutorials[currentIndex + 1];
      })
    );
  }

  isFirstTutorial(currentTutorialId: number): Observable<boolean> {
    return this.getAllLearningPathTutorials().pipe(
      map(tutorials => tutorials.findIndex(tutorial => tutorial.id === currentTutorialId) === 0)
    );
  }

  isLastTutorial(currentTutorialId: number): Observable<boolean> {
    return this.getAllLearningPathTutorials().pipe(
      map(tutorials => {
        const index = tutorials.findIndex(tutorial => tutorial.id === currentTutorialId);
        return index !== -1 && index === tutorials.length - 1;
      })
    );
  }
}
