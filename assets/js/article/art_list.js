$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,   //默认的页码值
        pagesize: 2,  //默认每页显示的条数
        cate_id: '',  //分类id
        state: '' //文章的状态
    };

    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (data) {
        var time = new Date(data);
        var y = time.getFullYear();
        var m = padZero(time.getMonth() + 1);
        var d = padZero(time.getDate());

        var hh = padZero(time.getHours());
        var mm = padZero(time.getMinutes());
        var ss = padZero(time.getSeconds());

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
    };
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initTable();
    initCate();

    // 定义初始化页面文章列表的函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tmp-table', res)
                // console.log(htmlStr);
                $('tbody').html(htmlStr)
                // 调用分页的函数
                renderPage(res.total)

            }
        })
    }

    // 定义初始化文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败');
                }
                // 使用模板引擎将分类的信息渲染到页面上
                var htmlStr = template('tmp-cate', res);
                $('#cate_id').html(htmlStr);
                // 通知layui重新渲染一下表单区域的ui结构
                form.render();
            }
        });
    };

    $('#form-search').submit(function (e) {
        e.preventDefault();
        var cate_id = $('[name = cate_id]').val();
        var state = $('[name = state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页的容器
            count: total,  //总条目数
            limit: q.pagesize,  //每页显示的条目数
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发jump回调的原因有两种
            // 1.点击页码，触发jump回调
            // 2.调用renderPage方法的时候，会触发jump回调，会产生死循环
            jump: function (obj, first) {  //分页的回调函数
                // 把最新的页码值，赋值给q的这个对象
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 可以通过first的值判断jump回调是哪一种方式触发的
                // 如果first的值为1，是第二种方式触发的，如果值为undefined，是第一种方式触发的
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 通过代理监听删除按钮的点击事件
    $('tbody').on('click', '.btn-Del', function () {
        // 获取当前页的删除按钮的个数
        var len = $('.btn-Del').length;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    // 点击删除按钮的时候,判断当前页删除按钮的个数是否等于1,如果等于1,就让页码值减1,然后重新调用initTable()方法
                    if (len === 1) {
                        // 如果len的值等于1了,说明删完这条数据,这一页就没有数据了,页码值应该减1
                        // 页码值最小是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });

            layer.close(index);
        });


    });
});