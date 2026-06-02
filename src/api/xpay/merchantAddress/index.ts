import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MerchantAddressVO, MerchantAddressForm, MerchantAddressQuery } from '@/api/xpay/merchantAddress/types';


/**
 * 获取登录商家的地址信息
 * @returns {*}
 */
export const myAddressList = (): AxiosPromise<MerchantAddressVO[]> => {
  return request({                  
    url: '/xpay/merchantAddress/myAddressList',
    method: 'get'
  });
};  

/**
 * 查询商家钱包地址列表
 * @param query
 * @returns {*}
 */

export const listMerchantAddress = (query?: MerchantAddressQuery): AxiosPromise<MerchantAddressVO[]> => {
  return request({
    url: '/xpay/merchantAddress/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商家钱包地址详细
 * @param id
 */
export const getMerchantAddress = (id: string | number): AxiosPromise<MerchantAddressVO> => {
  return request({
    url: '/xpay/merchantAddress/' + id,
    method: 'get'
  });
};

/**
 * 新增商家钱包地址
 * @param data
 */
export const addMerchantAddress = (data: MerchantAddressForm) => {
  return request({
    url: '/xpay/merchantAddress',
    method: 'post',
    data: data
  });
};

/**
 * 修改商家钱包地址
 * @param data
 */
export const updateMerchantAddress = (data: MerchantAddressForm) => {
  return request({
    url: '/xpay/merchantAddress',
    method: 'put',
    data: data
  });
};

/**
 * 删除商家钱包地址
 * @param id
 */
export const delMerchantAddress = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/merchantAddress/' + id,
    method: 'delete'
  });
};
