# 微信小程序Observer模块
> 为了解决小程序在改变数据的时候，还要手动setData和自行考虑最小改动优化的开发体验问题，引申出的一个对小程序数据双向绑定的补充。

## 使用方式
在`attached`或者`onLoad`等生命周期执行如下函数:
```javascript
// 导入路径似你具体模块而定
import Observer from '../../../../lib/observer/index';

Observer.observeWxAppData(this);
```
    
然后，你就可以把setData愉快地扔掉，想改变数据，视图自动响应，直接干就是了啦（就像vue）!    
注意: 请确保你在所有业务代码执行前就调用`Observer.observeWxAppData`函数!
```javascript
this.fuck = 'Yes, fuck 小程序';
```

## 写在最后
是否也可以搞个computed计算属性？答案是，理论上没问题，只是...
