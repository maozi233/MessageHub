export interface HubConfig {
  timeout: number;
  log: boolean;
}

export enum TaskItemStatus {
  /** 请求中 */
  Pending = '请求中',
  /** 请求完毕待执行 */
  Resolved = '请求完毕待执行',
  /** 请求失败 */
  Rejected = '请求失败',
  /** 已取消 */
  Canceled = '已取消',
  /** 已执行 */
  Done = '已执行',
}

export interface Task {
  name: string;
  priority: number;
  status?: TaskItemStatus;
  callback?: Function;
}
