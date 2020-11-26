import http from "@/http/axios";
import { appModule } from "@/store/modules/app";

export async function getPlaceList() {
  const result = await http.get(`/place`);
  if (result) {
    if (result.data.status === "Success") {
      return result.data.data.place;
    } else {
      appModule.sendErrorNotice("取得地區列表失敗");
    }
  } else {
    appModule.sendErrorNotice("取得地區列表失敗");
  }
}

