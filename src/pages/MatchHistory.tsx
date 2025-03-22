import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { url } from "@/utils/url";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Space, Table, Typography, ConfigProvider, theme, Spin } from "antd";
import { RootState } from "@/main";

const MatchHistory = () => {
  const year = useSelector((state: RootState) => state.year);
  const userInfo = useSelector((state: RootState) => state.user);
  const token = useSelector((state: RootState) => state.token);

  const [user, setUser] = useState(null);
  const [userMatches, setUserMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // ✅ Get userId from the URL
  const userId = id || userInfo?._id;

  useEffect(() => {
    if (!userId || !year) return;
    const getUser = async () => {
      try {
        const response = await fetch(`${url}/users/${userId}?year=${year}`, {
          method: "GET",
          // headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user data");
      }
    };

    
    const getUserMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${url}/votes/${userId}?year=${year}`, {
          method: "GET",
          // headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserMatches(data);
        toast.success("Matches History Loaded!");
      } catch (error) {
        console.error(error)
        toast.error("Failed to load matches!");
      } finally {
        setLoading(false);
      }
    };

    getUser();
    getUserMatches();
  }, [userId, year]);

  return (
    <div className="flex gap-8 justify-center ">
      <div className="md:flex-row flex-col">
        {user && (
          <Card className="p-6 h-[200px] bg-transparent text-white w-[360px] mb-4">
            {/* First Row */}
            <div className="flex justify-between items-center ">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <img
                    src={user?.picturePath?.url ?? user?.picturePath}
                    alt="User"
                    className="w-full h-full rounded-full border-2 border-primary"
                  />
                </Avatar>
                <div>
                  <h6 className="text-lg font-medium hover:text-primary cursor-pointer">
                    {user.name}
                  </h6>
                  <p className="text-sm text-slate-200">{user.instaUsername}</p>
                </div>
              </div>
            </div>

            <hr className="" />

            {/* Stats Section */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <p className=" text-slate-200">Prediction Correct</p>
                <p className="font-medium">{user.correctedVoteNew}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className=" text-slate-200">Total Prediction</p>
                <p className="font-medium">{user.totalVoteNew}</p>
              </div>
            </div>
          </Card>
        )}

        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Space size={20} direction="vertical">
            <Typography.Title level={4}>Prediction History</Typography.Title>
            <Table
              loading={loading}
              columns={[
                {
                  title: "Match",
                  dataIndex: "matchNo",
                  align: "center",
                  key: "index",
                  sorter: (a, b) => a.matchNo - b.matchNo,
                  defaultSortOrder: "descend",
                },
                {
                  title: "Team 1",
                  dataIndex: "team1",
                  align: "center",
                },
                {
                  title: "Team 2",
                  dataIndex: "team2",
                  align: "center",
                },
                {
                  title: "Predicted Team",
                  dataIndex: "selectedTeam",
                  align: "center",
                  render: (text, record) => {
                    if (record.winnerTeam && record.winnerTeam === text) {
                      return (
                        <div
                          style={{
                            backgroundColor: "#27ae60",
                            padding: "4px",
                            borderRadius: "3px",
                          }}
                        >
                          {text}
                        </div>
                      );
                    } else {
                      return text;
                    }
                  },
                },
              ]}
              dataSource={userMatches}
              pagination={{
                pageSize: 10,
              }}
              loadingIndicator={<Spin />}
            ></Table>
          </Space>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default MatchHistory;
