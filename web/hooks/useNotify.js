import { useDispatch } from "react-redux";
import { notify } from "@/store/uiSlice";

export function useNotify() {
  const dispatch = useDispatch();
  return {
    success: (message) => dispatch(notify({ message, severity: "success" })),
    error: (message) => dispatch(notify({ message, severity: "error" })),
  };
}