import { useEffect } from "react";
import { useAppDispatch } from "@/core/hooks/useAppDispatch";
import { useAppSelector } from "@/core/hooks/useAppSelector";
import { restoreSession } from "@/modules/auth/redux/authSlice";
import { selectIsInitialized } from "@/modules/auth/redux/authSelectors";
import Loader from "@/shared/ui/Loader";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectIsInitialized);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (!isInitialized) {
    return <Loader />;
  }

  return <>{children}</>;
};
