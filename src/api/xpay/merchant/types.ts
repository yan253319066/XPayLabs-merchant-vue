export interface setEnergyApikeyForm {
  apiKey: string;
  code: number;
}
export interface setWhitelistIpForm {
  ips: string;
  code: number;
}
export interface UpdateCallbackUrlForm {
  callbackUrl: string;
  code: number;
}
export interface updateColdAddressForm {
  address: string;
  chain: string;
  code: number;
}
export interface WithdrawalForm {
  chain: string;
  symbol: string;
  amount: number;
  code: number;
}
export interface ApiKeyVo {
  apiKey: string;
  webhookSecret: string;
}
export interface Google2fa {
  secretKey: string;
  qrCodeUrl: string;
}
export interface Verify2faForm  {
  code: number;
}

export interface Verify2faSuccess {
  verify: boolean;
}

export interface MerchantVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 商户名称
   */
  name: string;

  /**
   * 商户鉴权Token
   */
  token: string;

  /**
   * webhook秘钥
   */
  webhookSecret: string;

  /**
   * VIP等级
   */
  vip: number;

  /**
   * 手续费(百分比)
   */
  feeRatio: number;

  /**
   * 提币类型
   */
  withdrawalType: string;

  /**
   * 系统版本
   */
  merchantSysVersion: string;

  /**
   * 回调URL
   */
  callbackUrl: string;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface MerchantForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 商户名称
   */
  name?: string;

  /**
   * 商户鉴权Token
   */
  token?: string;

  /**
   * webhook秘钥
   */
  webhookSecret?: string;

  /**
   * VIP等级
   */
  vip?: number;

  /**
   * 手续费(百分比)
   */
  feeRatio?: number;

  /**
   * 提币类型
   */
  withdrawalType?: string;

  /**
   * 系统版本
   */
  merchantSysVersion?: string;

  /**
   * 回调URL
   */
  callbackUrl?: string;

}

export interface MerchantQuery extends PageQuery {

  /**
   * 商户名称
   */
  name?: string;

  /**
   * 商户鉴权Token
   */
  token?: string;

  /**
   * webhook秘钥
   */
  webhookSecret?: string;

  /**
   * VIP等级
   */
  vip?: number;

  /**
   * 手续费(百分比)
   */
  feeRatio?: number;

  /**
   * 提币类型
   */
  withdrawalType?: string;

  /**
   * 回调URL
   */
  callbackUrl?: string;

  /**
   * 创建时间
   */
  createTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



