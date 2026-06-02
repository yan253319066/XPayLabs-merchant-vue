import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MerchantAssetsVO, MerchantAssetsForm, MerchantAssetsQuery } from '@/api/xpay/merchantAssets/types';

/**
 * 当前登录用户资产
 * @returns {*}
 */
export const merchantAssets = (): AxiosPromise<MerchantAssetsVO[]> => {
  return request({
    url: '/xpay/merchantAssets/merchantAssets',
    method: 'get'
  });
};

/**
 * 查询商家资产列表
 * @param query
 * @returns {*}
 */

export const listMerchantAssets = (query?: MerchantAssetsQuery): AxiosPromise<MerchantAssetsVO[]> => {
  return request({
    url: '/xpay/merchantAssets/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商家资产详细
 * @param id
 */
export const getMerchantAssets = (id: string | number): AxiosPromise<MerchantAssetsVO> => {
  return request({
    url: '/xpay/merchantAssets/' + id,
    method: 'get'
  });
};

/**
 * 新增商家资产
 * @param data
 */
export const addMerchantAssets = (data: MerchantAssetsForm) => {
  return request({
    url: '/xpay/merchantAssets',
    method: 'post',
    data: data
  });
};

/**
 * 修改商家资产
 * @param data
 */
export const updateMerchantAssets = (data: MerchantAssetsForm) => {
  return request({
    url: '/xpay/merchantAssets',
    method: 'put',
    data: data
  });
};

/**
 * 删除商家资产
 * @param id
 */
export const delMerchantAssets = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/merchantAssets/' + id,
    method: 'delete'
  });
};
