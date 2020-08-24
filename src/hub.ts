import { HubConfig } from './interface';
import { defaultConfig } from './type';

export class MessageHub {
  private timeout: number = defaultConfig.timeout;
  private log: boolean = defaultConfig.log;

  constructor(option: HubConfig = defaultConfig) {
    const { timeout, log } = option;
    this.timeout = timeout;
    this.log = log;
  }
}