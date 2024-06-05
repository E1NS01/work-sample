import { User } from '../../src/types/user';
import UserModel from '../../src/model/user';

async function addUser(name: string, email: string): Promise<User> {
    const user = new UserModel({ name, email });
    await user.save();
    return user;
}

export default addUser;
