/**
 * Copyright 2022 The KubeDiag Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
