export interface MerchantCostDetailVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 商家ID
   */
  merchantId: string | number;

  /**
   * 费用类型
   */
  costType: string;

  /**
   * 链
   */
  chain: string;

  /**
   * 币种
   */
  symbol: string;

  /**
   * 数量
   */
  amount: number;

  /**
   * 业务ID
   */
  businessId: string | number;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface MerchantCostDetailForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 费用类型
   */
  costType?: string;

  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 数量
   */
  amount?: number;

  /**
   * 业务ID
   */
  businessId?: string | number;

}

export interface MerchantCostDetailQuery extends PageQuery {

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 费用类型
   */
  costType?: string;

  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 数量
   */
  amount?: number;

  /**
   * 业务ID
   */
  businessId?: string | number;

  /**
   * 创建时间
   */
  createTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



