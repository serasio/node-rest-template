const { ValidationError, CategoryNotFound } = require('../../../src/errors');
const thingsService = require('../../../src/lib/things.sample/things.service');
const { knexConnection } = require('../../knexTestHelper');

describe('things/service', () => {
  let category;

  beforeEach(async () => {
    [category] = await knexConnection('categories')
      .insert({ name: 'a Category' })
      .returning('*');
  });

  describe('all', () => {
    def('thingIds', () => undefined);

    subject(() => thingsService.all({ pageConfig: get('pageConfig'), ids: get('thingIds') }));

    beforeEach(async () => {
      const thingsToInsert = [
        { category_id: category.id, name: 'a Name 1', active: true },
        { category_id: category.id, name: 'Inacti 1', active: false },
        { category_id: category.id, name: 'a Name 2', active: true },
        { category_id: category.id, name: 'Inacti 2', active: false },
        { category_id: category.id, name: 'a Name 3', active: true },
        { category_id: category.id, name: 'a Name 4', active: true },
        { category_id: category.id, name: 'a Name 5', active: true },
      ];
      await knexConnection('things').insert(thingsToInsert);
    });

    describe('when not passed a page config', () => {
      def('pageConfig', () => undefined);

      it('throws TypeError', () => {
        expect(() => subject()).toThrow("Cannot read property 'page' of undefined");
      });
    });

    describe('when passed a page config', () => {
      describe('when getting all the things', () => {
        def('pageConfig', () => ({ page: 0, pageSize: 10 }));

        it('returns the list of things (ignoring inactive) and the total things count', async () => {
          const things = await subject();
          expect(things).toMatchObject({
            results: [
              { name: 'a Name 1', category: { name: 'a Category' } },
              { name: 'a Name 2', category: { name: 'a Category' } },
              { name: 'a Name 3', category: { name: 'a Category' } },
              { name: 'a Name 4', category: { name: 'a Category' } },
              { name: 'a Name 5', category: { name: 'a Category' } },
            ],
            total: 5,
          });
        });
      });

      describe('when getting the first page (size 2)', () => {
        def('pageConfig', () => ({ page: 0, pageSize: 2 }));

        it('returns the list of things (ignoring inactive) and the total things count', async () => {
          const things = await subject();
          expect(things).toMatchObject({
            results: [
              { name: 'a Name 1', category: { name: 'a Category' } },
              { name: 'a Name 2', category: { name: 'a Category' } },
            ],
            total: 5,
          });
        });
      });

      describe('when getting the second page (size 2)', () => {
        def('pageConfig', () => ({ page: 1, pageSize: 2 }));

        it('returns the list of things (ignoring inactive) and the total things count', async () => {
          const things = await subject();
          expect(things).toMatchObject({
            results: [
              { name: 'a Name 3', category: { name: 'a Category' } },
              { name: 'a Name 4', category: { name: 'a Category' } },
            ],
            total: 5,
          });
        });
      });

      describe('when passed an array of 5 ids', () => {
        def('thingIds', () => [1, 2, 3, 4, 5]);

        describe('and a pageSize of 10', () => {
          def('pageConfig', () => ({ page: 0, pageSize: 10 }));

          it('returns those things (ignoring inactive)', async () => {
            const things = await subject();
            expect(things).toMatchObject({
              results: [
                { name: 'a Name 1', category: { name: 'a Category' } },
                { name: 'a Name 2', category: { name: 'a Category' } },
                { name: 'a Name 3', category: { name: 'a Category' } },
              ],
              total: 3,
            });
          });
        });

        describe('and a pageSize of 2', () => {
          def('pageConfig', () => ({ page: 0, pageSize: 2 }));

          it('returns those things (ignoring inactive)', async () => {
            const things = await subject();
            expect(things).toMatchObject({
              results: [
                { name: 'a Name 1', category: { name: 'a Category' } },
                { name: 'a Name 2', category: { name: 'a Category' } },
              ],
              total: 3,
            });
          });
        });
      });
    });
  });

  describe('create', () => {
    const thingData = { name: 'some thing' };

    subject(() =>
      thingsService.create({
        thing: {
          ...thingData,
          category_id: get('categoryId'),
        },
      }),
    );

    describe('when the params pass validations', () => {
      describe('with an existing category', () => {
        def('categoryId', () => category.id);

        it('creates a new thing', async () => {
          await subject();
          const thing = await knexConnection.first('*').from('things');
          expect(thing).toMatchObject({ name: thingData.name });
        });

        it('returns the newly created thing', async () => {
          const result = await subject();
          expect(result).toMatchObject({ name: thingData.name });
        });
      });

      describe('with a non-existing category', () => {
        def('categoryId', () => 123123);

        it('throws an expected error', async () => {
          expect.assertions(2);
          try {
            await subject();
          } catch (e) {
            expect(e).toMatchObject({
              message: 'Category not found',
              code: CategoryNotFound.code,
            });
            expect(JSON.parse(JSON.stringify(e))).toEqual({
              categoryId: 123123,
              details: 'No category was found with the given id',
            });
          }
        });
      });
    });

    describe('when the params do not pass validations', () => {
      def('categoryId', () => 'NaN');

      it('throws an error', async () => {
        expect.assertions(2);
        try {
          await subject();
        } catch (e) {
          expect(e).toMatchObject({
            message: 'ValidationError',
            code: ValidationError.code,
          });
          expect(JSON.parse(JSON.stringify(e))).toEqual({
            details: [
              {
                context: {
                  key: 'category_id',
                  label: 'category_id',
                  value: 'NaN',
                },
                message: '"category_id" must be a number',
                path: ['category_id'],
                type: 'number.base',
              },
            ],
          });
        }
      });
    });

    describe('when calling create with an undefined thing', () => {
      subject(() =>
        thingsService.create({
          thing: undefined,
        }),
      );

      it('throws an error', async () => {
        expect.assertions(2);
        try {
          await subject();
        } catch (e) {
          expect(e).toMatchObject({
            message: 'ValidationError',
            code: ValidationError.code,
          });
          expect(JSON.parse(JSON.stringify(e))).toEqual({
            details: "expected valid 'thing' object, got undefined",
          });
        }
      });
    });
  });
});
