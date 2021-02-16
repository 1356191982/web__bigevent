$(function () {
    // 调用获取信息的函数
    getUserInfo()
    var layer = layui.layer
    $('.btnGoOut').on('click', () => {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地存储中的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'
            // 关闭comfirm弹出层
            layer.close(index)
        });

    })
})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res)
            console.log(res.data)  //用户数据
            if (res.status) return layui.layer.msg('获取用户信息失败')
            // 调用渲染头像的函数，将用户的数据传入
            xuanRanAvatar(res.data)
        },
        // 如果成功会执行success回调函数，如果失败会执行error回调函数，但是无论成功还是失败，最终都会执行comple回调函数
        // 可以将complete函数写到baseAPI.js文件中，以减少代码量
        // complete: (res) => {
        //     // console.log(res)
        //     // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     // console.log(res.responseJSON)
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 清空本地储存的token
        //         localStorage.removeItem('token')
        //         // 强制跳转回登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 定义渲染头像的函数
function xuanRanAvatar(data) {
    // 获取用户的昵称或用户名
    var name = data.nickname || data.username
    // 根据用户名来渲染欢迎文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 渲染用户头像
    if (data.user_pic !== null) {
        $('.layui-nav-img').attr('src', data.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}