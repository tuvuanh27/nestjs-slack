export * from './constants';
export * from './slack.module';
export * from './slack.service';

export type StringChannel = string;
export type ObjectChannel = {
  name: string;
  url: string;
};
