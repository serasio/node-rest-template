class Serializer {
  constructor({ collectionName }) {
    if (!collectionName) throw new Error('Serializer needs collectionName');
    this.collectionName = collectionName;
    this.baseFields = [];
    this.meta = {};
  }

  /**
   * Defines a nested attribute for the serializer.
   * Nested means that the attribute is defined by another Serializer
   * @param  {string} nestedObjectKey - The key of the object that will be called by the
   *    nested serializer
   * @param  {Serializer} serializer - Serializer that will be used to serialize the nested child
   */
  static nested(nestedObjectKey, serializer) {
    return (object) => {
      const nestedObject = object[nestedObjectKey];
      const serializedObject = serializer.serialize(nestedObject);
      if (Array.isArray(nestedObject)) {
        return serializedObject[serializer.collectionName];
      }
      return serializedObject;
    };
  }

  /**
   * Defines a renamed attribute for the serializer.
   * @param  {string} key - The key of the object that will be used for the custom attribute
   */
  static renamed(key) {
    return (object) => {
      if (object && key in object) {
        return object[key];
      }

      return null;
    };
  }

  /**
   * Defines a calculated attribute for the serialized
   * Calculated means that the attribute is the result of executing a function
   * @param  {string} func - The passed function that will be executed.
   *    It has to receive an instance of the entity has a param
   */
  static calculated(func) {
    return (object) => {
      try {
        return func(object);
      } catch (e) {
        return null;
      }
    };
  }

  /**
   * Serializes an object or an array of objects with the schema defined
   * by this.baseFields and this.meta
   * @param  {Object|Array} object - Object or array to serialize.
   * @returns {Object|null} - The serialized object, or null if not given a valid object
   * When given an array, returns { [this.collectionName]: [...serializedCollection] }
   */
  serialize(object) {
    if (!object || typeof object !== 'object') return null;

    if (Array.isArray(object)) {
      const serializedCollection = object.map((elem) => this.serializeObject(elem));
      return { [this.collectionName]: serializedCollection };
    }

    return this.serializeObject(object);
  }

  /**
   * Serializes a single object
   * @private
   * @param  {Object} object - Object to serialize.
   * @returns {Object} - The serialized object
   */
  serializeObject(object) {
    const attributes = this.serializeBaseFields(object);
    const customAttributes = this.serializeMetaAttributes(object);

    return { ...attributes, ...customAttributes };
  }

  /**
   * Returns the configured base fields of a single object
   * @private
   * @param  {Object} object - Object to serialize.
   * @returns {Object} - Object with only the base fields
   */
  serializeBaseFields(object) {
    const serializedAttributes = {};
    this.baseFields.forEach((includedAttribute) => {
      if (includedAttribute in object) {
        serializedAttributes[includedAttribute] = object[includedAttribute];
      } else {
        serializedAttributes[includedAttribute] = null;
      }
    });

    return serializedAttributes;
  }

  /**
   * Returns the configured meta attributes of a single object
   * @private
   * @param  {Object} object - Object to serialize.
   * @returns {Object} - Object with the calculated meta attributes
   */
  serializeMetaAttributes(object) {
    const serializedAttributes = {};

    Object.entries(this.meta).forEach(([key, attributeMetadata]) => {
      serializedAttributes[key] = Serializer.processAttributeMetadata(attributeMetadata, object);
    });

    return serializedAttributes;
  }

  /**
   * Uses metadata for an attibute to calculate its value for a given object
   * @private
   * @param  {any} attributeMetadata - Metadata used to calculate the value.
   * @param  {Object} object - Source object.
   * @returns {any} - The calculated value
   */
  static processAttributeMetadata(attributeMetadata, object) {
    if (typeof attributeMetadata === 'function') {
      return attributeMetadata(object);
    }
    // TODO: handle this
    throw new Error('?????');
  }
}

module.exports = { Serializer };
