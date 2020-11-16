import http from "@/http/axios";
import { appModule } from "@/store/modules/app";

export async function getApiList() {
  const result = await http.get("/apikey");
  if (result) {
    if (result.data.status === "Success") {
      return result.data.data.clients;
    } else {
      appModule.sendErrorNotice("取得Api token列表失敗");
    }
  } else {
    appModule.sendErrorNotice("取得Api token列表失敗");
  }
}

export async function createApi(createItem) {
  const params = {
    name: createItem.name,
    type: createItem.api_type
  };
  const result = await http.post("/apikey", params);
  if (result) {
    if (result.data.status === "Success") {
      appModule.sendSuccessNotice("註冊成功");
    } else {
      appModule.sendErrorNotice("註冊失敗");
    }
  }
  return;
}

export async function modifyApi(modifyItem) {
  const params = {
    name: modifyItem.name,
    type: modifyItem.api_type
  };
  const result = await http.put("/apikey/" + modifyItem.uuid, params);
  console.log(result);
  if (result) {
    if (result.data.status === "Success") {
      appModule.sendSuccessNotice("修改成功");
    } else {
      appModule.sendErrorNotice("修改失敗");
    }
  }
  return;
}

export async function deleteApi(deleteItem) {
  const result = await http.delete("/apikey/" + deleteItem.uuid);
  if (result) {
    if (result.data.status === "Success") {
      appModule.sendSuccessNotice("刪除成功");
    } else {
      appModule.sendErrorNotice("刪除失敗");
    }
  }
}

export async function resetToken(resetItem) {
  const result = await http.post("/apikey/" + resetItem.uuid);
  if (result) {
    if (result.data.status === "Success") {
      appModule.sendSuccessNotice("重置成功");
    } else {
      appModule.sendErrorNotice("重置失敗");
    }
  }
}
