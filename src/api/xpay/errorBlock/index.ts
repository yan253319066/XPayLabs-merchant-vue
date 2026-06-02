import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ErrorBlockVO, ErrorBlockForm, ErrorBlockQuery } from '@/api/xpay/errorBlock/types';

/**
 * 查询错误的区块列表
 * @param query
 * @returns {*}
 */

export const listErrorBlock = (query?: ErrorBlockQuery): AxiosPromise<ErrorBlockVO[]> => {
  return request({
    url: '/xpay/errorBlock/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询错误的区块详细
 * @param id
 */
export const getErrorBlock = (id: string | number): AxiosPromise<ErrorBlockVO> => {
  return request({
    url: '/xpay/errorBlock/' + id,
    method: 'get'
  });
};

/**
 * 新增错误的区块
 * @param data
 */
export const addErrorBlock = (data: ErrorBlockForm) => {
  return request({
    url: '/xpay/errorBlock',
    method: 'post',
    data: data
  });
};

/**
 * 修改错误的区块
 * @param data
 */
export const updateErrorBlock = (data: ErrorBlockForm) => {
  return request({
    url: '/xpay/errorBlock',
    method: 'put',
    data: data
  });
};

/**
 * 删除错误的区块
 * @param id
 */
export const delErrorBlock = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/errorBlock/' + id,
    method: 'delete'
  });
};
