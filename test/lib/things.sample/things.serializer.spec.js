const { ThingSerializer } = require('../../../src/lib/things.sample');
const { CategorySerializer } = require('../../../src/lib/categories.sample');

describe('things/serializer', () => {
  const serviceOutput = {
    name: 't_1',
    irrelevant: 'value',
    created_at: 'ISOSTRING1',
    updated_at: 'ISOSTRING2',
    category: {
      name: 'c_1',
      created_at: 'ISOSTRING1',
      updated_at: 'ISOSTRING2',
      things: [
        {
          name: 't_1',
          created_at: 'ISOSTRING1',
          updated_at: 'ISOSTRING2',
        },
        {
          name: 't_2',
          created_at: 'ISOSTRING1',
          updated_at: 'ISOSTRING2',
        },
      ],
    },
  };

  describe('by default', () => {
    subject(() => new ThingSerializer().serialize(serviceOutput));

    it('serializes properly', () => {
      const serializerOutput = {
        name: 't_1',
        created_at: 'ISOSTRING1',
        updated_at: 'ISOSTRING2',
        the_name: 't_1',
        reverseName: '1_t',
      };

      expect(subject()).toEqual(serializerOutput);
    });
  });

  describe('when given a category serializer', () => {
    subject(() => {
      const basicThingSerializer = new ThingSerializer();
      const categorySerializer = new CategorySerializer({
        thingSerializer: basicThingSerializer,
      });
      return new ThingSerializer({ categorySerializer }).serialize(serviceOutput);
    });

    it('serializes properly', () => {
      const serializerOutput = {
        name: 't_1',
        created_at: 'ISOSTRING1',
        updated_at: 'ISOSTRING2',
        category: {
          name: 'c_1',
          created_at: 'ISOSTRING1',
          updated_at: 'ISOSTRING2',
          things: [
            {
              name: 't_1',
              created_at: 'ISOSTRING1',
              updated_at: 'ISOSTRING2',
              the_name: 't_1',
              reverseName: '1_t',
            },
            {
              name: 't_2',
              created_at: 'ISOSTRING1',
              updated_at: 'ISOSTRING2',
              the_name: 't_2',
              reverseName: '2_t',
            },
          ],
        },
        the_name: 't_1',
        reverseName: '1_t',
      };

      expect(subject()).toEqual(serializerOutput);
    });
  });
});
