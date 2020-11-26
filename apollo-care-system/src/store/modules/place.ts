import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import { Place } from "@/types";
import { getPlaceList } from '@/api/placeService';
export interface PlaceState {
  place: Place[];
  loading: boolean;
}

@Module({ store, dynamic: true, name: "placeModule" })
class PlaceModule extends VuexModule implements PlaceState {
  public place: Place[] = [];
  public loading = false;

  @Action async placeList() {
    this.setLoading(true);
    this.setPlaceList(await getPlaceList());
    this.setLoading(false);
  }

  @Action codetoPlace(item) {
    if (item.place !== null) {
      const pCode = item.place.split(",");
      for (let i = 0; i < this.place.length; i++) {
        if (this.place[i].shortcode == pCode[0]) {
          if (this.place[i].index == pCode[1]) {
            return this.place[i].branch_name;
          }
        }
      }
    } else return;
  }

  @Action placetoCode(item) {
    if (item.place != null) {
      for (let i = 0; i < this.place.length; i++) {
        if (item.place == this.place[i].branch_name) {
          return item.place =
             this.place[i].shortcode + "," + this.place[i].index;
        }
      }
    } else return;
  }

  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @Mutation setPlaceList(place: Place[]): void {
    this.place = place;
  }
}

export const placeModule = getModule(PlaceModule);
