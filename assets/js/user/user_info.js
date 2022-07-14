$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '请输入1-6个字符';
            }
        }
    });

    // 初始化用户的基本信息
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化失败');
                } else {
                    console.log(res);
                    // 快速为表单赋值
                    form.val('formUserInfo', res.data);

                }
            }
        });
    }

    // 重置表单的数据
    $('#btnReset').click(function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 阻止默认行为之后,再重新初始化获得一下表单数据就好了
        initUserInfo();
    });

    // 修改用户信息
    // 监听表单的提交事件
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败');
                }
                layer.msg('更新数据成功');
                // 调用父页面的方法
                window.parent.getUserInfo();
            }
        });
    });
});