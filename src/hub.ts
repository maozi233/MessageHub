import { HubConfig, Task } from './types/interface';
import { defaultConfig } from './types/type';

export class MessageHub {
  private timeout: number = defaultConfig.timeout;
  private needLog: boolean = defaultConfig.log;
  private logTemp: string = '【MessageHub】:';
  private tasks: Array<Task> = [];

  constructor(tasks: Array<Task>, {timeout = 0, log = false}: HubConfig = defaultConfig) {
    this.timeout = timeout;
    this.needLog = log;

    if (Array.isArray(tasks) && tasks.length) {
      this.init(tasks);
    } else {
      throw new Error(`${this.logTemp} 任务队列不能为空`);
    }
  }

  private init(tasks: Array<Task>): void {
    const validTasks = this.getValidTask(tasks);
    if (validTasks.length) {
      this.tasks = validTasks;
    }
  }

  private getValidTask(tasks: Array<Task>): Array<Task> {
    const validKey: Map<string, string> = new Map();
    const validTasks: Array<Task> = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const { name, priority } = task;
      if (!name || !priority) {
        this.log('非法task (task对象必须具有name和priority属性)');
        continue;
      }
      if (validKey.has(name)) {
        this.log(`已有的task、 name: ${name}`)
        continue;
      }
      validKey.set(name, name);
      validTasks.push(task);
    }
    if (!validTasks.length) {
      throw new Error(`${this.logTemp} 任务队列注册失败`);
    }
    this.log(`已添加任务 [${validTasks.map(e => e.name)}]`);
    return validTasks;
  }

  private log(str: string, method: string = 'info'): void {
    if (this.needLog) {
      console.info(`${this.logTemp} ${str}`)
    }
  }
}