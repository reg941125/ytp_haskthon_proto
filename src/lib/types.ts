export type RoleId =
  | "software_engineer"
  | "data_analyst"
  | "product_manager"
  | "uiux_designer"
  | "digital_marketer"
  | "sales"
  | "hr"
  | "accountant"
  | "customer_success"
  | "cybersecurity_analyst";

export type RoleTag =
  | "engineering"
  | "data"
  | "product"
  | "design"
  | "marketing"
  | "sales"
  | "people"
  | "finance"
  | "security";

export type CareerRole = {
  id: RoleId;
  title: string;
  tagline: string;
  imageSrc: string;
  skills: string[];
  dayToDay: string[];
  tags: RoleTag[];
};

export type ExploreResults = {
  likedRoleIds: RoleId[];
  dislikedRoleIds: RoleId[];
  exploreCompletedAt?: string;
};

export type DailyAnswerValue = string;

export type DailyQuestion = {
  id: string;
  text: string;
  answer: string;
  roleTags: RoleTag[];
  options: DailyAnswerValue[];
};

export type DailyAnswersByDate = Record<
  string,
  { questionId: string; answer: DailyAnswerValue }
>;

export type AppStorage = {
  explore: ExploreResults;
  dailyAnswers: DailyAnswersByDate;
  planTodos: Record<string, boolean>;
  planWeekNotes: Record<string, string>;
  strike: {
    current: number;
    lastAnsweredDate?: string;
  };
};

