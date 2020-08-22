import { Entity } from "@/types";
export const DEFAULT_ROW_PER_PAGE = 10;
export const GENDER = {
  1: '男',
  0: '女'
}

export const MEASUREITEM = [
  {
    id: 1, name_zn: "blood", name: "血液", children: [
      {
        id: 1 - 1, name_zn: "hb", name: "血紅素",
      },
      {
        id: 1 - 2, name_zn: "alb", name: "白蛋白",
      },
      {
        id: 1 - 3, name_zn: "cre", name: "腎功能",
      },
      {
        id: 1 - 4, name_zn: "ast", name: "肝功能",
      },
      {
        id: 1 - 5, name_zn: "tcho", name: "總膽固醇",
      },
      {
        id: 1 - 6, name_zn: "hdl", name: "血高密度脂蛋白液",
      }, {
        id: 1 - 7, name_zn: "ldl", name: "低密度脂蛋白",
      },
      {
        id: 1 - 8, name_zn: "ua", name: "尿酸",
      },
      {
        id: 1 - 9, name_zn: "hba1c", name: "糖化血色素",
      },
      {
        id: 1 - 10, name_zn: "fe", name: "鐵質",
      },
      {
        id: 1 - 11, name_zn: "mg", name: "血鎂",
      }
    ]
  },
  { id: 2, name_zn: "blood_pressure", name: "血壓" },
  { id: 3, name_zn: "blood_glucose", name: "血糖" },
  { id: 4, name_zn: "body_temperature", name: "體溫" },
  { id: 4, name_zn: "bone", name: "骨質" },
  { id: 5, name_zn: "frailty", name: "體質" },
  { id: 6, name_zn: "mental", name: "心理" },
  { id: 7, name_zn: "metabolic", name: "新陳代謝" },
  { id: 8, name_zn: "spo2", name: "血氧" }
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
