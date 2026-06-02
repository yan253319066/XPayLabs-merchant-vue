export interface CallbackNoticeVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 订单ID
   */
  orderId: string | number;

  /**
   * 回调URL
   */
  callbackUrl: string;

  /**
   * 回调通知状态
   */
  notifyStatus: string;

  /**
   * 通知时间
   */
  notifyTime: string;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface CallbackNoticeForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 订单ID
   */
  orderId?: string | number;

  /**
   * 回调URL
   */
  callbackUrl?: string;

  /**
   * 回调通知状态
   */
  notifyStatus?: string;

  /**
   * 通知时间
   */
  notifyTime?: string;

}

export interface CallbackNoticeQuery extends PageQuery {

  /**
   * 订单ID
   */
  orderId?: string | number;

  /**
   * 回调URL
   */
  callbackUrl?: string;

  /**
   * 回调通知状态
   */
  notifyStatus?: string;

  /**
   * 通知时间
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



