export interface FiatcurrencyOrderVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 商户订单号
   */
  orderNo: string;

  /**
   * 商户ID
   */
  merchantId: string | number;

  /**
   * 订单类型
   */
  orderType: string;

  /**
   * 金额
   */
  amount: number;

  /**
   * 币种
   */
  currency: string;

  /**
   * 付款人姓名
   */
  payerName: string;

  /**
   * 付款人账号
   */
  payerAccount: string;

  /**
   * 付款人手机号
   */
  payerPhone: string;

  /**
   * 付款人邮箱
   */
  payerEmail: string;

  /**
   * 付款代码
   */
  payerCode: string;

  /**
   * 扩展字段，JSON格式
   */
  extra: string;

  /**
   * 收款人姓名
   */
  payeeName: string;

  /**
   * 收款人账号
   */
  payeeAccount: string;

  /**
   * 收款人手机号
   */
  payeePhone: string;

  /**
   * 收款人邮箱
   */
  payeeEmail: string;

  /**
   * 收款代码
   */
  payeeCode: string;

  /**
   * 订单状态: INIT,WAIT, PADDING, SUCCESS, FAIL
   */
  status: string;

  /**
   * 支付通道代码
   */
  channelCode: string;

  /**
   * 商户通知地址
   */
  notifyUrl: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 第三方响应内容
   */
  thirdPartyResponse: string;

  /**
   * 第三方回调内容
   */
  callbackContent: string;

}

export interface FiatcurrencyOrderForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 商户订单号
   */
  orderNo?: string;

  /**
   * 商户ID
   */
  merchantId?: string | number;

  /**
   * 订单类型
   */
  orderType?: string;

  /**
   * 金额
   */
  amount?: number;

  /**
   * 币种
   */
  currency?: string;

  /**
   * 付款人姓名
   */
  payerName?: string;

  /**
   * 付款人账号
   */
  payerAccount?: string;

  /**
   * 付款人手机号
   */
  payerPhone?: string;

  /**
   * 付款人邮箱
   */
  payerEmail?: string;

  /**
   * 付款代码
   */
  payerCode?: string;

  /**
   * 扩展字段，JSON格式
   */
  extra?: string;

  /**
   * 收款人姓名
   */
  payeeName?: string;

  /**
   * 收款人账号
   */
  payeeAccount?: string;

  /**
   * 收款人手机号
   */
  payeePhone?: string;

  /**
   * 收款人邮箱
   */
  payeeEmail?: string;

  /**
   * 收款代码
   */
  payeeCode?: string;

  /**
   * 订单状态: INIT,WAIT, PADDING, SUCCESS, FAIL
   */
  status?: string;

  /**
   * 支付通道代码
   */
  channelCode?: string;

  /**
   * 商户通知地址
   */
  notifyUrl?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 第三方响应内容
   */
  thirdPartyResponse?: string;

  /**
   * 第三方回调内容
   */
  callbackContent?: string;

}

export interface FiatcurrencyOrderQuery extends PageQuery {

  /**
   * 商户订单号
   */
  orderNo?: string;

  /**
   * 商户ID
   */
  merchantId?: string | number;

  /**
   * 订单类型
   */
  orderType?: string;

  /**
   * 金额
   */
  amount?: number;

  /**
   * 币种
   */
  currency?: string;

  /**
   * 付款人姓名
   */
  payerName?: string;

  /**
   * 付款人账号
   */
  payerAccount?: string;

  /**
   * 付款人手机号
   */
  payerPhone?: string;

  /**
   * 付款人邮箱
   */
  payerEmail?: string;

  /**
   * 付款代码
   */
  payerCode?: string;

  /**
   * 扩展字段，JSON格式
   */
  extra?: string;

  /**
   * 收款人姓名
   */
  payeeName?: string;

  /**
   * 收款人账号
   */
  payeeAccount?: string;

  /**
   * 收款人手机号
   */
  payeePhone?: string;

  /**
   * 收款人邮箱
   */
  payeeEmail?: string;

  /**
   * 收款代码
   */
  payeeCode?: string;

  /**
   * 订单状态: INIT,WAIT, PADDING, SUCCESS, FAIL
   */
  status?: string;

  /**
   * 支付通道代码
   */
  channelCode?: string;

  /**
   * 商户通知地址
   */
  notifyUrl?: string;

  /**
   * 第三方响应内容
   */
  thirdPartyResponse?: string;

  /**
   * 第三方回调内容
   */
  callbackContent?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



