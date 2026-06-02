export interface MerchantAssetDetailsVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 交易流水号
   */
  transactionNo: string;

  /**
   * 商家ID
   */
  merchantId: string | number;

  /**
   * 币种符号
   */
  symbol: string;

  /**
   * 变动金额
   */
  amount: number;

  /**
   * 变动前可用余额
   */
  oldBalance: number;

  /**
   * 变动后可用余额
   */
  newBalance: number;

  /**
   * 变动前冻结余额
   */
  oldFrozen: number;

  /**
   * 变动后冻结余额
   */
  newFrozen: number;

  /**
   * 类型:deposit/withdraw/payin/payout
   */
  type: string;

  /**
   * 收入/支出IN/OUT
   */
  inOut: string;

  /**
   * 手续费
   */
  fee: number;

  /**
   * 手续费费率
   */
  feerate: number;

  /**
   * 手续费币种
   */
  feeSymbol: string;

  /**
   * 兑换汇率（仅兑换类型有效）
   */
  rate: number;

  /**
   * 备注
   */
  remark: string;

}

export interface MerchantAssetDetailsForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 交易流水号
   */
  transactionNo?: string;

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 币种符号
   */
  symbol?: string;

  /**
   * 变动金额
   */
  amount?: number;

  /**
   * 变动前可用余额
   */
  oldBalance?: number;

  /**
   * 变动后可用余额
   */
  newBalance?: number;

  /**
   * 变动前冻结余额
   */
  oldFrozen?: number;

  /**
   * 变动后冻结余额
   */
  newFrozen?: number;

  /**
   * 类型:deposit/withdraw/payin/payout
   */
  type?: string;

  /**
   * 收入/支出IN/OUT
   */
  inOut?: string;

  /**
   * 手续费
   */
  fee?: number;

  /**
   * 手续费费率
   */
  feerate?: number;

  /**
   * 手续费币种
   */
  feeSymbol?: string;

  /**
   * 兑换汇率（仅兑换类型有效）
   */
  rate?: number;

  /**
   * 备注
   */
  remark?: string;

}

export interface MerchantAssetDetailsQuery extends PageQuery {

  /**
   * 交易流水号
   */
  transactionNo?: string;

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 币种符号
   */
  symbol?: string;

  /**
   * 变动金额
   */
  amount?: number;

  /**
   * 变动前可用余额
   */
  oldBalance?: number;

  /**
   * 变动后可用余额
   */
  newBalance?: number;

  /**
   * 变动前冻结余额
   */
  oldFrozen?: number;

  /**
   * 变动后冻结余额
   */
  newFrozen?: number;

  /**
   * 类型:deposit/withdraw/payin/payout
   */
  type?: string;

  /**
   * 收入/支出IN/OUT
   */
  inOut?: string;

  /**
   * 手续费
   */
  fee?: number;

  /**
   * 手续费费率
   */
  feerate?: number;

  /**
   * 手续费币种
   */
  feeSymbol?: string;

  /**
   * 兑换汇率（仅兑换类型有效）
   */
  rate?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



