/* 请求 */
/**
 * 用户注册请求信息
 */
export interface IReqAccountSignUp {
  /** 账号，即手机号 */
  passportNo: string
  /** 注册凭证类型，当前只支持手机号注册，只允许填写mobile */
  passportType?: string
  /** 密码 */
  password: string
  /** 短信验证码 */
  pinCode: string
}

/**
 * 用户登录
 */
export interface IReqAccountSignIn {
  /** 账号，即手机号 */
  passportNo: string
  /** 注册凭证类型，当前只支持手机号注册，只允许填写mobile */
  passportType: string
  /** 密码 */
  password?: string
  /** 登录方式：pinCode, password*/
  signType: string
  /** 短信验证码 */
  pinCode?: string
  /** 图形验证码 */
  captchaCode?: string
  /** 图形验证码请求Id */
  captchaCodeId?: string
}

/* 返回 */
/**
 * 用户登录信息
 */
export interface IResAccountSignInfo {
  /** 访问token */
  accessToken: string
  /** 过期秒数 */
  expiresIn: number
  /** 过期毫秒数 */
  expiresTime: number
  /** 刷新token */
  refreshToken: string
  /** 用户Id */
  userId: string
  /** 企业Id */
  subjectId: string
  /** 企业名称 */
  subjectName: string
}

/**
 * 用户基本信息
 */
export interface IResUserBasicInfo {
  /** 详细地址 */
  address: string
  /** 市 */
  city: string
  /** 国家 */
  country: string
  /** 区县 */
  district: string
  /** 手机号 */
  mobile: string
  /** 姓名 */
  name: string
  /** 省 */
  province: string
}

/**
 * 图形验证码验证信息
 */
export interface IResCaptchaCode {
  /** 图形验证码base64字符串 */
  captchaCode: string
  /** 图形验证码Id */
  captchaCodeId: string
}
