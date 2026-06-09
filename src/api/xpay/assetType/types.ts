export interface AssetTypeVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 链
   */
  chain: string;

  /**
   * 币种
   */
  symbol: string;

  /**
   * 合约地址
   */
  contractAddress: string;

  /**
   * 精度
   */
  decimals: number;

  /**
   * 网络
   */
  network: string;

  /**
   * 热钱包地址
   */
  hotAddress: string;

  /**
   * 冷钱包地址
   */
  coldAddress: string;

  /**
   * 触发归集数量
   */
  collectAmount: number;

  /**
   * 确认数
   */
  confirmedNum: number;

  /**
   * 是否启用
   */
  enabled: string;
}

export interface AssetTypeForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 合约地址
   */
  contractAddress?: string;

  /**
   * 精度
   */
  decimals?: number;

  /**
   * 网络
   */
  network?: string;

  /**
   * 热钱包地址
   */
  hotAddress?: string;

  /**
   * 冷钱包地址
   */
  coldAddress?: string;

  /**
   * 触发归集数量
   */
  collectAmount?: number;

  /**
   * 确认数
   */
  confirmedNum?: number;

  /**
   * 是否启用
   */
  enabled?: string;
}

export interface AssetTypeQuery extends PageQuery {
  /**
   * 链
   */
  chain?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 合约地址
   */
  contractAddress?: string;

  /**
   * 精度
   */
  decimals?: number;

  /**
   * 网络
   */
  network?: string;

  /**
   * 热钱包地址
   */
  hotAddress?: string;

  /**
   * 冷钱包地址
   */
  coldAddress?: string;

  /**
   * 触发归集数量
   */
  collectAmount?: number;

  /**
   * 确认数
   */
  confirmedNum?: number;

  /**
   * 是否启用
   */
  enabled?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
