import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {ActivatedRoute, Router} from "@angular/router";
import {
  CharacterComponent
} from "./character.component";
import {CommonModule} from "@angular/common";
import {RouterTestingModule} from "@angular/router/testing";
import {CharacterListService} from "../../services/character-list.service";
import {
  CharacterListMockService
} from "../../services/testing/character-list-mock.service";
import {ViewportInfoService} from "../../services/viewport-info.service";
import {characterListRoutes} from "../../character-list-routes";
import {
  ComicsListComponent
} from "../../components/comics-list/comics-list.component";
import {
  EventsListComponent
} from "../../components/events-list/events-list.component";
import {
  SeriesListComponent
} from "../../components/series-list/series-list.component";
import {
  StoriesListComponent
} from "../../components/stories-list/stories-list.component";
import {ComicsListService} from "../../services/comics-list.service";
import {
  ComicsListMockService
} from "../../services/testing/comics-list-mock.service";
import {StoriesListService} from "../../services/stories-list.service";
import {
  StoriesListMockService
} from "../../services/testing/stories-list-mock.service";


describe('CharacterComponent', () => {
  let fixture: ComponentFixture<CharacterComponent>;
  let testComponent: CharacterComponent;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
          {
            path: 'comics',
            component: ComicsListComponent,
          },
          {
            path: 'stories',
            component: StoriesListComponent,
          },
          {
            path: '**',
            pathMatch: 'full',
            redirectTo: 'comics',
          }
        ]),
      ],
      declarations: [
        CharacterComponent,
        ComicsListComponent,
        StoriesListComponent,
      ],
      providers: [
        { provide: CharacterListService, useClass: CharacterListMockService },
        { provide: ComicsListService, useClass: ComicsListMockService },
        { provide: StoriesListService, useClass: StoriesListMockService },
        ViewportInfoService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterComponent);
    testComponent = fixture.componentInstance;
    fixture.autoDetectChanges(true);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });

  it('Should navigate to home', function () {
    const navigateSpy = spyOn(router, 'navigate');
    testComponent.home();
    expect(navigateSpy).toHaveBeenCalledWith(
      [''],
    );
  });

  it('Should navigate to path parameter relative to route', function () {
    const navigateSpy = spyOn(router, 'navigate');
    testComponent.changeList('path');
    expect(navigateSpy).toHaveBeenCalledWith(
      ['path'],
      { relativeTo: route },
    );
  });

  it('Should return correct tab after list changed', waitForAsync( () => {
    const path: string = 'stories';
    testComponent.changeList(path).then((res: boolean) => {
      expect(testComponent.tab).toEqual(path);
    });
  }));
})
