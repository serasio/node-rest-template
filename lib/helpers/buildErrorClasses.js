// nameIt taken from https://stackoverflow.com/a/48813707
// eslint-disable-next-line max-classes-per-file
const nameIt = (name, cls) => ({ [name]: class extends cls {} }[name]);

function buildErrorClasses(errorCodesArray) {
  return errorCodesArray.reduce((acc, code) => {
    const codeSymbol = Symbol(code);

    acc[code] = nameIt(
      code,
      class extends Error {
        constructor(data = {}) {
          super(data.message || code);

          Object.keys(data).forEach((key) => {
            this[key] = data[key];
          });

          this.code = codeSymbol;
        }

        static get code() {
          return codeSymbol;
        }
      },
    );

    return acc;
  }, {});
}

module.exports = buildErrorClasses;
