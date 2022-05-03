import {ComponentFixture, TestBed} from "@angular/core/testing";
import {
  CharacterListComponent
} from "./character-list.component";
import {CharacterListService} from "../../services/character-list.service";
import {CommonModule} from "@angular/common";
import {RouterTestingModule} from "@angular/router/testing";
import {
  CharacterComponent
} from "@app-smart-test/marvel-characters/character-list/components/character/character.component";
import {
  CharacterListItemComponent
} from "@app-smart-test/marvel-characters/character-list/components/character-list-item/character-list-item.component";
import {
  CharacterListMockService
} from "@app-smart-test/marvel-characters/character-list/services/testing/character-list-mock.service";
import {ViewportInfoService} from "@app-smart-test/marvel-characters/character-list/services/viewport-info.service";
import {ActivatedRoute, Router} from "@angular/router";


describe('CharacterListComponent', () => {

  let fixture: ComponentFixture<CharacterListComponent>;
  let testComponent: CharacterListComponent;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
      ],
      declarations: [
        CharacterListComponent,
        CharacterComponent,
        CharacterListItemComponent,
      ],
      providers: [
        { provide: CharacterListService, useClass: CharacterListMockService },
        ViewportInfoService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    testComponent = fixture.componentInstance;
    fixture.autoDetectChanges(true);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });

  it('List service should be created', () => {
    const service: CharacterListService = TestBed.get(CharacterListService);
    expect(service).toBeTruthy();
  });

  it('Component dimensions cellWidth is greater than 0', function () {
    const cellWidth: number = +testComponent.dimensions.cellWidth.replace(/\D/g, '');
    expect(
      cellWidth > 0
    ).toBeTruthy();
  });

  it('Component dimensions cellsCount is greater than 0', function () {
    expect(
      testComponent.dimensions.cellsCount > 0
    ).toBeTruthy();
  });

  it('Component dimensions rowsCount is greater than 0', function () {
    expect(
      testComponent.dimensions.rowsCount > 0
    ).toBeTruthy();
  });

  it('Should have #list child', function () {
    expect(
      testComponent.list
    ).toBeTruthy();
  });

  it('Should navigate to character relative to parent route', function () {
    const navigateSpy = spyOn(router, 'navigate');
    testComponent.click(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      ['character', 1],
      { relativeTo: route.parent },
    );
  });
});
