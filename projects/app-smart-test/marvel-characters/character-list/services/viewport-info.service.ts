import {Injectable} from "@angular/core";

@Injectable()
export class ViewportInfoService {
  public get isPortrait(): boolean {
    return document.body.clientWidth / window.innerHeight < 1;
  }
}
