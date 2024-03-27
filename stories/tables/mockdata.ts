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

export interface DynamicData {
  id: string;
  supplier: string | object;
  code: string;
  name: string;
  description: string;
  status: 0 | 1;
}

export const generateDynamicData = (n = 1): DynamicData[] => {

  const v: DynamicData[] = [];

  for (let i = 0; i < n; i++) {
    const data: DynamicData = {
      id: randomString(),
      supplier: {
        id: randomInt(1000),
        name: 'TESTNAME',
        supplierCode: randomString(),
        supplierDescription: randomString(),
      },
      code: randomString(),
      name: randomString(),
      description: randomString(),
      status: i % 2 as 0 | 1,
    };
    v.push(data);
  }

  return v;
}

export const generateAsyncData = async (n = 1): Promise<DynamicData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateDynamicData(n));
    }, 300);
  });
}

export const generateAsyncCount = async (n: number): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(n);
    }, 300);
  });
}