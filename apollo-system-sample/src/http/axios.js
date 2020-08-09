import axios from 'axios';
import Vue from 'vue';
import { getToken } from "@/utils/app-util";

// 發送前的動作
axios.interceptors.request.use((config) => {
  const httpToken = localStorage.getItem('token');
  const resConfig = config;
  if (httpToken) {
    resConfig.headers.token = httpToken;
  }
  return config;
}, (error) => {
  const value = error;
  return Promise.reject(value);
});
// 接收響應前的動作
axios.interceptors.response.use((response) => {
  const res = response;
  return res;
}, (error) => {
  const value = error.response;
  return Promise.resolve(value);
});

const http_headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  "Access-Control-Allow-Origin": "*",
  'Authorization': getToken() === '' ? 'Bearer Guest' : `Bearer ${getToken()}`,
  'x-api-key': '29d5faa6ed97381a97185f633e19fb47156eb1d0199b9d14e3135cfc0b4a86ffc9cc9d04de6e4dbf12a7790a8bd0d9348efc107f72f78e0f5c4b06a2459a4941075779286952b7251a97382cf3604d3a77e9c4644424ff994b99f6f8ff94066543339e65084c4f16f693a3ed1567c397f2c821ea12e1b6ffb97ab37ccf0b8331'
};

export default {
  post(url, value) {
    const params = {
      method: 'POST',
      baseURL: Vue.prototype.baseURL,
      url,
      data: value,
      timeout: 30000,
      headers: http_headers
    };
    return axios(params).then((response) => {
      // console.log(url)
      const res = response;
      return res;
    })
  },
  put(url, value) {
    const params = {
      method: 'PUT',
      baseURL: Vue.prototype.baseURL,
      url,
      data: value,
      timeout: 10000,
      headers: http_headers
    };
    return axios(params).then((response) => {
      // console.log(url)
      const res = response;
      return res;
    }).then((response) => {
      const res = response;
      return res;
    });
  },
  get(url) {
    const params = {
      method: 'GET',
      baseURL: Vue.prototype.baseURL,
      url,
      timeout: 10000,
      headers: http_headers
    };
    return axios(params).then((response) => {
      // console.log(url)
      const res = response;
      return res;
    }).then((response) => {
      const res = response;
      return res;
    });
  },
  delete(url) {
    const params = {
      method: 'DELETE',
      baseURL: Vue.prototype.baseURL,
      url,
      timeout: 10000,
      headers: http_headers
    };
    return axios(params).then((response) => {
      // console.log(url)
      const res = response;
      return res;
    }).then((response) => {
      const res = response;
      return res;
    });
  },
};