export const setUpdateSettings = function (next) {
  this.options.new = true;

  next();
};
