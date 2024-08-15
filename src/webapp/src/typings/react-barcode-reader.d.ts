declare module 'react-barcode-reader';
declare type Dictionary<T> = { [key: string]: T };

interface ErrorModel {
  code: number;
  message: string;
  exceptionContent?: string;
  errors?: Errors[];
}
