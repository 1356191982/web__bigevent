$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义时间过滤器
    template.defaults.imports.filterTime = function (date) {
        const dates = new Date(date)
        var year = dates.getFullYear()
        var month = zeroFill(dates.getMonth() + 1)
        var day = zeroFill(dates.getDate())
        var hours = zeroFill(dates.getHours())
        var minutes = zeroFill(dates.getMinutes())
        var seconds = zeroFill(dates.getSeconds())
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
    // 定义时间的补零函数
    function zeroFill(n) {
        return n < 10 ? '0' + n : n
    }

    //   定义查询参数对象，在请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,     //页码值，默认为第一页
        pagesize: 2,   //每页显示多少条数据,默认为2条
        cate_id: '', //文章分类的 Id
        state: ''   //文章的状态
    }
    initTable()
    initSort()
    // 定义初始化文章列表的函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: 'my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败！')
                layer.msg('获取文章列表成功！')
                // console.log(res)
                var htmlstr = template('tep-table', res)
                $('tbody').html(htmlstr)
                vrayPaging(res.total)
            }
        })
    }

    // 定义文章分类的方法
    function initSort() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) return layer.msg('获取分类数据失败')
                var htmlstr = template('tep-sort', res)
                // console.log(htmlstr)
                $('[name="cate_id"]').html(htmlstr)
                form.render()
            }
        })
    }



    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单的数据
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 将获得的表单数据赋值给查询参数对象
        console.log(cate_id)
        console.log(state)
        q.cate_id = cate_id
        q.state = state
        // 将最新的渲染条件重新渲染表格的数据
        initTable()
    })


    // 定义渲染分页的方法
    function vrayPaging(total) {
        // console.log(total)
        laypage.render({
            elem: 'pagingBox',   //指存放容器的分页id
            count: total,        //数据总数
            limit: q.pagesize,   //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            curr: q.pagenum,    //页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 10,],
            // 触发jump回调的方式有两种
            // 1.点击页码的时候，会触发jump回调函数
            // 2.只要调用了 laypage.render()方法，就会触发2jump回调函数
            jump: function (obj, first) {       //切换分页的回调
                // console.log(first)

                // 如果first值为true则是通过第二种方式触发的
                // 如果first的值为undefined则是通过第一种方式来触发的
                // first（是否首次，一般用于初始加载的判断）
                // console.log(obj.curr)
                // console.log(obj.limit)
                // 将最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 如果直接调用初始化文章列表的函数会进入死循环
                if (!first) {
                    initTable()
                }
            }
        })

    }
    // 为删除按钮绑定点击事件，通过事件委托的方式
    $('tbody').on('click', '.del-btn', function () {
        var len = $('.del-btn').length
        // console.log(len)
        // 获取到文章的id
        var id = $(this).attr('data-id')
        // console.log(id)
        // 点击了删除按钮后，弹出提示框进行询问
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: 'my/article/delete/' + id,
                success: (res) => {
                    if (res.status !== 0) return layer.msg('删除文章失败！')
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有数据了，就让当前页码值进行-1操作
                    // 再重新调用initTable方法
                    if (len === 1) {
                        // 判断当前的页面是否还有数据，当页面上只有一条数据时，再次点击删除按钮代表当前页面已经没有数据了，要将页面值-1，但是有一个前提条件，页码值最小要为1，所以要判断一下是否为第一页，如果为第一页则不改变页面值，如果不为第一页，则将页码值-1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });

    })
})