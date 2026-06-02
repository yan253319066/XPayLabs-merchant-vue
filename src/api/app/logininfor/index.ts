import request from '@/utils/request';
import { LoginInfoQuery, LoginInfoVO } from './types';
import { AxiosPromise } from 'axios';

// 查询登录日志列表
export function list(query: LoginInfoQuery): AxiosPromise<LoginInfoVO[]> {
  return request({
    url: '/app/logininfor/list',
    method: 'get',
    params: query
  });
}

// 删除登录日志
export function delLoginInfo(infoId: string | number | Array<string | number>) {
  return request({
    url: '/app/logininfor/' + infoId,
    method: 'delete'
  });
}

// 解锁用户登录状态
export function unlockLoginInfo(userName: string | Array<string>) {
  return request({
    url: '/app/logininfor/unlock/' + userName,
    method: 'get'
  });
}

// 清空登录日志
export function cleanLoginInfo() {
  return request({
    url: '/app/logininfor/clean',
    method: 'delete'
  });
}
