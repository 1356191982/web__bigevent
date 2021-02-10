// 使用jquery调用$.get()或者是$.post()或者是$.ajax()的时候，都会先调用ajaxPrefilter这个函数，在这个函数中，我们可以拿到ajax给我们提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax之前，统一的拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net/' + options.url
    console.log(options.url)
})