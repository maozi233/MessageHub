# MessageHub
任务优先级控制器、用来解决页面中多个弹窗请求，但只执行优先级最高的解决方案

## 使用方式
```javascript
// 1. 配置队列中的任务
const dialog = {
  USER_MESSAGE: '用户干扰弹窗',
  MARKET_MESSAGE: '营销弹窗',
};
const tasks = [
  {name: dialog.USER_MESSAGE, priority: 2000}, // priority越大优先级越高
  {name: dialog.MARKET_MESSAGE, priority: 1000},
];

// 2.注册队列
const hub = new MessageHub(tasks, {
  log: true, // 是否需要调试信息
  timeout: 600, // 是否超时后自动执行（exec标记为可执行后的任务）
});


// 3.标记待执行
hub.exec(dialog.MARKET_MESSAGE, () => {
  this.marketDialogVisible = true;
})
// 这个不会执行，已经超过了600ms
setTimeout(() => {
  hub.exec(dialog.USER_MESSAGE, () => {
    this.userDialogVisible = true;
  })
}, 700);
```

## 方法
```javascript
/**
 * @params name
 * @return boolean
 * 任务队列结束前可以把某个任务状态置为待执行
 */
public exec(name: string, callback: Function): void {

/**
 * @params name
 * @return boolean
 * 任务队列结束前可以把某个任务状态置为取消
 */
cancelTask(name: string): boolean {}

/**
 * 注册回调事件
 * @param target 事件名称 //暂时只支持end
 * @param callback 回调方法
 */
on(target: string, callback: Function): void {
}


```