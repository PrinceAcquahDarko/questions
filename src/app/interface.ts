export interface IGetQuestions {
  trivia_categories: Icategories[];
}

export interface Icategories {
  id: number;
  name: string;
}

export interface Iquestions {
  category: null | number;
  type: null | number;
}

export interface question {
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
}
