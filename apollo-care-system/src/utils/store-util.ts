import { Entity } from "@/types";
export const DEFAULT_ROW_PER_PAGE = 10;
export const GENDER = {
  1: '男',
  0: '女'
}

export const MEASUREITEM = [
  {
    id: 10, name: "blood_pressure", name_ch: "血壓", children: [
      {
        id: 111, name: "blood_pressure", name_ch: "測試",
      },
      {
        id: 11, name: "systolic", name_ch: "收縮壓",
      },
      {
        id: 12, name: "diastolic", name_ch: "舒張壓",
      },
      {
        id: 13, name: "pulse", name_ch: "脈膊",
      },
      {
        id: 14, name: "scene", name_ch: "情境",
      },
      {
        id: 15, name: "arr", name_ch: "心律不整",
      },
      {
        id: 16, name: "afib", name_ch: "心房顫動",
      },
      {
        id: 17, name: "pc", name_ch: "早期收縮",
      },
      {
        id: 18, name: "ihb", name_ch: "心跳不規則",
      }]
  },
  {
    id: 20, name: "blood_glucose", name_ch: "血糖", children: [
      {
        id: 21, name: "blood_glucose", name_ch: "血糖",
      },
      {
        id: 22, name: "meal", name_ch: "Meal",
      }
    ]
  },
  {
    id: 30, name: "metabolic", name_ch: "新陳代謝", children: [
      {
        id: 31, name: "height", name_ch: "身高",
      },
      {
        id: 32, name: "weight", name_ch: "體重",
      },
      {
        id: 33, name: "bmi", name_ch: "BMI",
      },
      {
        id: 34, name: "muscle_mass", name_ch: "肌肉量",
      },
      {
        id: 35, name: "body_fat", name_ch: "脂肪率",
      },
      {
        id: 36, name: "body_water", name_ch: "水分含量",
      },
      {
        id: 37, name: "visceral_fat", name_ch: "內臟脂肪率",
      },
      {
        id: 38, name: "bmr", name_ch: "基礎代謝率",
      },
    ]
  },
  {
    id: 40, name: "body_temperature", name_ch: "體溫", children: [
      {
        id: 41, name: "body_temperature", name_ch: "體溫",
      }
    ]
  },
  {
    id: 50, name: "spo2", name_ch: "血氧", children: [
      {
        id: 51, name: "spo2_highest", name_ch: "量測期間血氧最高值",
      },
      {
        id: 52, name: "spo2_lowest", name_ch: "量測期間血氧最低值",
      },
      {
        id: 53, name: "pulse_highest", name_ch: "量測期間最高脈膊",
      },
      {
        id: 5, name: "pulse_lowest", name_ch: "量測期間最低脈膊",
      },
    ]
  },
  {
    id: 60, name: "frailty", name_ch: "體質", children: [
      {
        id: 61, name: "handness", name_ch: "慣用手",
      },
      {
        id: 62, name: "left_grip", name_ch: "左手握力",
      },
      {
        id: 63, name: "right_grip", name_ch: "右手握力",
      },
      {
        id: 64, name: "walktime", name_ch: "走路時間",
      },
      {
        id: 65, name: "walkspeed", name_ch: "走路速度",
      },
      {
        id: 66, name: "ftsst", name_ch: "五次坐站時間",
      }
    ]
  },
  {
    id: 70, name: "blood", name_ch: "血液", children: [
      {
        id: 71, name: "hb", name_ch: "血紅素",
      },
      {
        id: 72, name: "alb", name_ch: "白蛋白",
      },
      {
        id: 73, name: "cre", name_ch: "腎功能",
      },
      {
        id: 74, name: "ast", name_ch: "肝功能",
      },
      {
        id: 75, name: "tcho", name_ch: "總膽固醇",
      },
      {
        id: 76, name: "hdl", name_ch: "血高密度脂蛋白液",
      },
      {
        id: 77, name: "ldl", name_ch: "低密度脂蛋白",
      },
      {
        id: 78, name: "ua", name_ch: "尿酸",
      },
      {
        id: 79, name: "hba1c", name_ch: "糖化血色素",
      },
      {
        id: 710, name: "fe", name_ch: "鐵質",
      },
      {
        id: 711, name: "mg", name_ch: "血鎂",
      }
    ]
  },
  {
    id: 80, name: "mental", name_ch: "心理", children: [
      {
        id: 81, name: "spmsq", name_ch: "SPMSQ",
      },
      {
        id: 82, name: "ad8", name_ch: "AD-8",
      },
      {
        id: 83, name: "minicog", name_ch: "Mini-Cog",
      },
      {
        id: 84, name: "bsrs", name_ch: "BSRS",
      }
    ]
  },
  {
    id: 90, name: "bone", name_ch: "骨質", children: [
      {
        id: 91, name: "osteoporosis", name_ch: "Osteoporosis",
      },
      {
        id: 92, name: "fracture", name_ch: "Fracture",
      }
    ]
  },
];

export function getDefaultPagination(): Pagination {
  return {
    page: 1,
    totalItems: 0,
    rowsPerPage: DEFAULT_ROW_PER_PAGE,
    pages: 0
  };
}

export function getPagination(items: Entity[], pages: number, page: number, rowsPerPage: number = DEFAULT_ROW_PER_PAGE) {
  const totalItems = items ? items.length : 0;
  // const pages = Math.ceil(totalItems / DEFAULT_ROW_PER_PAGE);
  return { totalItems, pages, page, rowsPerPage };
}
