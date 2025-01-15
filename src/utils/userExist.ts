import authServices from '../app/modules/authModule/userAuthModule/auth.services';
import { IOutlet } from '../app/modules/outletModule/outlet.interface';
import IUser from '../app/modules/userModule/user.interface';

export const userExist = async (email: string): Promise<IUser | IOutlet | null> => {
  const user = await authServices.getUserByEmail(email);
  const outlet = await authServices.getOutletByEmail(email);
  return user ? user : outlet ? outlet : null
};
