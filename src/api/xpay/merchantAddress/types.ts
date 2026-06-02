export interface MerchantAddressVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 商家ID
   */
  merchantId: string | number;

  /**
   * 链
   */
  chain: string;

  /**
   * 币种
   */
  symbol: string;

  /**
   * 冷钱包地址
   */
  coldAddress: string;

  /**
   * 归集触发数量
   */
  collectAmount: number;

  /**
   * 热钱包地址
   */
  hotAddress: string;

}

export interface MerchantAddressForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 冷钱包地址
   */
  coldAddress?: string;

  /**
   * 归集触发数量
   */
  collectAmount?: number;

  /**
   * 热钱包地址
   */
  hotAddress?: string;

}

export interface MerchantAddressQuery extends PageQuery {

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 冷钱包地址
   */
  coldAddress?: string;

  /**
   * 归集触发数量
   */
  collectAmount?: number;

  /**
   * 热钱包地址
   */
  hotAddress?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}


