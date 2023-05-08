import { bind } from "@react-rxjs/core";
import { useMutation } from "../lib/use-mutation";
import { adminService } from "../firebase/admin-service";

export const [useUsers] = bind(adminService.users$);
export const useToggleRole = () => useMutation(adminService.toggleRole);
