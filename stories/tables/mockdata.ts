import moment from 'moment';
import { ALL_STATUS } from '../../src/components/tables';

const randomInt = (max: number, min = 0) => Math.round(Math.random() * (max - min) + min);

const randomString = (chars = 10) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + chars);

const randomBool = () => Math.random() >= 0.5;

export interface SimpleData {
  name: string;
  qty: number;
  available: boolean;
  prop: string;
}

export const generateSimpleData = (n = 1): SimpleData[] => {
  const v: SimpleData[] = [];

  for (let i = 0; i < n; i++) {
    const data: SimpleData = {
      name: randomString(),
      qty: randomInt(1000),
      available: randomBool(),
      prop: randomString(5),
    };
    v.push(data);
  }

  return v;
};

export interface ComplexData {
  name: string;
  qty: number;
  available: boolean;
  date: string | Date;
  status: string;
}

export const generateComplexData = (n = 1): ComplexData[] => {
  const v: ComplexData[] = [];

  for (let i = 0; i < n; i++) {
    const data: ComplexData = {
      name: randomString(),
      qty: Math.random() * 1000,
      available: randomBool(),
      date: 1
        ? moment().add(randomInt(1000), 'days').toDate()
        : moment().add(randomInt(1000), 'days').toISOString(),
      status: ALL_STATUS[i % 4],
    };
    v.push(data);
  }

  return v;
};
