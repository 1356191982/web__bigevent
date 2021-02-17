"use strict";

$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    psw: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 判断新旧密码是否一致
    samePsw: function samePsw(value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同！';
      }
    },
    // 判断两次输入的密码是否一致
    rePsw: function rePsw(value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码输入不一致！';
      }
    }
  });
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: 'my/updatepwd',
      data: $(this).serialize(),
      success: function success(res) {
        console.log(res);

        if (res.status !== 0) {
          return layui.layer.msg('更新密码失败！');
        }

        layui.layer.msg('更新密码成功！');
        $('.layui-form')[0].reset();
      }
    });
  }); // $('.layui-form').on('submit', function (e) {
  //     e.preventDefault()
  //     $.ajax({
  //         method: 'POST',
  //         url: 'my/updatepwd',
  //         data: $(this).serialize(),
  //         success: function (res) {
  //             // console.log('111')
  //             if (res.status !== 0) {
  //                 return layer.msg('更新密码失败！')
  //             }
  //             layer.msg('更新密码成功！')
  //             // 重置表单
  //             $('.layui-form')[0].reset()
  //         }
  //     })
  // })
});