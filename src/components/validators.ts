function isRequired(val: string) {
  return !!val || 'Field is required';
}

function minLength(min: number) {
  return (val: string) => {
    return val.length < min
      ? `This field must be at least ${min} characters long`
      : null;
  };
}

function maxLength(max: number) {
  return (val: string) => {
    return val.length > max
      ? `This field must be at most ${max} characters long`
      : null;
  };
}

function isValidEmail(val: string) {
  const emailPattern =
    /^(?=[a-zA-Z\d@._%+-]{6,254}$)[a-zA-Z\d._%+-]{1,64}@(?:[a-zA-Z\d-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || 'Invalid email';
}

function isValidURL(val: string) {
  // todo better validation regex?
  const urlPattern =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return urlPattern.test(val) || 'Invalid URL';
}

export { isRequired, minLength, maxLength, isValidEmail, isValidURL };
