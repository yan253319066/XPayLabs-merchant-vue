import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MerchantAssetDetailsVO, MerchantAssetDetailsForm, MerchantAssetDetailsQuery } from '@/api/xpay/merchantAssetDetails/types';

/**
 * 查询资产变动明细列表
 * @param query
 * @returns {*}
 */

export const listMerchantAssetDetails = (query?: MerchantAssetDetailsQuery): AxiosPromise<MerchantAssetDetailsVO[]> => {
  return request({
    url: '/xpay/merchantAssetDetails/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询资产变动明细详细
 * @param id
 */
export const getMerchantAssetDetails = (id: string | number): AxiosPromise<MerchantAssetDetailsVO> => {
  return request({
    url: '/xpay/merchantAssetDetails/' + id,
    method: 'get'
  });
};

/**
 * 新增资产变动明细
 * @param data
 */
export const addMerchantAssetDetails = (data: MerchantAssetDetailsForm) => {
  return request({
    url: '/xpay/merchantAssetDetails',
    method: 'post',
    data: data
  });
};

/**
 * 修改资产变动明细
 * @param data
 */
export const updateMerchantAssetDetails = (data: MerchantAssetDetailsForm) => {
  return request({
    url: '/xpay/merchantAssetDetails',
    method: 'put',
    data: data
  });
};

/**
 * 删除资产变动明细
 * @param id
 */
export const delMerchantAssetDetails = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/merchantAssetDetails/' + id,
    method: 'delete'
  });
};
