import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CallbackNoticeVO, CallbackNoticeForm, CallbackNoticeQuery } from '@/api/xpay/callbackNotice/types';

/**
 * 查询回调通知列表
 * @param query
 * @returns {*}
 */

export const listCallbackNotice = (query?: CallbackNoticeQuery): AxiosPromise<CallbackNoticeVO[]> => {
  return request({
    url: '/xpay/callbackNotice/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询回调通知详细
 * @param id
 */
export const getCallbackNotice = (id: string | number): AxiosPromise<CallbackNoticeVO> => {
  return request({
    url: '/xpay/callbackNotice/' + id,
    method: 'get'
  });
};

/**
 * 新增回调通知
 * @param data
 */
export const addCallbackNotice = (data: CallbackNoticeForm) => {
  return request({
    url: '/xpay/callbackNotice',
    method: 'post',
    data: data
  });
};

/**
 * 修改回调通知
 * @param data
 */
export const updateCallbackNotice = (data: CallbackNoticeForm) => {
  return request({
    url: '/xpay/callbackNotice',
    method: 'put',
    data: data
  });
};

/**
 * 删除回调通知
 * @param id
 */
export const delCallbackNotice = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/callbackNotice/' + id,
    method: 'delete'
  });
};
