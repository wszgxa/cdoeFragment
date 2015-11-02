


## 防止注入广告，可以有下面的处理？
1. iframe display 干掉
2. 如果发现被弄到 iframe 里面就 reload 页面
3. html 后面加不完整注释
4. 重写 document.write 方法
5.window.onload = function() {document.removeChild(document..querySelectorAll('iframe'))):}