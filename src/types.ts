export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

export enum InputType {
  Text = "text",
  Password = "password",
}
