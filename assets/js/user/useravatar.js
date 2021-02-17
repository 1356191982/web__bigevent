$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        // 1就想当于是1/1，还有4/3相当于是长方形
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    $('#upLoadBtn').on('click', function () {
        $('#file').click()
    })

    $('#file').on('change', function (e) {
        // console.log(e)
        // console.log(e.target.files)
        var filesList = e.target.files
        if (filesList.length === 0) {
            return layer.msg('请选择文件！')
        }
        // 1.拿到用户选择文件
        var file = e.target.files[0]
        // 2.根据选择的文件，创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file)
        // 3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    $('#confirmBtn').on('click', function () {

        // 1.将裁剪后的图片，输出为 base64 格式的字符串，优点就是减少一些不必要的图片请求，缺点是体积过大（比源文件大30%左右）
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2.调用接口上传到服务器
        $.ajax({
            method: 'POST',
            url: 'my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo();
            }

        })
    })
})