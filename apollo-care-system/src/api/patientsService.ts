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

export async function getPatientByUuid(uuid) {
  const result = await http.get(`/user/${uuid}?with=record&record=mode%3Afull%7Cfield%3Aall`);
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

export async function createPatient(info) {
  const result = await http.post(`/user`, info);
  if (result) {
    if (result.data.status === "Success") {
      appModule.sendSuccessNotice("新增成功");
    } else {
      appModule.sendErrorNotice("新增失敗");
    }
  } else {
    appModule.sendErrorNotice("新增失敗");
  }
}

export async function getVerifyPatients(patientOptions) {
  const result = await http.get(
    `/user?verify=-1&page=${patientOptions.page}&limit=10`
  );
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

export async function verifyPatientsByUuid(uuid, params) {
  const result = await http.post(`/user/${uuid}/verify`, params);
  if (result) {
    if (result.data.status === "Success") {
      return result.data.data;
    } else {
      appModule.sendErrorNotice("審核個案失敗");
    }
  } else {
    appModule.sendErrorNotice("審核個案失敗");
  }
}
