import ApiStatus from '@enum/api-status.enum';
import { UserInterface } from '@interfaces/user.interfaces';

export interface LoginData {
  name: string;
  pass: string;
}

export interface LoginResult {
  status: ApiStatus;
  user: UserInterface;
}
