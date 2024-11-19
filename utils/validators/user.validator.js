function isEmpty(value) {
  return !value || value.trim() == "";
}

function userCredentialsAreValid(email, password) {
  return email?.includes("@") && password?.trim().length > 4;
}

exports.userDetailsAreValid = (email, password, confirmPassword, name) => {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(password) &&
    !isEmpty(confirmPassword)
  );
};

exports.passwordIsConfirmed = (password, confirmPassword) => {
  return password === confirmPassword;
};
