$(function () {
    let form = layui.form
    let layer = layui.layer
    // 进行表单验证
    form.verify({
        nickname: (value) => {
            if (value.length > 6) {
                return '昵称的长度必须在1~6个字符之间！'
            }
        }
    })
    InitUserinfo()
    // 初始化用户的基本信息
    function InitUserinfo() {
        $.ajax({
            method: 'GET',
            url: 'my/userinfo',
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res)
                // layui的表单取值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 给重置按钮绑定点击事件
    $('#resetBtn').on('click', function (e) {
        // 阻止重置按钮的默认重置行为
        e.preventDefault()
        // 再次调用初始化用户基本信息的函数
        InitUserinfo()
    })

    $('.layui-form').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: 'my/userinfo',
            // 快速获取表单里面的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新用户信息失败！')
                layer.msg('更新用户信息成功！')
                // 更改信息成功后应该将用的信息和头像重新进行渲染需要调用父页面的函数
                window.parent.getUserInfo()
            }
        })
    })
})