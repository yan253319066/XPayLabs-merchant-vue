export interface UserVO {
  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 用户编号
   */
  userCode: string;

  /**
   * 用户账号
   */
  userName: string;

  /**
   * 用户昵称
   */
  nickName: string;

  /**
   * 用户类型
   */
  userType: string;

  /**
   * 用户邮箱
   */
  email: string;

  /**
   * 手机区号
   */
  areacode: string;

  /**
   * 手机号码
   */
  phonenumber: string;

  /**
   * 用户性别（0男 1女 2未知）
   */
  sex: string;

  /**
   * 头像地址
   */
  avatar: number;

  /**
   * 密码
   */
  password: string;

  /**
   * VIP等级
   */
  vipLevel: number;

  /**
   * 支付密码
   */
  payPwd: string;

  /**
   * 邀请码
   */
  inviteCode: string;

  /**
   * 推荐人ID
   */
  parentId: string | number;

  /**
   * 有效推荐人数
   */
  validRecommend: string | number;

  /**
   * 积分
   */
  point: number;

  /**
   * 帐号状态（0正常 1停用）
   */
  status: string;

  /**
   * 最后登录IP
   */
  loginIp: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 更新时间
   */
  updateTime: string;

}

export interface UserForm extends BaseEntity {
  /**
   * 用户账号
   */
  userName?: string;

  /**
   * 用户昵称
   */
  nickName?: string;

  /**
   * 用户类型
   */
  userType?: string;

  /**
   * 用户邮箱
   */
  email?: string;

  /**
   * 手机区号
   */
  areacode?: string;

  /**
   * 手机号码
   */
  phonenumber?: string;

  /**
   * 用户性别（0男 1女 2未知）
   */
  sex?: string;

  /**
   * 头像地址
   */
  avatar?: number;

  /**
   * 密码
   */
  password?: string;

  /**
   * VIP等级
   */
  vipLevel?: number;

  /**
   * 支付密码
   */
  payPwd?: string;

  /**
   * 邀请码
   */
  inviteCode?: string;

  /**
   * 推荐人ID
   */
  parentId?: string | number;

  /**
   * 推荐人IDs
   */
  referrerIds?: string | number;

  /**
   * 积分
   */
  point?: number;

  /**
   * 帐号状态（0正常 1停用）
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface UserQuery extends PageQuery {

  /**
   * 用户账号
   */
  userName?: string;

  /**
   * 用户昵称
   */
  nickName?: string;

  /**
   * 用户类型
   */
  userType?: string;

  /**
   * 用户邮箱
   */
  email?: string;

  /**
   * 手机区号
   */
  areacode?: string;

  /**
   * 手机号码
   */
  phonenumber?: string;

  /**
   * 用户性别（0男 1女 2未知）
   */
  sex?: string;

  /**
   * 头像地址
   */
  avatar?: number;

  /**
   * 密码
   */
  password?: string;

  /**
   * VIP等级
   */
  vipLevel?: number;

  /**
   * 支付密码
   */
  payPwd?: string;

  /**
   * 邀请码
   */
  inviteCode?: string;

  /**
   * 推荐人ID
   */
  parentId?: string | number;

  /**
   * 推荐人IDs
   */
  referrerIds?: string | number;

  /**
   * 积分
   */
  point?: number;

  /**
   * 帐号状态（0正常 1停用）
   */
  status?: string;

  /**
   * 最后登录IP
   */
  loginIp?: string;

  /**
   * 最后登录时间
   */
  loginDate?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



