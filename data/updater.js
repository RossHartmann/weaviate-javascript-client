import { isValidStringProperty } from "../validation/string";

export default class Updater {
  constructor(client) {
    this.client = client;
    this.errors = [];
  }

  withProperties = (properties) => {
    this.properties = properties;
    return this;
  };

  withId = (id) => {
    this.id = id;
    return this;
  };

  withClassName = (className) => {
    this.className = className;
    return this;
  };

  validateClassName = () => {
    if (!isValidStringProperty(this.className)) {
      this.errors = [
        ...this.errors,
        "className must be set - set with withId(id)",
      ];
    }
  };

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [
        ...this.errors,
        "id must be set - initialize with updater(id)",
      ];
    }
  };

  buildPath = () => {
    let path = `/objects`;
    if (isValidStringProperty(this.className)) {
      path = `${path}/${this.className}`
    }
    return `/${path}/${this.id}`;
  }

  payload = () => ({
    properties: this.properties,
    class: this.className,
    id: this.id,
  });

  validate = () => {
    this.validateClassName();
    this.validateId();
  };

  do = () => {
    this.validate();

    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = this.buildPath();
    return this.client.put(path, this.payload());
  };
}
