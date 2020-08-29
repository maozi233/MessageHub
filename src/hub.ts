import { HubConfig, Task, TaskItemStatus } from './types/interface';
import { defaultConfig } from './types/type';

export class MessageHub {
  private timeout: number = defaultConfig.timeout;

  private needLog: boolean = defaultConfig.log;

  private logTemp: string = '【MessageHub】';

  private tasks: Array<Task> = [];

  private completed: boolean = false;

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

  private dispatch(task: Task, status: TaskItemStatus): void {
    this.log(`#dispatch# ${task.name} 的状态由 ${task.status} 改为 ${status}`);
    task.status = status;
  }

  private getExecutable(): any {
    // 有超时
    if (this.timeout) {
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

  private excuteTheone(theone: Task) {
    if (theone.callback && typeof theone.callback === 'function') {
      theone.callback();
      this.completed = true;
      this.log(`#excuteTheone# 队列结束，执行了方法${theone.name}`);
    }
  }

  private log(str: string): void {
    if (this.needLog) {
      console.info(`${this.logTemp} ${str}`);
    }
  }
}
