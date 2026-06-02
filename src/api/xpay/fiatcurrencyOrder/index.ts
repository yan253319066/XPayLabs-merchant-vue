import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { FiatcurrencyOrderVO, FiatcurrencyOrderForm, FiatcurrencyOrderQuery } from '@/api/xpay/fiatcurrencyOrder/types';

/**
 * 查询法币订单列表
 * @param query
 * @returns {*}
 */

export const listFiatcurrencyOrder = (query?: FiatcurrencyOrderQuery): AxiosPromise<FiatcurrencyOrderVO[]> => {
  return request({
    url: '/xpay/fiatcurrencyOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询法币订单详细
 * @param id
 */
export const getFiatcurrencyOrder = (id: string | number): AxiosPromise<FiatcurrencyOrderVO> => {
  return request({
    url: '/xpay/fiatcurrencyOrder/' + id,
    method: 'get'
  });
};

/**
 * 新增法币订单
 * @param data
 */
export const addFiatcurrencyOrder = (data: FiatcurrencyOrderForm) => {
  return request({
    url: '/xpay/fiatcurrencyOrder',
    method: 'post',
    data: data
  });
};

/**
 * 修改法币订单
 * @param data
 */
export const updateFiatcurrencyOrder = (data: FiatcurrencyOrderForm) => {
  return request({
    url: '/xpay/fiatcurrencyOrder',
    method: 'put',
    data: data
  });
};

/**
 * 删除法币订单
 * @param id
 */
export const delFiatcurrencyOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/fiatcurrencyOrder/' + id,
    method: 'delete'
  });
};
