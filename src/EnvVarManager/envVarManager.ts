class EnvVarNotSetError extends Error {
  constructor (varName:string) {
    super(`Environment variable "${varName}" is required but was not set!`);
    this.name = "EnvVarNotSetError";
    Object.setPrototypeOf(this, EnvVarNotSetError.prototype);
  }
}

class EnvVarManager {
  static validate(varNames:string[]) {
    return varNames.map((varName) => {
      const value = Deno.env.get(varName);

      if (!value) {
        throw new EnvVarNotSetError(varName);
      }

      return value;
    });
  }
}

export { EnvVarManager };
