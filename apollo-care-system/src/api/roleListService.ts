import http from "@/http/axios";
import { appModule } from "@/store/modules/app";


export async function getRoleList() {
  const result = await http.get("/accounts");
  if (result) {
    if (result.data.status === "Success") {
      return result.data.data.accounts;
    } else {
      appModule.sendErrorNotice("取得權限列表失敗");
    }
  } else {
    appModule.sendErrorNotice("取得權限列表失敗");
  }
}

export async function replaceRole(replaceItem) {
  const params = {
    roles: replaceItem.roles
  };
  const result = await http.post(
    "/user/" + replaceItem.uuid + "/roles",
    params
  );
  if (result) {
    if (result.data.status === "Success") {
      appModule.sendSuccessNotice("修改成功");
    } else {
      appModule.sendErrorNotice("修改失敗");
    }
  }
}
