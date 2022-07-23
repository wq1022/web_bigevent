$(function () {
    initArtCateList();

    var layer = layui.layer;
    var form = layui.form;

    // 初始化表格的函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }

    var indexAdd = null;
    $('#btnAddCate').click(function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_addCates').html()
        });
    });

    // 因为弹出层是页面动态添加的，所以不能直接通过id监听submit事件,用到了事件代理
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加类别失败');
                }
                initArtCateList();
                layer.msg('添加类别成功');
                layer.close(indexAdd);
            }
        });
    });

    var indexEdit = null;
    $('tbody').on('click', '#btnEdit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_EditCates').html()
        });
        var id = $(this).attr('data-Id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败');
                }
                form.val('form_edit', res.data);
            }
        });
    });

    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新数据失败');
                }
                layer.msg('更新类别成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });


    $('tbody').on('click', '#btnDel', function () {
        var id = $(this).attr('data-Id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/+id',
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    layer.close(index);
                    initArtCateList();
                }
            });


        });
    });
});