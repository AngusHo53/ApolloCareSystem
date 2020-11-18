import http from "@/http/axios";
import { appModule } from "@/store/modules/app";


export async function getAccountList() {
  const result = await http.get("/accounts");
  if (result) {
    if (result.data.status === "Success") {
      return result.data.data.accounts;
    } else {
      appModule.sendErrorNotice("取得列表失敗");
    }
  } else {
    appModule.sendErrorNotice("取得列表失敗");
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

export async function getPatientsByAccount(accountId, patientOptions) {
  const result = await http.get(`/user/${accountId}/patients?q=${patientOptions.q}&page=${patientOptions.page}&limit=10`);
  if (result) {
    if (result.data.status === "Success") {
      return result.data.data;
    } else {
      appModule.sendErrorNotice("取得列表失敗");
    }
  } else {
    appModule.sendErrorNotice("取得列表失敗");
  }
}

export async function getPatientsNeedToAdd(accountId, patientOptions) {
  const result = await http.get(`/user/${accountId}/patients?mode=not&q=${patientOptions.q}&page=${patientOptions.page}&limit=10&role=Patient`);
  if (result) {
    if (result.data.status === "Success") {
      return result.data.data;
    } else {
      appModule.sendErrorNotice("取得列表失敗");
    }
  } else {
    appModule.sendErrorNotice("取得列表失敗");
  }
}
