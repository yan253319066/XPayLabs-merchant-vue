export interface MerchantRechargeWithdrawVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 商家ID
   */
  merchantId: string | number;

  /**
   * 记录类型：充值，提现
   */
  type: string;

  /**
   * 链
   */
  chain: string;

  /**
   * 币种
   */
  symbol: string;

  /**
   * 支付地址
   */
  payAddress: string;

  /**
   * 接收地址
   */
  receiveAddress: string;

  /**
   * 数量
   */
  amount: number;

  /**
   * 状态：PENDING,SUCCESS,FAILED;
   */
  status: string;

  /**
   * 失败原因
   */
  reason: string;

  /**
   * txId
   */
  txId: string | number;

  /**
   * GAS费
   */
  txGas: number;

  /**
   * 平台手续费
   */
  fee: number;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface MerchantRechargeWithdrawForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 记录类型：充值，提现
   */
  type?: string;

  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 支付地址
   */
  payAddress?: string;

  /**
   * 接收地址
   */
  receiveAddress?: string;

  /**
   * 数量
   */
  amount?: number;

  /**
   * 状态：PENDING,SUCCESS,FAILED;
   */
  status?: string;

  /**
   * 失败原因
   */
  reason?: string;

  /**
   * txId
   */
  txId?: string | number;

  /**
   * GAS费
   */
  txGas?: number;

  /**
   * 平台手续费
   */
  fee?: number;

}

export interface MerchantRechargeWithdrawQuery extends PageQuery {

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 记录类型：充值，提现
   */
  type?: string;

  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 支付地址
   */
  payAddress?: string;

  /**
   * 接收地址
   */
  receiveAddress?: string;

  /**
   * 数量
   */
  amount?: number;

  /**
   * 状态：PENDING,SUCCESS,FAILED;
   */
  status?: string;

  /**
   * 失败原因
   */
  reason?: string;

  /**
   * txId
   */
  txId?: string | number;

  /**
   * GAS费
   */
  txGas?: number;

  /**
   * 平台手续费
   */
  fee?: number;

  /**
   * 创建时间
   */
  createTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



