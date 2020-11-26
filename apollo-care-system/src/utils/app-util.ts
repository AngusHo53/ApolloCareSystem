import { User, SearchFilter } from "@/types";

const SESSION_TOKEN_KEY = "apollo-token";
const SESSION_USER_KEY = "apollo-user";

export function setToken(token: string): void {
  if (sessionStorage) {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }
}

export function setUser(userData: string): void {
  if (sessionStorage) {
    sessionStorage.setItem(SESSION_USER_KEY, userData);
  }
}

export function getToken(): string {
  let token = "";
  if (sessionStorage) {
    const _token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    token = _token ? _token : token;
  }
  return token;
}

export function getUser(): User {
  let user = {} as User;
  if (sessionStorage) {
    const userData = sessionStorage.getItem(SESSION_USER_KEY);
    user = userData ? (JSON.parse(userData) as User) : ({} as User);
  }
  return user;
}

export function cleanSession() {
  if (sessionStorage) {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
  }
}

export function isValidEmail(email: string) {
  /* eslint-disable no-useless-escape */
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email && !re.test(email)) return "Email is invalid.";
  return true;
}

export function formatValue(value) {
  if (value === "true" || value === true) {
    return "有";
  } else if (value === "false" || value === false) {
    return "無";
  }
  return value;
}

export function formatMeasureAt(timestamp: number) {
  const now = new Date();
  const preTime = new Date(timestamp * 1000).getTime();
  const preLocaleTime = new Date(timestamp * 1000);
  const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const todayTime = new Date(today).getTime();
  const oneDayTime = 1000 * 24 * 60 * 60;

  const yesterdayTime = new Date(todayTime - oneDayTime).getTime();

  const newTime = preLocaleTime.toLocaleString().substring(0, preLocaleTime.toLocaleString().length - 3);
  if (preTime >= todayTime) {
    return '今天 ' + newTime;
  }
  else if (preTime < todayTime && yesterdayTime <= preTime) {
    return '昨天 ' + newTime;
  }
  else {
    return newTime;
  }

}
