import http from "@/http/axios";
import { appModule } from "@/store/modules/app";

export async function getNotificationList() {
  const params = {};
  const result = await http.post("/notification",params);
  if (result) {
    if (result.data.status === "Success") {
      return result.data.data.notifications;
    } else {
      appModule.sendErrorNotice("取得通知列表失敗");
    }
  } else {
    appModule.sendErrorNotice("取得通知列表失敗");
  }
}
