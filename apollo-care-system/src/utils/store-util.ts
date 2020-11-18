import { Entity, PatientOptions } from "@/types";
export const DEFAULT_ROW_PER_PAGE = 10;
export const GENDER = {
  1: '男',
  0: '女'
}

export const MEASUREITEM = [
  {
    id: 10, name_en: "blood_pressure", name: "血壓", children: [
      {
        id: 11, name_en: "systolic", name: "收縮壓",
      },
      {
        id: 12, name_en: "diastolic", name: "舒張壓",
      },
      {
        id: 13, name_en: "pulse", name: "脈膊",
      },
      // {
      //   id: 14, name_en: "scene", name: "情境",
      // },
      // {
      //   id: 15, name_en: "arr", name: "心律不整",
      // },
      // {
      //   id: 16, name_en: "afib", name: "心房顫動",
      // },
      // {
      //   id: 17, name_en: "pc", name: "早期收縮",
      // },
      // {
      //   id: 18, name_en: "ihb", name: "心跳不規則",
      // }
    ]
  },
  {
    id: 20, name_en: "blood_glucose", name: "血糖", children: [
      {
        id: 21, name_en: "blood_glucose", name: "血糖",
      }
    ]
  },
  {
    id: 30, name_en: "metabolic", name: "新陳代謝", children: [
      {
        id: 31, name_en: "height", name: "身高",
      },
      {
        id: 32, name_en: "weight", name: "體重",
      },
      {
        id: 33, name_en: "bmi", name: "BMI",
      },
      {
        id: 34, name_en: "muscle_mass", name: "肌肉量",
      },
      {
        id: 35, name_en: "body_fat", name: "脂肪率",
      },
      {
        id: 36, name_en: "body_water", name: "水分含量",
      },
      {
        id: 37, name_en: "visceral_fat", name: "內臟脂肪率",
      },
      {
        id: 38, name_en: "bmr", name: "基礎代謝率",
      },
    ]
  },
  {
    id: 40, name_en: "body_temperature", name: "體溫", children: [
      {
        id: 41, name_en: "body_temperature", name: "體溫",
      }
    ]
  },
  {
    id: 50, name_en: "spo2", name: "血氧", children: [
      {
        id: 51, name_en: "spo2_highest", name: "量測期間血氧最高值",
      },
      {
        id: 52, name_en: "spo2_lowest", name: "量測期間血氧最低值",
      },
      {
        id: 53, name_en: "pulse_highest", name: "量測期間最高脈膊",
      },
      {
        id: 5, name_en: "pulse_lowest", name: "量測期間最低脈膊",
      },
    ]
  },
  {
    id: 60, name_en: "frailty", name: "體質", children: [
      {
        id: 61, name_en: "handness", name: "慣用手",
      },
      {
        id: 62, name_en: "left_grip", name: "左手握力",
      },
      {
        id: 63, name_en: "right_grip", name: "右手握力",
      },
      {
        id: 64, name_en: "walktime", name: "走路時間",
      },
      {
        id: 65, name_en: "walkspeed", name: "走路速度",
      },
      {
        id: 66, name_en: "ftsst", name: "五次坐站時間",
      }
    ]
  },
  {
    id: 70, name_en: "blood", name: "血液", children: [
      {
        id: 71, name_en: "hb", name: "血紅素",
      },
      {
        id: 72, name_en: "alb", name: "白蛋白",
      },
      {
        id: 73, name_en: "cre", name: "腎功能",
      },
      {
        id: 74, name_en: "ast", name: "肝功能",
      },
      {
        id: 75, name_en: "tcho", name: "總膽固醇",
      },
      {
        id: 76, name_en: "hdl", name: "血高密度脂蛋白液",
      },
      {
        id: 77, name_en: "ldl", name: "低密度脂蛋白",
      },
      {
        id: 78, name_en: "ua", name: "尿酸",
      },
      {
        id: 79, name_en: "hba1c", name: "糖化血色素",
      },
      {
        id: 710, name_en: "fe", name: "鐵質",
      },
      {
        id: 711, name_en: "mg", name: "血鎂",
      }
    ]
  },
  {
    id: 80, name_en: "mental", name: "心理", children: [
      {
        id: 81, name_en: "spmsq", name: "SPMSQ",
      },
      {
        id: 82, name_en: "ad8", name: "AD-8",
      },
      {
        id: 83, name_en: "minicog", name: "Mini-Cog",
      },
      {
        id: 84, name_en: "bsrs", name: "BSRS",
      }
    ]
  },
  {
    id: 90, name_en: "bone", name: "骨質", children: [
      {
        id: 91, name_en: "osteoporosis", name: "Osteoporosis",
      },
      {
        id: 92, name_en: "fracture", name: "Fracture",
      }
    ]
  },
];

export const enum MEASUREMENT_STATUS {
  GOOD = 0,
  WARNING = 1,
  BAD = 2,
  UNKNOW = 3
}

export const MEASUREMENT_COLORS = {
  0: "#4FB99F",
  1: "#F0C419",
  2: "#C44F4B",
  3: "#000000"
}

export function getDefaultPagination(): Pagination {
  return {
    page: 1,
    totalItems: 0,
    rowsPerPage: DEFAULT_ROW_PER_PAGE,
    pages: 0
  };
}

export function getDefaultPatientOptions(): PatientOptions {
  return {
    page: 1,
    q: "",
    order: "asc",
    sort: ""
  };
}

export function getPagination(items: Entity[], pages: number, page: number, rowsPerPage: number = DEFAULT_ROW_PER_PAGE) {
  const totalItems = items ? items.length : 0;
  // const pages = Math.ceil(totalItems / DEFAULT_ROW_PER_PAGE);
  return { totalItems, pages, page, rowsPerPage };
}
