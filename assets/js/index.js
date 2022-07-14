$(function () {
    getInfoMessage();
    // 实现退出按钮的功能
    var layer = layui.layer;
    $('#btnLogout').click(function () {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            // 删除localStorage里的token
            localStorage.removeItem('token');
            // 跳转到登录注册页面
            location.href = './login.html';
            layer.close(index);

        });
    });
});
// 获取用户信息的函数
function getInfoMessage() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 设置请求头配置对象 写到baseAPI了
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！');
            } else {
                // 渲染用户头像

                renderAvater(res.data);

            }
        },
        // 不论成功还是失败,都会调用complete函数
        // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
        // complete: function (res) {
        //     if (res.responseJSON.status !== 0 && res.responseJSON.message == '身份认证失败') { } {
        //         // 强制删除token
        //         localStorage.removeItem('token');
        //         // 强制返回login.html
        //         location.href = './login.html';
        //     }
        // }
    });
}

function renderAvater(user) {
    // 获取用户名
    var uname = user.nickname || user.username;
    $('#welcome').html('欢迎' + uname);
    // 判断用户是否有头像
    if (user.user_pic) {
        // 渲染用户的头像
        $('.layui-nav-img').attr('url', user.user_pic).show();
        $('.user-avater').hide();
    } else {
        // 渲染默认的头像
        var first = uname[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.user-avater').html(first).show();
    }
};