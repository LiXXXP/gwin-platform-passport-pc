import md5 from 'js-md5'
import Cookies, { CookiesStatic } from 'js-cookie'
import { Request, Response, NoArgsCallbackFunction } from '@gwin/networking'
import {
  IReqAccountSignUp,
  IReqAccountSignIn,
  IResAccountSignInfo,
  IResUserBasicInfo,
  IResCaptchaCode
} from './interface'

const ACCOUNT_SIGNIN_INFO_KEY = 'ACCOUNT_SIGNIN_INFO_KEY'
const ACCOUNT_USER_BASIC_INFO_KEY = 'ACCOUNT_USER_BASIC_INFO_KEY'
const ACCESS_TOKEN_KEY = 'accessToken'
const USER_ID_KEY = 'userId'
const ENTITY_ID_KEY = 'entityId'

const cookie: CookiesStatic = Cookies.withAttributes({ domain: '.cdgwin.com', expires: 1 })

class Passport {
  private signInfo: IResAccountSignInfo
  private userBasicInfo: IResUserBasicInfo

  public constructor() {
    const signInfoCookie = cookie.get(ACCOUNT_SIGNIN_INFO_KEY)
    if (signInfoCookie) {
      this.signInfo = JSON.parse(signInfoCookie)
    } else {
      this.signInfo = {
        accessToken: '',
        expiresIn: -1,
        expiresTime: -1,
        refreshToken: '',
        userId: '',
        subjectId: '',
        subjectName: ''
      }
    }

    const basicInfoCookie = cookie.get(ACCOUNT_USER_BASIC_INFO_KEY)
    if (basicInfoCookie) {
      this.userBasicInfo = JSON.parse(basicInfoCookie)
    } else {
      this.userBasicInfo = {
        address: '',
        city: '',
        country: '',
        district: '',
        mobile: '',
        name: '',
        province: ''
      }
    }
  }

  /**
   * 获取本地用户名登录信息
   * @returns 用户登录信息
   */
  localUserSignInfo(): IResAccountSignInfo {
    return this.signInfo
  }

  /**
   * 获取本地用户基本信息
   * @returns 用户基本信息
   */
  localUserBasicInfo(): IResUserBasicInfo {
    return this.userBasicInfo
  }

  /**
   * 判断用户是否登录
   * @returns 用户是否登录
   */
  isLogin(): boolean {
    if (this.signInfo && this.signInfo.accessToken && this.signInfo.accessToken.length > 0) {
      const time = new Date().getTime()
      return this.signInfo.expiresTime > time
    }
    return false
  }

  /**
   * 用户注册
   * @param account 用户注册请信息
   * @returns 用户登录信息
   */
  async reginster(account: IReqAccountSignUp): Promise<Response<IResAccountSignInfo>> {
    const params: IReqAccountSignUp = Object.assign({}, account)
    params.password = md5(account.password)
    const request = new Request<IResAccountSignInfo>({
      url: '/cif/v1/AccountSignUpOrSignIn',
      params: params,
      isLoading: true,
      isMessage: true
    })
    const response: Response<IResAccountSignInfo> = await request.start()
    this.signInfo = response.body
    this.setSignInfoCookie()
    return response
  }

  /**
   * 用户登录
   * @param account 用户登录请求信息
   * @returns 用户登录信息
   */
  async login(account: IReqAccountSignIn): Promise<Response<IResAccountSignInfo>> {
    const params: IReqAccountSignIn = Object.assign({}, account)
    if (account.password) {
      params.password = md5(account.password)
    }
    const request = new Request<IResAccountSignInfo>({
      url: '/cif/v1/AccountSignIn',
      params: params,
      isLoading: true,
      isError: true
    })
    const response: Response<IResAccountSignInfo> = await request.start()
    this.signInfo = response.body
    this.setSignInfoCookie()
    return response
  }

  updateSignInfo(signInfo: IResAccountSignInfo) {
    this.signInfo = Object.assign(this.signInfo, signInfo)
    this.setSignInfoCookie()
  }

  setSignInfoCookie() {
    if (this.signInfo.expiresTime === undefined || this.signInfo.expiresTime === -1) {
      const time = new Date().getTime() + this.signInfo.expiresIn * 1000
      this.signInfo.expiresTime = time
    }
    const expires = new Date(this.signInfo.expiresTime)
    cookie.set(ACCOUNT_SIGNIN_INFO_KEY, JSON.stringify(this.signInfo), { expires: expires })
    cookie.set(ACCESS_TOKEN_KEY, this.signInfo.accessToken, { expires: expires })
    cookie.set(USER_ID_KEY, this.signInfo.userId, { expires: expires })
    if (this.signInfo.subjectId && this.signInfo.subjectId.length > 0) {
      cookie.set(ENTITY_ID_KEY, this.signInfo.subjectId.toString(), { expires: expires })
    }
  }

