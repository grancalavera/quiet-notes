import { bind } from "@react-rxjs/core";
import { useMutation } from "../lib/use-mutation-2";
import { adminService } from "../services/admin-service-2";

export const [useUsers] = bind(adminService.users$);
export const useToggleRole = () => useMutation(adminService.toggleRole);
