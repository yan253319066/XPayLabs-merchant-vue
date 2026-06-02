import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AssetTypeVO, AssetTypeForm, AssetTypeQuery } from '@/api/xpay/assetType/types';

/**
 * 查询支持的币种资产类型列表
 * @param query
 * @returns {*}
 */

export const listAssetType = (query?: AssetTypeQuery): AxiosPromise<AssetTypeVO[]> => {
  return request({
    url: '/xpay/assetType/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询支持的币种资产类型详细
 * @param id
 */
export const getAssetType = (id: string | number): AxiosPromise<AssetTypeVO> => {
  return request({
    url: '/xpay/assetType/' + id,
    method: 'get'
  });
};

/**
 * 新增支持的币种资产类型
 * @param data
 */
export const addAssetType = (data: AssetTypeForm) => {
  return request({
    url: '/xpay/assetType',
    method: 'post',
    data: data
  });
};

/**
 * 修改支持的币种资产类型
 * @param data
 */
export const updateAssetType = (data: AssetTypeForm) => {
  return request({
    url: '/xpay/assetType',
    method: 'put',
    data: data
  });
};

/**
 * 删除支持的币种资产类型
 * @param id
 */
export const delAssetType = (id: string | number | Array<string | number>) => {
  return request({
    url: '/xpay/assetType/' + id,
    method: 'delete'
  });
};
