export enum UserStatus {
  normal = 1,
  wxUser = 2,
  disable = 3,
  noVerification = 4,
}

export enum WeChatErrorCode {
  InvalidCode = 40029,
  MinuteQuotaLimit = 45011,
  CodeBlocked = 40226,
  SystemError = -1,
}

export enum Flag {
  Expired = 1,
  NotExpired = 2,
}

export enum Status {
  Normal = 1,
  Deleted = 2,
}
