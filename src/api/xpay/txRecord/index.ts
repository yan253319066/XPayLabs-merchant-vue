import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TxRecordVO, TxRecordForm, TxRecordQuery } from '@/api/xpay/txRecord/types';

/**
 * 查询链上交易记录列表
 * @param query
 * @returns {*}
 */

export const listTxRecord = (query?: TxRecordQuery): AxiosPromise<TxRecordVO[]> => {
  return request({
    url: '/xpay/txRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询链上交易记录详细
 * @param id
 */
export const getTxRecord = (id: string | number): AxiosPromise<TxRecordVO> => {
  return request({
    url: '/xpay/txRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增链上交易记录
 * @param data
 */
export const addTxRecord = (data: TxRecordForm) => {
  return request({
    url: '/xpay/txRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改链上交易记录
 * @param data
 */
export const updateTxRecord = (data: TxRecordForm) => {
  return request({
    url: '/xpay/txRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除链上交易记录
 * @param id
 */
export const delTxRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/txRecord/' + id,
    method: 'delete'
  });
};
