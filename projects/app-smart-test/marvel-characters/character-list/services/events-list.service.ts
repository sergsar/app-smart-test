import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ListDimensions} from "../classes/list-dimensions";
import {filter, map, Observable, switchMap} from "rxjs";
import {Event} from "../interfaces/event.interface";
import {EventsState} from "@app-smart-test/contexts";
import {events} from "@app-smart-test/contexts";
import {MarvelEvent} from "@app-smart-test/entities";
import {loadCharacterEvents} from "@app-smart-test/contexts";
import {buildTree} from "../utils/tree.utils";

@Injectable()
export class EventsListService {
  constructor(
    private readonly store: Store<any>,
  ) {
  }

  public getCharacterEventsNext(
    characterId: number,
    dimensions: ListDimensions,
    next$: Observable<void>,
  ): Observable<Event[][]> {
    let acc: MarvelEvent[] = [];
    return next$.pipe(
      switchMap(() => {
        this.store.dispatch(loadCharacterEvents({
          offset: acc.length,
          limit: dimensions.cellsCount * 3,
          id: characterId,
        }));
        return this.getStoreEvents(characterId).pipe(
          map((results: MarvelEvent[]) => {
            acc = results;
            return buildTree(
              this.convertToEvent(results),
              dimensions,
            );
          }),
        )
      }),
    );
  }

  private getStoreEvents(id: number): Observable<MarvelEvent[]> {
    return this.getStoreEventsState().pipe(
      map((state: EventsState) => state.summary![id] as MarvelEvent[]),
      filter((result: MarvelEvent[]) => !!result),
    );
  }

  private getStoreEventsState(): Observable<EventsState> {
    return this.store.select(events).pipe(
      filter((state: EventsState) => state.state !== 'pending'),
      map((state: EventsState) => {
        if (state.state === 'error') {
          throw state.error;
        }
        return state;
      }),
    );
  }

  private convertToEvent(items: MarvelEvent[]): Event[] {
    return items.map((item: MarvelEvent) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail,
    }));
  }
}
