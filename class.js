/*----------------
js模拟创建类
来源：http://blog.csdn.net/bingqingsuimeng/article/details/44451481
------------------*/
var Class = (function() {
  var _mix = function(r, s) {
    for (var p in s) {
      if (s.hasOwnProperty(p)) {
        r[p] = s[p];
      }
    }
  };

  var _extend = function() {

    //开关 用来使生成原型时,不调用真正的构成流程init
    this.initPrototype = true;
    var prototype = new this();
    this.initPrototype = false;

    var items = arguments.slice() || [];
    var item;

    //支持混入多个属性，并且支持{}也支持 Function
    while (item = items.shift()) {
      _mix(prototype, item.prototype || item);
    }


    // 这边是返回的类，其实就是我们返回的子类
    function SubClass() {
      if (!SubClass.initPrototype && this.init)
        this.init.apply(this, arguments);//调用init真正的构造函数
    }

    // 赋值原型链，完成继承
    SubClass.prototype = prototype;

    // 改变constructor引用
    SubClass.prototype.constructor = SubClass;

    // 为子类也添加extend方法
    SubClass.extend = _extend;

    return SubClass;
  };
  //超级父类
  var Class = function() {};
  //为超级父类添加extend方法
  Class.extend = _extend;
  return Class;
})();

// 模拟类使用
//继承超级父类，生成个子类Animal，并且混入一些方法。这些方法会到Animal的原型上。
//另外这边不仅支持混入{}，还支持混入Function
var Animal = Class.extend({
  init:function(opts){
    this.msg = opts.msg
    this.type = "animal"
  },
  say:function(){
    alert(this.msg+":i am a "+this.type)
  }
})


//继承Animal，并且混入一些方法
var Dog = Animal.extend({
  init:function(opts){
    //并未实现super方法，直接简单使用父类原型调用即可
    Animal.prototype.init.call(this,opts)
    //修改了type类型
    this.type = "dog"
  }
})

//new Animal({msg:'hello'}).say()

new Dog({msg:'hi'}).say()