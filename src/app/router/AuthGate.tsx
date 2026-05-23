import { useEffect } from "react";
import { useAppDispatch } from "../../core/hooks/useAppDispatch";
import { useAppSelector } from "../../core/hooks/useAppSelector";
import { restoreSession } from "../../modules/auth/redux/authSlice";
import { selectIsInitialized } from "../../modules/auth/redux/authSelectors";

function Loader() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading session...
    </div>
  );
}

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
