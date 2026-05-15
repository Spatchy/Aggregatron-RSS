import { EnvVarsData, ValidationType } from "./_types.ts";
import { envVarsDefaults } from "./defaults.ts";
import { envVarsNames } from "./names.ts";

class EnvVarNotSetError extends Error {
  constructor(varName: string) {
    super(`Environment variable "${varName}" is required but was not set!`);
    this.name = "EnvVarNotSetError";
    Object.setPrototypeOf(this, EnvVarNotSetError.prototype);
  }
}

class EnvVarValidationError extends Error {
  constructor(
    varName: string,
    expectedType: ValidationType,
    actualValue: string,
    isInArray: boolean,
  ) {
    let appendedMsg = `but received value was "${actualValue}"`;

    if (isInArray) {
      appendedMsg = `but the array contained a bad value: "${actualValue}"`;
    }

    super(
      `Environment variable "${varName}" was set incorrectly! Expected type was ${expectedType} ${appendedMsg}`,
    );

    this.name = "EnvVarValidationError";
    Object.setPrototypeOf(this, EnvVarValidationError.prototype);
  }
}

class EnvVarManager {
  static vars: EnvVarsData = envVarsDefaults;

  static validateType(
    varName: string,
    varValue: string,
    validationType: ValidationType,
  ) {
    switch (validationType) {
      case "string":
        return varValue;
      case "number":
        return this.validateNumber(varName, varValue);
      case "boolean":
        return this.validateBoolean(varName, varValue);
      case "array<string>":
      case "array<boolean>":
      case "array<number>":
        return this.validateArrays(varName, varValue, validationType)
    }
  }

  static validateNumber(varName: string, varValue: string, isInArray: boolean = false): number {
    let value = 0;
    if (varValue.includes(".")) {
      value = parseFloat(varValue);
    } else {
      value = parseInt(varValue);
    }

    const validationType: ValidationType = isInArray ? "array<number>" : "number"

    if (value < 0 || Number.isNaN(value)) {
      throw new EnvVarValidationError(varName, validationType, varValue,  isInArray);
    }

    return value;
  }

  static validateBoolean(
    varName: string,
    varValue: string,
    isInArray: boolean = false,
  ): boolean {
    const truthyValues = ["true", "1", "t"];
    const falsyValues = ["false", "0", "f"];

    const validationType: ValidationType = isInArray ? "array<boolean>" : "boolean"

    if (varValue.toLocaleLowerCase() in truthyValues) {
      return true;
    } else if (varValue.toLocaleLowerCase() in falsyValues) {
      return false;
    } else {
      throw new EnvVarValidationError(varName, validationType, varValue, isInArray);
    }
  }

  static validateArrays(
    varName: string,
    varValue: string,
    validationType: Omit<ValidationType, "string" | "number" | "boolean">,
  ) {
    const valuesArray = varValue.split(",");

    switch (validationType) {
      case "array<string>":
        return valuesArray;
      case "array<boolean>":
        return valuesArray.map((val) => this.validateBoolean(varName, val));
      case "array<number>":
        return valuesArray.map((val) => this.validateNumber(varName, val));
      default:
        throw new Error("This error is intended to keep ts happy and should never be seen");
    }
  }

  static validateGeneral() {
    let generalKey: keyof typeof envVarsNames.general;
    for (generalKey in envVarsNames.general) {
      const varName = envVarsNames.general[generalKey].name;
      const optional = envVarsNames.general[generalKey].optional;
      const validationType = envVarsNames.general[generalKey].validationType;

      const varValue = Deno.env.get(varName);

      if (!varValue && !optional) {
        throw new EnvVarNotSetError(varName);
      }

      if (varValue) {
        const castKey = generalKey as keyof typeof this.vars.general;
        this.vars.general[castKey] = this.validateType(
          varName,
          varValue,
          validationType,
        ) as typeof this.vars.general[typeof castKey];
      }
    }
  }

  static validateModules() {
    let module: keyof typeof envVarsNames.modules;
    for (module in envVarsNames.modules) {
      let optionKey: keyof typeof envVarsNames.modules[typeof module];
      for (optionKey in envVarsNames.modules[module]) {
        const varName = envVarsNames.modules[module][optionKey].name;
        const optional = envVarsNames.modules[module][optionKey].optional;
        const validationType = envVarsNames.modules[module][optionKey].validationType;
  
        const varValue = Deno.env.get(varName);
  
        if (!varValue && !optional) {
          throw new EnvVarNotSetError(varName);
        }
  
        const castOptionKey = module as keyof typeof this.vars.modules[typeof module];

        if (varValue) {
          this.vars.modules[module][castOptionKey] = this.validateType(
            varName,
            varValue,
            validationType,
          ) as typeof this.vars.modules[typeof module][typeof castOptionKey];
        }

        if (optionKey === "enable" && this.vars.modules[module][castOptionKey] === false) {
          break; // skip the rest of the environment variables if the module is not enabled
        }
      }
    }
  }

  static validate() {
    this.validateGeneral();
    this.validateModules();
  }
}

export { EnvVarManager };
