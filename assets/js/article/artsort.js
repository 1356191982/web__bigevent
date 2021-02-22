$(function () {
    var layer = layui.layer
    var form = layui.form
    // 调用文章分类列表的函数
    initSortList()

    // 获取文章分类的列表
    function initSortList() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                // console.log(res)
                var htmlstr = template('tep-table', res)
                $('tbody').html(htmlstr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddSort').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            // 添加弹出层的宽高设置，第一个是宽，第二个是高
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#btnAddList").html()
        });
    })

    $('body').on('submit', '.formAdd', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: 'my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章列表失败！')
                }
                initSortList()
                layer.msg('新增文章列表成功！')
                layer.close(indexAdd)
            }
        })
    })


    var indexEdit = null;

    // 为编辑按钮绑定点击事件
    $('tbody').on('click', '#btnEdit', function (e) {
        e.preventDefault()
        indexEdit = layer.open({
            type: 1,
            // 添加弹出层的宽高设置，第一个是宽，第二个是高
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#btnEditList").html()
        });

        var index = $(this).attr('data-Id')
        // console.log(index)
        $.ajax({
            method: 'GET',
            url: 'my/article/cates/' + index,
            success: (res) => {
                // console.log(res)
                form.val('formEdit', res.data)
            }
        })
    })
    // 通过代理的方式为更新分类表单绑定submit事件
    $('body').on('submit', '.formEdit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: 'my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新分类数据失败')
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initSortList()
            }

        })
    })

    // 通过代理的方式为删除按钮绑定事件
    $('tbody').on('click', '#delBtn', function () {
        var id = $(this).attr('data-Id')
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: 'my/article/deletecate/' + id,
                success: (res) => {
                    if (res.status !== 0) return layer.msg('删除分类失败！')
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initSortList()
                }
            })

        });
    })
})