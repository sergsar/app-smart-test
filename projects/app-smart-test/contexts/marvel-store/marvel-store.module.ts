import {NgModule} from "@angular/core";
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {MarvelStore} from "./interfaces/marvel-store.interface";
import {MARVEL_STORE_KEY} from "./const/marvel-store-key";
import {MARVEL_STORE} from "./const/marvel-store";
import {CharactersEffects} from "./effects/characters.effects";

@NgModule({
  imports: [
    EffectsModule.forFeature([CharactersEffects]),
    StoreModule.forFeature<MarvelStore>(MARVEL_STORE_KEY, MARVEL_STORE),
  ],
})
export class MarvelStoreModule {

}
