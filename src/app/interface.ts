export interface IGetQuestions {
  trivia_categories: Icategories[];
}

export interface Icategories {
  id: number;
  name: string;
}

export interface Iquestions {
  category: null | number;
  type: null | string;
}

export interface Iquestion {
  response_code: number;
  results: Iresults[];
}

export interface Iresults {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
  opt?: Ioptions[];
  id?: number;
  show?: boolean;
  correct?: boolean | null;
}

export interface Ioptions {
  content: Icontent[];
}

export interface Icontent {
  text: string;
  selected?: boolean;
  id: number;
}
