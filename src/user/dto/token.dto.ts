export class TokenDto {
  private readonly _token: string;

  private readonly _expiredIn: string;

  token() {
    return this._token;
  }

  expiredIn() {
    return this._expiredIn;
  }
}
