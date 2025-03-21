import { Outlet } from "react-router-dom";
import { TabsMenu, Header, Footer } from "./layouts";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState } from "./main";

const App = () => {
  const token = useSelector((state: RootState) => state.token);
  const user = useSelector((state) => state.user);
  const isAuth = Boolean(token);
  const role = useMemo(() => user?.role || "", [user?.role]);

  return (
    <div className="main font-gilroy ">
      <Toaster />
      <header>
        <Header />
      </header>
      <main className="px-[6vw]  min-h-[80vh]">
        {isAuth && role === 'user' && <TabsMenu />}
        <div className="py-4">
          <Outlet />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;
