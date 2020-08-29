import {
  HubConfig, Task, TaskItemStatus, Event,
} from './types/interface';
import { defaultConfig } from './types/type';

export class MessageHub {
  private timeout: number = defaultConfig.timeout;

  private watchTimeEnd: boolean = false;

  private needLog: boolean = defaultConfig.log;

  private logTemp: string = '【MessageHub】';

  private tasks: Array<Task> = [];

  private completed: boolean = false;

  private watcher: any = null;

  private event: Event = { end: () => {} };

  constructor(tasks: Array<Task>, { timeout = 0, log = false }: HubConfig = defaultConfig) {
    this.timeout = timeout;
    this.needLog = log;

    if (Array.isArray(tasks) && tasks.length) {
      this.init(tasks);
    } else {
      throw new Error(`${this.logTemp} #init# 任务队列不能为空`);
    }
  }

  private init(tasks: Array<Task>): void {
    const validTasks = this.getValidTask(tasks);
    if (validTasks.length) {
      this.tasks = validTasks.map((task) => ({
        ...task,
        status: TaskItemStatus.Pending,
      }));
      // 创建超时检测
      if (this.timeout && typeof this.timeout === 'number') {
        this.watchTimeout();
      }
    }
  }

  public exec(name: string, callback: Function): void {
    // 队列有声明过这个任务
    if (this.exist(name)) {
      // 队列未完成
      if (!this.completed) {
        const task = this.tasks.find((t) => t.name === name);
        if (task) {
          // 注册任务回调
          task.callback = callback;
          this.dispatch(task, TaskItemStatus.Resolved);

          const theone = this.getExecutable();
          if (theone) {
            this.excuteTheone(theone);
          }
        }
      } else {
        this.log(`#exec# 队列已结束 无法继续添加任务${name}`);
      }
    } else {
      this.log(`#exec# 不存在的任务 ${name}`);
    }
  }

  /**
   * 注册回调事件
   * @param target 事件名称
   * @param callback 回调方法
   */
  public on(target: string, callback: Function): void {
    if (typeof callback === 'function') {
      this.event[target] = callback;
    }
  }

  /**
   * 获取格式正确的task
   * @param tasks
   */
  private getValidTask(tasks: Array<Task>): Array<Task> {
    const validKey: Map<string, string> = new Map();
    const validTasks: Array<Task> = [];
    for (let i = 0; i < tasks.length; i += 1) {
      const task = tasks[i];
      const { name, priority } = task;
      if (!name || !priority) {
        this.log('#init# 非法task (task对象必须具有name和priority属性)');
        continue;
      }
      if (validKey.has(name)) {
        this.log(`#init# 重复的task、 name: ${name}`);
        continue;
      }
      validKey.set(name, name);
      validTasks.push(task);
    }
    if (!validTasks.length) {
      throw new Error(`${this.logTemp} #init# 任务队列注册失败`);
    }
    this.log(`#init# 完成注册的任务 [${validTasks.map((e) => e.name)}]`);
    return validTasks;
  }

  private exist(name: string): boolean {
    const task = this.tasks.find((t) => t.name === name);
    return Boolean(task);
  }

  private dispatch(task: Task, status: TaskItemStatus): boolean {
    this.log(`#dispatch# ${task.name} 的状态由 ${task.status} 改为 ${status}`);
    task.status = status;
    return true;
  }

  private getExecutable(): any {
    // 有超时
    if (this.timeout && this.watchTimeEnd) {
      const executeable = this.tasks.filter((t) => TaskItemStatus.Resolved === t.status);
      const sort = executeable.sort((a, b) => b.priority - a.priority);
      const [theone] = sort;
      return theone;
    }
    const sort = this.tasks.sort((a, b) => b.priority - a.priority);
    const [theone] = sort;
    if (theone && theone.status === TaskItemStatus.Resolved) {
      return theone;
    }
    return undefined;
  }

  public cancelTask(name: string): boolean {
    let flag = false;
    if (!this.completed && this.exist(name)) {
      const task = this.tasks.find((t) => t.name === name);
      if (task) {
        flag = this.dispatch(task, TaskItemStatus.Canceled);
      }
    }
    if (!flag) {
      this.log(`#cancelTask# 队列已结束或${name}不存在队列中， ${name}取消失败`);
    }
    return flag;
  }

  private excuteTheone(theone: Task): void {
    if (theone.callback && typeof theone.callback === 'function') {
      theone.callback();
      this.completed = true;
      if (this.watcher) {
        clearTimeout(this.watcher);
      }
      this.handleEvent('end', theone);
      this.log(`#excuteTheone# 队列结束，执行了方法${theone.name}`);
    }
  }

  private watchTimeout(): void {
    this.watcher = setTimeout(() => {
      this.watchTimeEnd = true;
      this.log(`#watchTimeout# 监听队列到达超时时间 ${this.timeout}ms`);
      if (!this.completed) {
        const theone = this.getExecutable();
        if (theone) {
          this.excuteTheone(theone);
        } else {
          this.log('#watchTimeout# 超时监听结束，没有可执行的任务');
        }
        // 标记任务结束
        this.completed = true;
      }
    }, this.timeout);
    this.log(`#watchTimeout# 创建进行超时监听队列 时长${this.timeout}`);
  }

  private handleEvent(target: string, task?: Task): void {
    const callback = this.event[target];
    if (callback && typeof callback) {
      if (target === 'end') {
        callback(task && task.name);
      }
    }
  }

  private log(str: string): void {
    if (this.needLog) {
      console.info(`${this.logTemp} ${str}`);
    }
  }
}
