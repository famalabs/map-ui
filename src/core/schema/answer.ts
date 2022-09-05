export interface IAnswerable<T> {
  answer: T;

  getAnswer(): DBAnswer;

  setAnswer(answer: T);

  getScore(): number;
}

export interface TextScore {
  text: string;
  score: number;
}

export class DBAnswer {
  id: string;
  answer: any;
  score: any;
}
