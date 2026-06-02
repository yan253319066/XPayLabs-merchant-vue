import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CollectRecordVO, CollectRecordForm, CollectRecordQuery } from '@/api/xpay/collectRecord/types';

/**
 * 查询链上归集记录列表
 * @param query
 * @returns {*}
 */

export const listCollectRecord = (query?: CollectRecordQuery): AxiosPromise<CollectRecordVO[]> => {
  return request({
    url: '/xpay/collectRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询链上归集记录详细
 * @param id
 */
export const getCollectRecord = (id: string | number): AxiosPromise<CollectRecordVO> => {
  return request({
    url: '/xpay/collectRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增链上归集记录
 * @param data
 */
export const addCollectRecord = (data: CollectRecordForm) => {
  return request({
    url: '/xpay/collectRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改链上归集记录
 * @param data
 */
export const updateCollectRecord = (data: CollectRecordForm) => {
  return request({
    url: '/xpay/collectRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除链上归集记录
 * @param id
 */
export const delCollectRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/collectRecord/' + id,
    method: 'delete'
  });
};
