// 使用jquery调用$.get()或者是$.post()或者是$.ajax()的时候，都会先调用ajaxPrefilter这个函数，在这个函数中，我们可以拿到ajax给我们提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax之前，统一的拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net/' + options.url
    // console.log(options.url)
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete = (res) => {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空本地储存的token
            localStorage.removeItem('token')
            // 强制跳转回登录页面
            location.href = '/login.html'
        }
    }
})