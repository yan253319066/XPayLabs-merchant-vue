export interface UserAddressVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 商家ID
   */
  merchantId: string | number;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 链
   */
  chain: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 是否可归集
   */
  collectible: string;

}

export interface UserAddressForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 链
   */
  chain?: string;

  /**
   * 地址
   */
  address?: string;

  /**
   * 是否可归集
   */
  collectible?: string;

}

export interface UserAddressQuery extends PageQuery {

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 链
   */
  chain?: string;

  /**
   * 地址
   */
  address?: string;

  /**
   * 是否可归集
   */
  collectible?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}


/**
 * 待归集余额信息
 */
export interface PendingCollectionVO {
  /**
   * 链+币种
   */
  chainSymbol: number;
  
  /**
   * 待归集USDT余额
   */
  totalAmount: number;
}