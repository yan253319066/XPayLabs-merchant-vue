export interface BlockHeightTrackerVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 链
   */
  chain: string;

  /**
   * 当前高度
   */
  lastHeight: number;

}

export interface BlockHeightTrackerForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 链
   */
  chain?: string;

  /**
   * 当前高度
   */
  lastHeight?: number;

}

export interface BlockHeightTrackerQuery extends PageQuery {

  /**
   * 链
   */
  chain?: string;

  /**
   * 当前高度
   */
  lastHeight?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