  /**
   * 登出
   * @param url 登出后跳转地址，不传执行回调方法或者默认跳登录
   * @param callback 回调函数，不传按照url跳转，默认跳转到登录
   */
  async logout(url?: string, callback?: NoArgsCallbackFunction) {
    // 登出 清除cookie
    cookie.remove(ACCOUNT_SIGNIN_INFO_KEY)
    cookie.remove(ACCOUNT_USER_BASIC_INFO_KEY)
    cookie.remove(ACCESS_TOKEN_KEY)
    cookie.remove(USER_ID_KEY)
    cookie.remove(ENTITY_ID_KEY)
    if (url) {
      window.location.href = url
    } else if (callback) {
      callback()
    } else {
      window.location.href = '//account.console.cdgwin.com/login?callback=' + window.location.href
    }
  }

  /**
   * 账号注销
   * @param accountId 用户id
   * @param pinCode 短信验证码
   * @param mobile 短信验证码
   * @returns 注销信息
   */
  async writOff(accountId: string, pinCode: string, mobile: string): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/AccountCancellationMaintenance',
      params: {
        accountId: accountId,
        pinCode: pinCode,
        mobile: mobile
      },
      isLoading: true,
      isMessage: true
    })
    const response: Response = await request.start()
    if (response.status.success) {
      // 清除cookie
      cookie.remove(ACCOUNT_SIGNIN_INFO_KEY)
      cookie.remove(ACCOUNT_USER_BASIC_INFO_KEY)
      cookie.remove(ACCESS_TOKEN_KEY)
      cookie.remove(USER_ID_KEY)
      cookie.remove(ENTITY_ID_KEY)
      window.location.href = '//account.console.cdgwin.com/login'
    }
    return response
  }

  /**
   * 发送短信验证码
   * @param phone 手机号
   * @param type 手机号验证类型，1.注册;2.登录;3.忘记密码 4.换绑手机
   * @returns 短信验证码验证信息
   */
  async sendPinCode(phone: string, type: number): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/AccountPinCodeApply',
      params: {
        phone: phone.trim(),
        type: type
      },
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  /**
   * 获取图形验证码
   * @returns 图形验证码验证信息
   */
  async getCaptchaCode(): Promise<Response<IResCaptchaCode>> {
    const request = new Request<IResCaptchaCode>({
      url: '/cif/v1/VerifyCodeGeneration'
    })
    return await request.start()
  }

  /**
   * 验证手机
   * @param mobile 手机号
   * @param pinCode 短信验证码
   * @returns 短信验证码Token
   */
  async verifyPhone(mobile: string, pinCode: string): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/AccountVerifySms',
      params: {
        mobile: mobile.trim(),
        pinCode: pinCode
      },
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  /**
   * 修改密码，重置密码
   * @param newPassword 新密码
   * @param pinCodeToken 手机验证短信Token
   * @returns
   */
  async changePassowrd(newPassword: string, pinCodeToken: string): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/AccountPassportReset',
      params: {
        newPassword: md5(newPassword),
        pinCodeToken: pinCodeToken
      },
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  /**
   * 修改手机号
   * @param mobile 新手机号
   * @param pinCode 短信验证码
   * @param pinCodeToken 旧手机号验证码Token
   * @param userId 用户Id
   * @returns
   */
  async changePhone(mobile: string, pinCode: string, pinCodeToken: string, userId: string): Promise<Response> {
    const request = new Request({
      url: '/cif/v1/AccountPhoneMaintenance',
      params: {
        mobile: mobile,
        pinCode: pinCode,
        pinCodeToken: pinCodeToken,
        userId: userId
      },
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  /**
   * 获取用户基本信息
   * @returns
   */
  async getUserBasicInfo(): Promise<Response<IResUserBasicInfo>> {
    // 获取用户基本信息
    const request = new Request<IResUserBasicInfo>({
      url: '/cif/v1/UserBasicInfoInquiry',
      params: {
        userId: this.signInfo.userId
      },
      isLoading: true,
      isMessage: true
    })
    const response: Response<IResUserBasicInfo> = await request.start()
    this.userBasicInfo = response.body
    if (this.signInfo.expiresTime && this.signInfo.expiresTime > 0) {
      const expires = new Date(this.signInfo.expiresTime)
      cookie.set(ACCOUNT_USER_BASIC_INFO_KEY, JSON.stringify(this.userBasicInfo), { expires: expires })
    } else {
      cookie.set(ACCOUNT_USER_BASIC_INFO_KEY, JSON.stringify(this.userBasicInfo))
    }
    return response
  }
}

export default new Passport()
