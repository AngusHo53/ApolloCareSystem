import { Entity } from "@/types";
export const DEFAULT_ROW_PER_PAGE = 10;
export const GENDER = {
  1: '男',
  0: '女'
}

export const MEASUREITEM = [
  {
    id: 1, name_zn: "blood_pressure", name: "血壓", children: [
      {
        id: 1 - 1, name_zn: "systolic", name: "收縮壓",
      },
      {
        id: 1 - 2, name_zn: "diastolic", name: "舒張壓",
      },
      {
        id: 1 - 3, name_zn: "pulse", name: "脈膊",
      },
      {
        id: 1 - 4, name_zn: "scene", name: "情境",
      },
      {
        id: 1 - 5, name_zn: "arr", name: "心律不整",
      },
      {
        id: 1 - 6, name_zn: "afib", name: "心房顫動",
      },
      {
        id: 1 - 7, name_zn: "pc", name: "早期收縮",
      },
      {
        id: 1 - 8, name_zn: "ihb", name: "心跳不規則",
      }]
  },
  {
    id: 2, name_zn: "blood_glucose", name: "血糖", children: [
      {
        id: 2 - 1, name_zn: "blood_glucose", name: "血糖",
      },
      {
        id: 2 - 2, name_zn: "meal", name: "Meal",
      }
    ]
  },
  {
    id: 3, name_zn: "metabolic", name: "新陳代謝", children: [
      {
        id: 3 - 1, name_zn: "height", name: "身高",
      },
      {
        id: 3 - 2, name_zn: "weight", name: "體重",
      },
      {
        id: 3 - 3, name_zn: "bmi", name: "BMI",
      },
      {
        id: 3 - 4, name_zn: "nuscle_mass", name: "肌肉量",
      },
      {
        id: 3 - 5, name_zn: "body_fat", name: "脂肪率",
      },
      {
        id: 3 - 6, name_zn: "body_water", name: "水分含量",
      },
      {
        id: 3 - 7, name_zn: "visceral_fat", name: "內臟脂肪率",
      },
      {
        id: 3 - 8, name_zn: "bmr", name: "基礎代謝率",
      },
    ]
  },
  {
    id: 4, name_zn: "body_temperature", name: "體溫", children: [
      {
        id: 4 - 1, name_zn: "body_temperature", name: "體溫",
      }
    ]
  },
  {
    id: 5, name_zn: "spo2", name: "血氧", children: [
      {
        id: 5 - 1, name_zn: "spo2_highest", name: "量測期間血氧最高值",
      },
      {
        id: 5 - 2, name_zn: "spo2_lowest", name: "量測期間血氧最低值",
      },
      {
        id: 5 - 3, name_zn: "pulse_highest", name: "量測期間最高脈膊",
      },
      {
        id: 5 - 4, name_zn: "pulse_lowest", name: "量測期間最低脈膊",
      },
    ]
  },
  {
    id: 6, name_zn: "frailty", name: "體質", children: [
      {
        id: 6 - 1, name_zn: "handness", name: "慣用手",
      },
      {
        id: 6 - 2, name_zn: "grip", name: "握力",
      },
      {
        id: 6 - 3, name_zn: "walktime", name: "走路時間",
      },
      {
        id: 6 - 4, name_zn: "walkspeed", name: "走路速度",
      },
      {
        id: 6 - 5, name_zn: "ftsst", name: "五次坐站時間",
      }
    ]
  },
  {
    id: 7, name_zn: "blood", name: "血液", children: [
      {
        id: 7 - 1, name_zn: "hb", name: "血紅素",
      },
      {
        id: 7 - 2, name_zn: "alb", name: "白蛋白",
      },
      {
        id: 7 - 3, name_zn: "cre", name: "腎功能",
      },
      {
        id: 7 - 4, name_zn: "ast", name: "肝功能",
      },
      {
        id: 7 - 5, name_zn: "tcho", name: "總膽固醇",
      },
      {
        id: 7 - 6, name_zn: "hdl", name: "血高密度脂蛋白液",
      }, {
        id: 7 - 7, name_zn: "ldl", name: "低密度脂蛋白",
      },
      {
        id: 7 - 8, name_zn: "ua", name: "尿酸",
      },
      {
        id: 7 - 9, name_zn: "hba1c", name: "糖化血色素",
      },
      {
        id: 7 - 10, name_zn: "fe", name: "鐵質",
      },
      {
        id: 7 - 11, name_zn: "mg", name: "血鎂",
      }
    ]
  },
  {
    id: 8, name_zn: "mental", name: "心理", children: [
      {
        id: 8 - 1, name_zn: "spmsq", name: "SPMSQ",
      },
      {
        id: 8 - 2, name_zn: "ad8", name: "AD-8",
      },
      {
        id: 8 - 3, name_zn: "minicog", name: "Mini-Cog",
      },
      {
        id: 8 - 4, name_zn: "bsrs", name: "BSRS",
      }
    ]
  },
  {
    id: 9, name_zn: "bone", name: "骨質", children: [
      {
        id: 9 - 1, name_zn: "osteoporosis", name: "Osteoporosis",
      },
      {
        id: 9 - 2, name_zn: "fracture", name: "Fracture",
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
