export interface TxRecordVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 订单编号
   */
  orderId: string | number;

  /**
   * 高度
   */
  blockNumber: number;

  /**
   * 付款地址
   */
  fromAddress: string;

  /**
   * 收款地址
   */
  toAddress: string;

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
   * Hash
   */
  txId: string | number;

  /**
   * 合约地址
   */
  contractAddress: string;

  /**
   * 交易类型
   */
  txType: string;

  /**
   * GAS
   */
  txFee: number;

  /**
   * 确认数
   */
  confirmedNum: number;

  /**
   * 交易状态
   */
  status: string;

  /**
   * 区块时间
   */
  blockTime: number;

}

export interface TxRecordForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 订单编号
   */
  orderId?: string | number;

  /**
   * 高度
   */
  blockNumber?: number;

  /**
   * 付款地址
   */
  fromAddress?: string;

  /**
   * 收款地址
   */
  toAddress?: string;

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
   * Hash
   */
  txId?: string | number;

  /**
   * 合约地址
   */
  contractAddress?: string;

  /**
   * 交易类型
   */
  txType?: string;

  /**
   * GAS
   */
  txFee?: number;

  /**
   * 确认数
   */
  confirmedNum?: number;

  /**
   * 交易状态
   */
  status?: string;

  /**
   * 区块时间
   */
  blockTime?: number;

}

export interface TxRecordQuery extends PageQuery {

  /**
   * 订单编号
   */
  orderId?: string | number;

  /**
   * 高度
   */
  blockNumber?: number;

  /**
   * 付款地址
   */
  fromAddress?: string;

  /**
   * 收款地址
   */
  toAddress?: string;

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
   * Hash
   */
  txId?: string | number;

  /**
   * 合约地址
   */
  contractAddress?: string;

  /**
   * 交易类型
   */
  txType?: string;

  /**
   * GAS
   */
  txFee?: number;

  /**
   * 确认数
   */
  confirmedNum?: number;

  /**
   * 交易状态
   */
  status?: string;

  /**
   * 区块时间
   */
  blockTime?: number;

  /**
   * 创建实际
   */
  createTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



