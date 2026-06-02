export interface PaymentOrderVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 商家ID
   */
  merchantId: string | number;

  /**
   * 订单编号
   */
  merchantOrderId: string | number;

  /**
   * uid
   */
  uid: string | number;

  /**
   * 订单类型
   */
  orderType: string;

  /**
   * 链
   */
  chain: string;

  /**
   * 币种
   */
  symbol: string;

  /**
   * 付款地址
   */
  payAddress: string;

  /**
   * 收款地址
   */
  receiveAddress: string;

  /**
   * 数量
   */
  amount: number;

  /**
   * 过期时间
   */
  expiredTime: number;

  /**
   * 状态
   */
  status: string;

  /**
   * 失败原因
   */
  reason: string;

  /**
   * Hash
   */
  txId: string | number;

  /**
   * GAS
   */
  txGas: number;

  /**
   * 回调状态
   */
  notifyStatus: string;

  /**
   * 回调URL
   */
  callbackUrl: string;

  /**
   * 回调时间
   */
  notifyTime: string;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface PaymentOrderForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 订单编号
   */
  merchantOrderId?: string | number;

  /**
   * uid
   */
  uid?: string | number;

  /**
   * 订单类型
   */
  orderType?: string;

  /**
   * 支付币种ID
   */
  assetTypeId?: string | number;

  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 付款地址
   */
  payAddress?: string;

  /**
   * 收款地址
   */
  receiveAddress?: string;

  /**
   * 数量
   */
  amount?: number;

  handingFee?: number;
  handingRate?: number;

  /**
   * 过期时间
   */
  expiredTime?: number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 失败原因
   */
  reason?: string;

  /**
   * Hash
   */
  txId?: string | number;

  /**
   * GAS
   */
  txGas?: number;

  /**
   * 回调状态
   */
  notifyStatus?: string;

  /**
   * 回调URL
   */
  callbackUrl?: string;

  /**
   * 回调时间
   */
  notifyTime?: string;

}

export interface PaymentOrderQuery extends PageQuery {

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 订单编号
   */
  merchantOrderId?: string | number;

  /**
   * uid
   */
  uid?: string | number;

  /**
   * 订单类型
   */
  orderType?: string;

  /**
   * 支付币种ID
   */
  assetTypeId?: string | number;

  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 付款地址
   */
  payAddress?: string;

  /**
   * 收款地址
   */
  receiveAddress?: string;

  /**
   * 数量
   */
  amount?: number;

  /**
   * 过期时间
   */
  expiredTime?: number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 失败原因
   */
  reason?: string;

  /**
   * Hash
   */
  txId?: string | number;

  /**
   * GAS
   */
  txGas?: number;

  /**
   * 回调状态
   */
  notifyStatus?: string;

  /**
   * 回调URL
   */
  callbackUrl?: string;

  /**
   * 回调时间
   */
  notifyTime?: string;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



