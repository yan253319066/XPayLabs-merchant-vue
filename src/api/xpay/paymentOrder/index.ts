import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PaymentOrderVO, PaymentOrderForm, PaymentOrderQuery } from '@/api/xpay/paymentOrder/types';

/**
 * 查询支付订单列表
 * @param query
 * @returns {*}
 */

export const listPaymentOrder = (query?: PaymentOrderQuery): AxiosPromise<PaymentOrderVO[]> => {
  return request({
    url: '/xpay/paymentOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询支付订单详细
 * @param id
 */
export const getPaymentOrder = (id: string | number): AxiosPromise<PaymentOrderVO> => {
  return request({
    url: '/xpay/paymentOrder/' + id,
    method: 'get'
  });
};

/**
 * 新增支付订单
 * @param data
 */
export const addPaymentOrder = (data: PaymentOrderForm) => {
  return request({
    url: '/xpay/paymentOrder',
    method: 'post',
    data: data
  });
};

/**
 * 修改支付订单
 * @param data
 */
export const updatePaymentOrder = (data: PaymentOrderForm) => {
  return request({
    url: '/xpay/paymentOrder',
    method: 'put',
    data: data
  });
};

/**
 * 删除支付订单
 * @param id
 */
export const delPaymentOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/paymentOrder/' + id,
    method: 'delete'
  });
};
