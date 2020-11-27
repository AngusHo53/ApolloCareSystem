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

export async function getPatientRecordByUuid(patientOptions) {
  if (patientOptions.range) {
    const result = await http.get(`/user/${patientOptions.uuid}/record?limit=${patientOptions.limit}&range=${patientOptions.range}`);
    if (result) {
      if (result.data.status === "Success") {
        return result.data.data;
      } else {
        appModule.sendErrorNotice("取得圖表失敗");
      }
    } else {
      appModule.sendErrorNotice("取得圖表失敗");
    }
  }
  else {
    const result = await http.get(
      `/user/${patientOptions.uuid}/record?limit=${patientOptions.limit}&page=${patientOptions.page}`
    );
    if (result) {
      if (result.data.status === "Success") {
        return result.data.data;
      } else {
        appModule.sendErrorNotice("取得記錄失敗");
      }
    } else {
      appModule.sendErrorNotice("取得記錄失敗");
    }
  }


}

export async function getMeasurementTypes() {
  const result = await http.get(`/measurements/types`);
  if (result) {
    if (result.data.status === "Success") {
      return result.data.data.measurement_type;
    } else {
      appModule.sendErrorNotice("取得資料失敗");
    }
  } else {
    appModule.sendErrorNotice("取得資料失敗");
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
