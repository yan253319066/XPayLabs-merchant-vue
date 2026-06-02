import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserAddressVO, UserAddressForm, UserAddressQuery, PendingCollectionVO } from '@/api/xpay/userAddress/types';

/**
 * 获取待归集余额
 * @returns {*}
 */
export const getPendingCollectionBalances = (): AxiosPromise<PendingCollectionVO[]> => {
  return request({                  
    url: '/xpay/userAddress/getPendingCollectionBalances',
    method: 'get'
  });
}

/**
 * 查询用户地址列表
 * @param query
 * @returns {*}
 */

export const listUserAddress = (query?: UserAddressQuery): AxiosPromise<UserAddressVO[]> => {
  return request({
    url: '/xpay/userAddress/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户地址详细
 * @param id
 */
export const getUserAddress = (id: string | number): AxiosPromise<UserAddressVO> => {
  return request({
    url: '/xpay/userAddress/' + id,
    method: 'get'
  });
};

/**
 * 新增用户地址
 * @param data
 */
export const addUserAddress = (data: UserAddressForm) => {
  return request({
    url: '/xpay/userAddress',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户地址
 * @param data
 */
export const updateUserAddress = (data: UserAddressForm) => {
  return request({
    url: '/xpay/userAddress',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户地址
 * @param id
 */
export const delUserAddress = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/userAddress/' + id,
    method: 'delete'
  });
};
