// One shared source of truth for all three demo workspaces.
// The ref keeps sequential actions synchronized before React completes a render.
import { createContext, useContext, useRef, useState, useEffect } from "react";
import { createSeed } from "../data/seed";
import { loadState, saveState, transact } from "../utils/model";
const Context = createContext(null);
export function AppProvider({ children }) {
  const [boot] = useState(() => {
    try {
      return loadState(window.localStorage);
    } catch {
      return {
        data: createSeed(),
        warning:
          "Browser storage is unavailable. Changes will last only for this session.",
      };
    }
  });
  const [data, setData] = useState(boot.data),
    ref = useRef(data),
    [warning, setWarning] = useState(boot.warning),
    [toast, setToast] = useState(null);
  const storageBlocked = useRef(Boolean(boot.warning));
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  function commit(next) {
    ref.current = next;
    setData(next);
    if (!storageBlocked.current) {
      try {
        const err = saveState(window.localStorage, next);
        if (err) setWarning(err);
      } catch {
        setWarning("Changes cannot be saved in this browser.");
      }
    }
  }
  function run(type, payload, message) {
    try {
      commit(transact(ref.current, type, payload));
      if (message) setToast({ message, type: "success" });
      return true;
    } catch (e) {
      setToast({ message: e.message, type: "error" });
      return false;
    }
  }
  function reset() {
    storageBlocked.current = false;
    commit(createSeed());
    try {
      const err = saveState(window.localStorage, ref.current);
      setWarning(err);
    } catch {
      setWarning("Changes cannot be saved in this browser.");
    }
    setToast({
      message: "Initial data restored. Choose an account to start again.",
      type: "success",
    });
  }
  const user = data.users.find((u) => u.id === data.sessionId);
  return (
    <Context.Provider
      value={{
        data,
        user,
        run,
        reset,
        warning,
        toast,
        notify: (message, type = "success") => setToast({ message, type }),
        dismissToast: () => setToast(null),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);
