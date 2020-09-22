import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: "domainName", async: false})
export class DomainNameValidator implements ValidatorConstraintInterface {

  validate(domainName: string, validationArguments: ValidationArguments) {
    if (!domainName) {
      return true;
    }
    // @ts-ignore
    return (validationArguments?.constraints[0]?.admin) ? /^[a-z-.]+$/.test(domainName) : /^[a-z-]+$/.test(domainName);
  }

  defaultMessage() {
    return `Le nom de domaine ne respecte pas le bon format.`;
  }

}
