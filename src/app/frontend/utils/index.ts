import * as yaml from 'js-yaml';

export const getTimeAge = (startTime: string): string => {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  let time = (now - start) / 1000;
  if (time < 0) return '0m';
  if (time / 60 < 120) {
    return Math.floor(time / 60) + 'm';
  } else if (time / (60 * 60) < 48) {
    return Math.floor(time / (60 * 60)) + 'h';
  } else {
    return Math.floor(time / (60 * 60 * 24)) + 'd';
  }
};

export const yamlToJson = async (str: string): Promise<object> => {
  const data: any = await yaml.load(str);
  return data;
};

export const jsonToYaml = async (obj: any): Promise<string> => {
  const data: any = await yaml.dump(obj);
  return data;
};
