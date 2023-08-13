function status(data: any = null, message = 'Success', statusCode = 200) {
  return {
    status: statusCode,
    data,
    message,
  };
}

export const success = function (data: any = null, message = '操作成功') {
  return status(data, message, 200);
};

export const RES404 = function (data: any = null) {
  return status(data, '无法查找到数据', 404);
};

export const RES401 = function (data: any = null) {
  return status(data, '没有权限获取资源', 401);
};

export const RES500 = function (data: any = null) {
  return status(data, '服务器错误', 500);
};

export const error = function (
  statusCode = 500,
  message = '服务器错误',
  data: any = null,
) {
  return status(data, message, statusCode);
};
