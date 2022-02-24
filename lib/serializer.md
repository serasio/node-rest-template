## Serializing your models
To serialize a model, you need to create a serializer. It will specify how the model is going to be presented.

### Creating a serializer
Create a file in the `/serializers` folder. A serializer is a class that inherits from our base serializer class.
You have to define a constructor that specifies the name of the collection and how to actually serialize an object.
```js
const Serializer = require('./serializer');

class ThingSerializer extends Serializer {
  constructor() {
    super({ collectionName: 'things' });

    this.baseFields = ['name', 'created_at', 'updated_at'];
    this.meta = {};
  }
}
```

`collectionName` defines what's the plural name of the model/entity to serialize. It will be used if it's a collection.

`this.baseFields` defines which attributes of the model we want in the serializer.

Every key in the `this.meta` object will appear in the output of the serializer, under that same key name. The values of each key specify how the value in the output should be calculated.

Usage example:
```js
const serializerInstance = new ThingSerializer();
// when serializing a plain object
console.log(serializerInstance.serialize({ name: 'a thing', irrelevantKey: true }));
// <- { name: 'a thing', created_at: null, updated_at: null }

// when serializing an array of objects, it returns them in an object with a `collectionName` key
console.log(serializerInstance.serialize([{ name: 'a thing', irrelevantKey: true }, { name: 'another thing' }]));
// <- { things:
//      [ { name: 'a thing', created_at: null, updated_at: null },
//        { name: 'another thing', created_at: null, updated_at: null } ] }
```

The next sections explain how to use `this.meta` to serialize other properties.

### Renaming an attribute in the serializer
To use a different name for an attribute of the model, you should use the `Serializer.renamed('attribute')` function.
It receives the original name of the attribute as parameter.
```js
  constructor() {
    super({ collectionName: 'things' });

    this.baseFields = ['name', 'created_at', 'updated_at'];

    this.meta = {
      renamedAttribute: Serializer.renamed('name'),
    };
  }
```
In this example, the output will have a key named `renamedAttribute` that will contain the value for name.

### Adding custom data to the serializer
To add some custom data, (i.e.: transformed data or combination of some of the model's attributes), you should use the
`Serializer.calculated(func)`. It receives a function that will generate the data to serialize. That function receives the `object`, that is the instance of the model being serialized.
```js
  constructor() {
    super({ collectionName: 'things' });

    this.baseFields = ['name', 'created_at', 'updated_at'];
    this.collectionName = 'things';

    this.meta = {
      reverseName: Serializer.calculated(ThingSerializer.reverseName),
    };
  }

  static reverseName(object) {
    return object.name.split('').reverse().join('');
  }
```
In this example, the output will have a key named `reverseName` that will contain output of that function, that in this case in the reversed name.

### Serializing relations (nested objects)
If the model to serialize has nested objects, the `Serializer.nested('attributeName', anotherSerializer)` function should be used.

Another serializer is needed, for that nested entity. The `nested` function recieves two parameters: the attribute name (key) to get the nested data from, and the other serializer instance.
```js
// serializers/things.js
const Serializer = require('./serializer');

class ThingSerializer extends Serializer {
  constructor({ categorySerializer = null } = {}) {
    super({ collectionName: 'things' });

    this.baseFields = ['name'];

    this.meta = {};

    if (categorySerializer) {
      // Nested example
      this.meta.category = Serializer.nested('category', categorySerializer);
    }
  }
}

// example.js
const ThingSerializer = require('./serializers/things');
const CategorySerializer = require('./serializers/category');

const thingSerializer = new ThingSerializer({
  categorySerializer: new CategorySerializer(),
});
const serializerOutput = thingSerializer.serialize({
  name: 'some thing',
  category: {
    name: 'some category',
  },
});
```
In this example, the output will have a key named `category` that will contain output of the `CategorySerializer` for that category.

Note: as you might have noticed, the `categorySerializer` is optional in the constructor of `ThingSerializer`. This makes  it possible to create a different `ThingSerializer` that does not include the category in its output. Try to use patterns like this to select desired subsets of information when using serializers.
