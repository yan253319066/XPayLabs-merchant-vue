import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MerchantRechargeWithdrawVO, MerchantRechargeWithdrawForm, MerchantRechargeWithdrawQuery } from '@/api/xpay/merchantRechargeWithdraw/types';

/**
 * 查询商家充值提现列表
 * @param query
 * @returns {*}
 */

export const listMerchantRechargeWithdraw = (query?: MerchantRechargeWithdrawQuery): AxiosPromise<MerchantRechargeWithdrawVO[]> => {
  return request({
    url: '/xpay/merchantRechargeWithdraw/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商家充值提现详细
 * @param id
 */
export const getMerchantRechargeWithdraw = (id: string | number): AxiosPromise<MerchantRechargeWithdrawVO> => {
  return request({
    url: '/xpay/merchantRechargeWithdraw/' + id,
    method: 'get'
  });
};

/**
 * 新增商家充值提现
 * @param data
 */
export const addMerchantRechargeWithdraw = (data: MerchantRechargeWithdrawForm) => {
  return request({
    url: '/xpay/merchantRechargeWithdraw',
    method: 'post',
    data: data
  });
};

/**
 * 修改商家充值提现
 * @param data
 */
export const updateMerchantRechargeWithdraw = (data: MerchantRechargeWithdrawForm) => {
  return request({
    url: '/xpay/merchantRechargeWithdraw',
    method: 'put',
    data: data
  });
};

/**
 * 删除商家充值提现
 * @param id
 */
export const delMerchantRechargeWithdraw = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/merchantRechargeWithdraw/' + id,
    method: 'delete'
  });
};

/**
 * 审核通过
 * @param id
 */
export const approveMerchantRechargeWithdraw = (id: string | number) => {
  return request({
    url: '/xpay/merchantRechargeWithdraw/approve/' + id,
    method: 'post'
  });
};

/**
 * 审核不通过
 * @param id
 * @param reason
 */
export const unapproveMerchantRechargeWithdraw = (id: string | number, reason: string) => {
  return request({
    url: '/xpay/merchantRechargeWithdraw/unapprove/' + id,
    method: 'post',
    params: { reason }
  });
};
