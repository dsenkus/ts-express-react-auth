import { pick } from "../../utils";
import { UserAuthData } from "../../../types/common";
import { User } from "../../../types/database";

export function serializeAuthUser(user: User): UserAuthData {
    return pick(user, ['id', 'name', 'email']);
}
