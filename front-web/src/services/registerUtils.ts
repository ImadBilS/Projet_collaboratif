export type RegisterFormPayload = {
  firstname: string;
  lastname: string;
  birth: string;
  mail: string;
  password: string;
  confirmPassword: string;
  role: string;
  sex: string;
  street_number: string;
  street_type: string;
  postal_code: string;
  address_complement: string | null;
  city: string;
  country: string;
};

export function normalizeRegisterField(name: string, value: string) {
  return name === "address_complement" && value === "" ? null : value;
}

export function passwordsMatch(password: string, confirmPassword: string) {
  return password === confirmPassword;
}

export function buildRegisterPayload(form: RegisterFormPayload) {
  const { confirmPassword: _confirmPassword, ...rest } = form;

  return {
    ...rest,
    street_number: Number(rest.street_number),
    postal_code: Number(rest.postal_code),
  };
}
