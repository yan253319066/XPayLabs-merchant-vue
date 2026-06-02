export interface CollectRecordVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 商家ID
   */
  merchantId: string | number;

  /**
   * 区块高度
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
   * 合约
   */
  contractAddress: string;

  /**
   * GAS费
   */
  txFee: number;

  /**
   * 确实数
   */
  confirmedNum: number;

  /**
   * 交易状态
   */
  status: string;

  /**
   * 确认时间
   */
  blockTime: number;

  /**
   * 预计转账数量
   */
  collectAmount: number;

  /**
   * 平台手续费
   */
  fee: number;

  /**
   * 平台手续费率
   */
  feeRatio: number;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface CollectRecordForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 区块高度
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
   * 合约
   */
  contractAddress?: string;

  /**
   * GAS费
   */
  txFee?: number;

  /**
   * 确实数
   */
  confirmedNum?: number;

  /**
   * 交易状态
   */
  status?: string;

  /**
   * 确认时间
   */
  blockTime?: number;

  /**
   * 预计转账数量
   */
  collectAmount?: number;

  /**
   * 平台手续费
   */
  fee?: number;

  /**
   * 平台手续费率
   */
  feeRatio?: number;

}

export interface CollectRecordQuery extends PageQuery {

  /**
   * 商家ID
   */
  merchantId?: string | number;

  /**
   * 区块高度
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
   * 合约
   */
  contractAddress?: string;

  /**
   * GAS费
   */
  txFee?: number;

  /**
   * 确实数
   */
  confirmedNum?: number;

  /**
   * 交易状态
   */
  status?: string;

  /**
   * 确认时间
   */
  blockTime?: number;

  /**
   * 预计转账数量
   */
  collectAmount?: number;

  /**
   * 平台手续费
   */
  fee?: number;

  /**
   * 平台手续费率
   */
  feeRatio?: number;

  /**
   * 创建时间
   */
  createTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



