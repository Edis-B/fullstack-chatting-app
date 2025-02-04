import { isLoggedIn } from "../services/userService.js"

export default async () => {
    return await isLoggedIn();
}