const inflection = require('inflection');

module.exports = {
  prompt: async ({ prompter }) => {
    let { seedName } = await prompter.prompt({
      type: 'input',
      name: 'seedName',
      message: 'Enter seed name (seeds are run in alphabetical order):',
    });

    seedName = inflection.underscore(seedName.replace(/ /g, '_').replace(/[^\w]/g, ''));

    return {
      seedName,
    };
  },
};
