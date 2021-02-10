$(function () {
    // 点击了去登陆按钮隐藏注册界面
    $('#link_login').on('click', () => {
        $('.reg-box').hide()
        $('.login-box').show()
    })
    // 点击了去注册按钮隐藏登录界面     
    $('#link_reg').on('click', () => {
        $('.reg-box').show()
        $('.login-box').hide()
    });


    // 自定义表单的校验规则
    // 只要引入了layui的js文件就可以使用layui对象，就相当与jquery的$符号一样
    var form = layui.form
    var layer = layui.layer;
    // console.log(from)
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 密码框的表单验证
        password: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repassword: (value) => {
            // value是指当前表单的值
            var pswval = $('.reg-box [name=password]').val()
            if (pswval !== value) {
                return '两次输入的密码不一致，请重新输入'
            }
        }
    });

    // 给注册表单绑定submit事件
    $('#form-reg').on('submit', (e) => {
        e.preventDefault();
        $.post('api/reguser', { username: $('#form-reg [name="username"]').val(), password: $('#form-reg [name="password"]').val() }, (res) => {
            if (res.status !== 0) return layer.msg(res.message)
            layer.msg('注册成功，请登录！')
            $('#link_login').click()
        }
        )
    });

    // 给登录表单绑定submit事件
    $('#form-login').on('submit', (e) => {
        e.preventDefault()
        $.ajax({
            url: 'api/login',
            method: 'POST',
            data: $("#form-login").serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg('登录失败')
                layer.msg(res.message)
                // 将登录成功得到的token字符串保存到本地的localStorage中,，后续有权限接口都需要token来访问
                localStorage.setItem('token', res.token)
                // console.log(res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }

        })
    })
})