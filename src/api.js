export const plusOne = (input) => new Promise((resolve) => {
  let wait = window.setTimeout(() => {
    window.clearTimeout(wait);
    resolve(input + 1);
  }, 300 + input)
});

export const plusTwo = (input) => new Promise((resolve) => {
  let wait = window.setTimeout(() => {
    window.clearTimeout(wait);
    resolve(input + 2);
  }, 600)
});

export const plusThree = (input) => new Promise((resolve) => {
  let wait = window.setTimeout(() => {
    window.clearTimeout(wait);
    resolve(input + 3);
  }, 900)
});