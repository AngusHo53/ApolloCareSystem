import { Entity } from "@/types";
export const DEFAULT_ROW_PER_PAGE = 10;
export const GENDER = {
  1: '男',
  0: '女'
}

export const MEASUREITEM = [
  {
    id: 10, name_zn: "blood_pressure", name: "血壓", children: [
      {
        id: 111, name_zn: "blood_pressure", name: "測試",
      },
      {
        id: 11, name_zn: "systolic", name: "收縮壓",
      },
      {
        id: 12, name_zn: "diastolic", name: "舒張壓",
      },
      {
        id: 13, name_zn: "pulse", name: "脈膊",
      },
      {
        id: 14, name_zn: "scene", name: "情境",
      },
      {
        id: 15, name_zn: "arr", name: "心律不整",
      },
      {
        id: 16, name_zn: "afib", name: "心房顫動",
      },
      {
        id: 17, name_zn: "pc", name: "早期收縮",
      },
      {
        id: 18, name_zn: "ihb", name: "心跳不規則",
      }]
  },
  {
    id: 20, name_zn: "blood_glucose", name: "血糖", children: [
      {
        id: 21, name_zn: "blood_glucose", name: "血糖",
      },
      {
        id: 22, name_zn: "meal", name: "Meal",
      }
    ]
  },
  {
    id: 30, name_zn: "metabolic", name: "新陳代謝", children: [
      {
        id: 31, name_zn: "height", name: "身高",
      },
      {
        id: 32, name_zn: "weight", name: "體重",
      },
      {
        id: 33, name_zn: "bmi", name: "BMI",
      },
      {
        id: 34, name_zn: "nuscle_mass", name: "肌肉量",
      },
      {
        id: 35, name_zn: "body_fat", name: "脂肪率",
      },
      {
        id: 36, name_zn: "body_water", name: "水分含量",
      },
      {
        id: 37, name_zn: "visceral_fat", name: "內臟脂肪率",
      },
      {
        id: 38, name_zn: "bmr", name: "基礎代謝率",
      },
    ]
  },
  {
    id: 40, name_zn: "body_temperature", name: "體溫", children: [
      {
        id: 41, name_zn: "body_temperature", name: "體溫",
      }
    ]
  },
  {
    id: 50, name_zn: "spo2", name: "血氧", children: [
      {
        id: 51, name_zn: "spo2_highest", name: "量測期間血氧最高值",
      },
      {
        id: 52, name_zn: "spo2_lowest", name: "量測期間血氧最低值",
      },
      {
        id: 53, name_zn: "pulse_highest", name: "量測期間最高脈膊",
      },
      {
        id: 5, name_zn: "pulse_lowest", name: "量測期間最低脈膊",
      },
    ]
  },
  {
    id: 60, name_zn: "frailty", name: "體質", children: [
      {
        id: 61, name_zn: "handness", name: "慣用手",
      },
      {
        id: 62, name_zn: "grip", name: "握力",
      },
      {
        id: 63, name_zn: "walktime", name: "走路時間",
      },
      {
        id: 64, name_zn: "walkspeed", name: "走路速度",
      },
      {
        id: 65, name_zn: "ftsst", name: "五次坐站時間",
      }
    ]
  },
  {
    id: 70, name_zn: "blood", name: "血液", children: [
      {
        id: 71, name_zn: "hb", name: "血紅素",
      },
      {
        id: 72, name_zn: "alb", name: "白蛋白",
      },
      {
        id: 73, name_zn: "cre", name: "腎功能",
      },
      {
        id: 74, name_zn: "ast", name: "肝功能",
      },
      {
        id: 75, name_zn: "tcho", name: "總膽固醇",
      },
      {
        id: 76, name_zn: "hdl", name: "血高密度脂蛋白液",
      },
      {
        id: 77, name_zn: "ldl", name: "低密度脂蛋白",
      },
      {
        id: 78, name_zn: "ua", name: "尿酸",
      },
      {
        id: 79, name_zn: "hba1c", name: "糖化血色素",
      },
      {
        id: 710, name_zn: "fe", name: "鐵質",
      },
      {
        id: 711, name_zn: "mg", name: "血鎂",
      }
    ]
  },
  {
    id: 80, name_zn: "mental", name: "心理", children: [
      {
        id: 81, name_zn: "spmsq", name: "SPMSQ",
      },
      {
        id: 82, name_zn: "ad8", name: "AD-8",
      },
      {
        id: 83, name_zn: "minicog", name: "Mini-Cog",
      },
      {
        id: 84, name_zn: "bsrs", name: "BSRS",
      }
    ]
  },
  {
    id: 90, name_zn: "bone", name: "骨質", children: [
      {
        id: 91, name_zn: "osteoporosis", name: "Osteoporosis",
      },
      {
        id: 92, name_zn: "fracture", name: "Fracture",
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
