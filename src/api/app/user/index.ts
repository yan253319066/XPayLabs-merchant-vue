import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserVO, UserForm, UserQuery } from '@/api/app/user/types';

/**
 * 查询用户信息列表
 * @param query
 * @returns {*}
 */

export const listUser = (query?: UserQuery): AxiosPromise<UserVO[]> => {
  return request({
    url: '/app/user/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户信息详细
 * @param userId
 */
export const getUser = (userId: string | number): AxiosPromise<UserVO> => {
  return request({
    url: '/app/user/' + userId,
    method: 'get'
  });
};

/**
 * 新增用户信息
 * @param data
 */
export const addUser = (data: UserForm) => {
  return request({
    url: '/app/user',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户信息
 * @param data
 */
export const updateUser = (data: UserForm) => {
  return request({
    url: '/app/user',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户信息
 * @param userId
 */
export const delUser = (userId: string | number | Array<string | number>) => {
  return request({
    url: '/app/user/' + userId,
    method: 'delete'
  });
};
