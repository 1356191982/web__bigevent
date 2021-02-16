"use strict";

$(function () {
  // 调用获取信息的函数
  getUserInfo();
}); // 获取用户的基本信息

function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: 'my/userinfo',
    headers: {
      Authorization: localStorage.getItem('token') || ''
    },
    success: function success(res) {
      console.log(res);
    }
  });
}