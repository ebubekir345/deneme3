export default function isErrorMatches(error: any, errorCode: string, property: string) {
  let isMatches = false;
  error?.errors &&
    error?.errors.forEach(err => {
      if (err.errorCode === errorCode && err.property === property) {
        isMatches = true;
      }
    });
  return isMatches;
}
