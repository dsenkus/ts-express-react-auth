import { pick } from "../../utils";

export function serializeAuthUser(user: User): UserAuthData {
    return pick(user, ['id', 'name', 'email']);
}
