import Where from "./where";
import NearText from "./nearText";
import NearVector from "./nearVector";
import NearObject from "./nearObject";
import NearImage from "./nearImage";
import Ask from "./ask";
import Group from "./group";

export default class Getter {
  constructor(client) {
    this.client = client;
    this.errors = [];
    this.includesNearMediaFilter = false
  }

  withFields = (fields) => {
    this.fields = fields;
    return this;
  };

  withClassName = (className) => {
    this.className = className;
    return this;
  };

  withGroup = (groupObj) => {
    try {
      this.groupString = new Group(groupObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withWhere = (whereObj) => {
    try {
      this.whereString = new Where(whereObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withNearText = (nearTextObj) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearTextString = new NearText(nearTextObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    this.includesNearMediaFilter = true
    return this;
  };

  withNearObject = (nearObjectObj) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearObjectString = new NearObject(nearObjectObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    this.includesNearMediaFilter = true
    return this;
  };

  withAsk = (askObj) => {
    try {
      this.askString = new Ask(askObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withNearImage = (nearImageObj) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearImageString = new NearImage(nearImageObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    this.includesNearMediaFilter = true
    return this;
  };

  withNearVector = (nearVectorObj) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearVectorString = new NearVector(nearVectorObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    this.includesNearMediaFilter = true
    return this;
  };

  withLimit = (limit) => {
    this.limit = limit;
    return this;
  };

  withOffset = (offset) => {
    this.offset = offset;
    return this;
  };

  validateIsSet = (prop, name, setter) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validate = () => {
    this.validateIsSet(
      this.className,
      "className",
      ".withClassName(className)"
    );
    this.validateIsSet(this.fields, "fields", ".withFields(fields)");
  };

  do = () => {
    let params = "";

    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    if (
      this.whereString ||
      this.nearTextString ||
      this.nearObjectString ||
      this.nearVectorString ||
      this.askString ||
      this.nearImageString ||
      this.limit ||
      this.offset ||
      this.groupString
    ) {
      let args = [];

      if (this.whereString) {
        args = [...args, `where:${this.whereString}`];
      }

      if (this.nearTextString) {
        args = [...args, `nearText:${this.nearTextString}`];
      }

      if (this.nearObjectString) {
        args = [...args, `nearObject:${this.nearObjectString}`];
      }

      if (this.askString) {
        args = [...args, `ask:${this.askString}`];
      }

      if (this.nearImageString) {
        args = [...args, `nearImage:${this.nearImageString}`];
      }

      if (this.nearVectorString) {
        args = [...args, `nearVector:${this.nearVectorString}`];
      }

      if (this.groupString) {
        args = [...args, `group:${this.groupString}`];
      }

      if (this.limit) {
        args = [...args, `limit:${this.limit}`];
      }

      if (this.offset) {
        args = [...args, `offset:${this.offset}`];
      }

      params = `(${args.join(",")})`;
    }

    return this.client.query(
      `{Get{${this.className}${params}{${this.fields}}}}`
    );
  };
}
