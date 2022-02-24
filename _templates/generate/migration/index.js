const inflection = require('inflection');
const moment = require('moment');

module.exports = {
  prompt: async ({ prompter }) => {
    let { migrationName } = await prompter.prompt({
      type: 'input',
      name: 'migrationName',
      message: 'Enter migration name:',
    });

    migrationName = inflection.underscore(migrationName.replace(/ /g, '_').replace(/[^\w]/g, ''));

    return {
      fileName: `${moment().format('YYYYMMDDHHmmss')}_${migrationName}`,
    };
  },
};
