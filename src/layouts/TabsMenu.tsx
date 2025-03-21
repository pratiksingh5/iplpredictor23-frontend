import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const TabsMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (): string => {
    const path = location.pathname;
    switch (path) {
      case "/predict":
        return "predict";
      case "/match-history":
        return "match-history";
      case "/":
        return "leaderboard";
      default:
        return "leaderboard";
    }
  };

  const handleTabChange = (tab: string) => {
    navigate(tab === "leaderboard" ? "/" : `/${tab}`);
  };

  const activeTab = getActiveTab();

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="md:w-full "
    >
      <TabsList className=" w-full  bg-transparent border-[1px]">
        <TabsTrigger
          value="predict"
          className="data-[state=active]:bg-primary data-[state=active]:font-semibold cursor-pointer"
        >
          Predict Now
        </TabsTrigger>
        {activeTab !== "predict" && (
          <Separator orientation="vertical" className="h-6 bg-white" />
        )}

        <TabsTrigger
          value="leaderboard"
          className="data-[state=active]:bg-primary data-[state=active]:font-semibold cursor-pointer"
        >
          Leaderboard
        </TabsTrigger>
        {activeTab !== "leaderboard" && (
          <Separator orientation="vertical" className="h-6 bg-white" />
        )}

        <TabsTrigger
          value="match-history"
          className="data-[state=active]:bg-primary data-[state=active]:font-semibold cursor-pointer"
        >
          Match History
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabsMenu;
