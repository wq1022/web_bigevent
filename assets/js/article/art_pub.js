$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 初始化下拉菜单的列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败');
                }
                // 使用模板引擎渲染页面
                var htmlStr = template('tmp_cate', res);
                $('#se_cate').html(htmlStr);
                // 必须要调用form.render()方法，因为下拉菜单是动态创建的
                form.render();
            }
        });
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

    $('#btnChooseImage').click(function () {
        $('#coverFile').click();
    });

    $('#coverFile').change(function (e) {
        var file = e.target.files[0];
        if (file.length === 0) {
            return layer.msg('请选择图片');
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 文章的状态
    var art_state = '已发布';
    $('#saveArt2').click(function () {
        art_state = '草稿';
    });

    // 监听表单的提交事件
    $('#form-pub').submit(function (e) {
        e.preventDefault();
        // 基于form表单创建一个formData对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态存进formData
        fd.append('state', art_state);

        // 把裁剪完成的图片转化成文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将生成的文件对象添加到formData中
                fd.append('cover_img', blob);
                // 调用Ajax请求
                publishArticle(fd);
            })
    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交formData类型的数据，必须有以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg('发布文章成功');
                location.href = '../article/art_list.html';
            }
        });
    };
});