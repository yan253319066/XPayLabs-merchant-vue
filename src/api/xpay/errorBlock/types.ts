export interface ErrorBlockVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 错误高度
   */
  blockNumber: number;

}

export interface ErrorBlockForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 错误高度
   */
  blockNumber?: number;

}

export interface ErrorBlockQuery extends PageQuery {

  /**
   * 错误高度
   */
  blockNumber?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



