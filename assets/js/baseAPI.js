// 在调用$.get(),$.post(),$.ajax()之前
// 会先调用ajaxPrefilter()这个函数
// 会先获得所有的Ajax的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url;
});