import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MerchantCostDetailVO, MerchantCostDetailForm, MerchantCostDetailQuery } from '@/api/xpay/merchantCostDetail/types';

/**
 * 查询商家费用明细列表
 * @param query
 * @returns {*}
 */

export const listMerchantCostDetail = (query?: MerchantCostDetailQuery): AxiosPromise<MerchantCostDetailVO[]> => {
  return request({
    url: '/xpay/merchantCostDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商家费用明细详细
 * @param id
 */
export const getMerchantCostDetail = (id: string | number): AxiosPromise<MerchantCostDetailVO> => {
  return request({
    url: '/xpay/merchantCostDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增商家费用明细
 * @param data
 */
export const addMerchantCostDetail = (data: MerchantCostDetailForm) => {
  return request({
    url: '/xpay/merchantCostDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改商家费用明细
 * @param data
 */
export const updateMerchantCostDetail = (data: MerchantCostDetailForm) => {
  return request({
    url: '/xpay/merchantCostDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除商家费用明细
 * @param id
 */
export const delMerchantCostDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/merchantCostDetail/' + id,
    method: 'delete'
  });
};
