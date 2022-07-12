$(function () {
    // 当点击去登录链接
    $('#link_login').click(function () {
        $('.regist_box').hide();
        $('.login_box').show();
    });

    // 当点击去注册链接
    $('#link_reg').click(function () {
        $('.regist_box').show();
        $('.login_box').hide();
    });

    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $('.regist_box [name=password]').val();
            if (pwd !== value) {
                return '两次不一致';
            }
        }

    });


    // 监听注册表单的提交事件
    $('#form-reg').submit(function (e) {
        e.preventDefault();
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        };
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功');
            $('#link_login').click();
        });
    });

    // 监听登录表单的提交事件
    $('#form-login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获得表单的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                } else {
                    // 将登录成功得到的token字符串，保存到localStorage中
                    localStorage.setItem('token', res.token);
                    location.href = './index.html';
                }
            }
        });
    });
});

