export interface MerchantAssetsVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 商家ID
   */
  merchantId: string | number;

  /**
   * 币种符号(USDT,BTC等)
   */
  symbol: string;

  /**
   * 可用余额
   */
  balance: number;

  /**
   * 冻结余额
   */
  frozenBalance: number;

  /**
   * 总余额(冗余)
   */
  totalBalance: number;

}

export interface MerchantAssetsForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 币种符号(USDT,BTC等)
   */
  symbol?: string;

  /**
   * 可用余额
   */
  balance?: number;

  /**
   * 冻结余额
   */
  frozenBalance?: number;

  /**
   * 总余额(冗余)
   */
  totalBalance?: number;

}

export interface MerchantAssetsQuery extends PageQuery {

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 币种符号(USDT,BTC等)
   */
  symbol?: string;

  /**
   * 可用余额
   */
  balance?: number;

  /**
   * 冻结余额
   */
  frozenBalance?: number;

  /**
   * 总余额(冗余)
   */
  totalBalance?: number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 更新时间
   */
  updateTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



