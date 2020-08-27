export enum TaskItemStatus {
  Pending = 1, // 请求中
  Resolved = 1 << 1, // 请求完毕待执行
  Rejected = 1 << 2, // 请求失败
  Canceled = 1 << 3, // 已取消
  Done = 1 << 4, // 已执行
}
