import { TaskItemStatus } from './const';

export interface HubConfig {
  timeout: number;
  log: boolean;
}

export interface Task {
  name: string;
  priority: number;
  status?: TaskItemStatus;
}