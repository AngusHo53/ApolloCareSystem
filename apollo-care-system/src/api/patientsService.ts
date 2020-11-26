import http from "@/http/axios";
import { appModule } from "@/store/modules/app";

export async function getPatientsList(patientOptions) {
  const result = await http.get(`/user/?q=${patientOptions.q}&page=${patientOptions.page}&limit=10`);
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


export async function setPatientsInfo(patientsId, params) {
  const result = await http.put("/user/" + patientsId, params);
  if (result) {
    if (result.data.status === "Success") {
      appModule.sendSuccessNotice("修改成功");
    } else {
      appModule.sendErrorNotice("修改失敗");
    }
  } else {
    appModule.sendErrorNotice("修改失敗");
  }
}
