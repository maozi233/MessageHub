import { HubConfig, Task } from './interface';
import { defaultConfig } from './type';

export class MessageHub {
  private timeout: number = defaultConfig.timeout;
  private log: boolean = defaultConfig.log;
  private logTemp: string = '【MessageHub】:';

  constructor(tasks: Array<Task>, {timeout = 0, log = false}: HubConfig = defaultConfig) {
    this.timeout = timeout;
    this.log = log;

    if (Array.isArray(tasks) && tasks.length) {
      this.init(tasks);
    } else {
      throw new Error(`${this.logTemp} 任务队列不能为空`);
    }
  }

  private init(tasks: Array<Task>): void {
    const validTasks = this.getValidTask(tasks);
  }

  private getValidTask(tasks: Array<Task>): Array<Task> {
    const validKey: Map<string, string> = new Map();
    const validTasks: Array<Task> = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const { name, priority } = task;
      if (name && priority) {
        if (!validKey.has(name)) {
          validKey.set(name, name);
          validTasks.push(task);
        } else {
          this.console(`已有的task name: ${name}`)
        }
      } else {
        this.console('非法task (task对象必须具有name和priority属性)')
      }
    }
    if (validTasks.length) {
      this.console(`已添加任务 [${validTasks.map(e => e.name)}]`)
      return validTasks;
    }
    throw new Error(`${this.logTemp} 任务队列注册失败`);
  }

  private console(str: string): void {
    if (this.log) {
      console.info(`${this.logTemp} ${str}`)
    }
  }
}