$(function () {
    var layer = layui.layer
    var form = layui.form

    // 调用文章分类列表数据函数
    initSort()

    // 初始化富文本编辑器
    initEditor()


    // 定义文章分类列表数据函数
    function initSort() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('初始化文章分类列表失败')
                // 调用模板引擎函数
                var htmlstr = template('tep-sort', res)
                // 渲染到页面上
                $('[name="cate_id"]').html(htmlstr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面按钮绑定点击事件
    $('#coverBtn').on('click', function () {
        $('#file').click()
    })

    // 为选择封面绑定change改变事件
    $('#file').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        if (file.length === 0) return layer.msg('请选择文件后再上传！')
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)

        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    var state = '已发布';

    // 为存为草稿绑定点击事件来改变文章的发布状态
    $('#draftBtn').on('click', function () {
        state = '草稿'
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault()
        // 2.基于form表单快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        // 3.将文章的发布状态添加到fd中
        fd.append('state', state)

        // k是属性名   val是属性值
        // fd.forEach(function (val, k) {
        //     console.log(k, val)
        // });


        // 4.将裁减的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 5.发起ajax数据请求
                PubliCations(fd)
            })

    })


    // 定义发表文章的函数
    function PubliCations(fd) {
        $.ajax({
            method: 'POST',
            url: 'my/article/add',
            data: fd,
            // 如果向服务器提交的是FormData格式的数据，必须要添加以下两个配置项
            //   不修改Content-Type属性，使用FormData默认的content-Type值
            contentType: false,
            // 不对FormData中的数据进行url编码，而是将FormData数据原样发送到服务器
            processData: false,
            success: function (res) {
                if (res.status !== 0) return layer.msg('发表文章失败！')
                layer.msg('发表文章成功!')
                location.href = '../../../article/artList.html'
            }
        })
    }

})