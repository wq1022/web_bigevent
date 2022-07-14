$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 原密码和新密码不能相同
        samepwd: function (value) {
            var oldpwd = $('#oldpwd').val();
            if (value === oldpwd)
                return '新旧密码不能相同';
        },
        repwd: function (value) {
            var newpwd = $('#newpwd').val();
            if (value !== newpwd)
                return '两次密码不一致';
        }
    });

    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);

                // if (res.status !== 0) {
                //     // return layer.msg('密码重置失败');
                // }
                // layer.msg('密码重置成功,请重新登录');
                // location.href = '/login.html';
            }
        });
    });

});

