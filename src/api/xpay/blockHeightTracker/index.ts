import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BlockHeightTrackerVO, BlockHeightTrackerForm, BlockHeightTrackerQuery } from '@/api/xpay/blockHeightTracker/types';

/**
 * 查询区块监听高度追踪列表
 * @param query
 * @returns {*}
 */

export const listBlockHeightTracker = (query?: BlockHeightTrackerQuery): AxiosPromise<BlockHeightTrackerVO[]> => {
  return request({
    url: '/xpay/blockHeightTracker/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询区块监听高度追踪详细
 * @param id
 */
export const getBlockHeightTracker = (id: string | number): AxiosPromise<BlockHeightTrackerVO> => {
  return request({
    url: '/xpay/blockHeightTracker/' + id,
    method: 'get'
  });
};

/**
 * 新增区块监听高度追踪
 * @param data
 */
export const addBlockHeightTracker = (data: BlockHeightTrackerForm) => {
  return request({
    url: '/xpay/blockHeightTracker',
    method: 'post',
    data: data
  });
};

/**
 * 修改区块监听高度追踪
 * @param data
 */
export const updateBlockHeightTracker = (data: BlockHeightTrackerForm) => {
  return request({
    url: '/xpay/blockHeightTracker',
    method: 'put',
    data: data
  });
};

/**
 * 删除区块监听高度追踪
 * @param id
 */
export const delBlockHeightTracker = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/blockHeightTracker/' + id,
    method: 'delete'
  });
};
