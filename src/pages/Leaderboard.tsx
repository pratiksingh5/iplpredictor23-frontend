import { useState, useEffect } from "react";
import { Avatar, Table, Typography, ConfigProvider, theme, Spin } from "antd";
import { url } from "../utils/url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { RootState } from "@/main";

interface User {
  id: string;
  name: string;
  correctedVoteNew: number;
  totalVoteNew: number;
  picturePath?: { url: string };
  rank?: number;
  instaUsername?: string;
}

const Leaderboard = () => {
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isAuth = Boolean(useSelector((state: RootState) => state.token));
  const year = useSelector((state: RootState) => state.year);

  const getAllUsers = async (): Promise<void> => {
    try {
      const response = await fetch(`${url}/getAllUsers?year=${year}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: User[] = await response.json();

      const sortedData = data.sort(
        (a, b) => b.correctedVoteNew - a.correctedVoteNew
      );

      let rank = 1;
      let prevVote = sortedData[0]?.correctedVoteNew;

      if (prevVote !== undefined) {
        const rankedData = sortedData.map((obj, index) => {
          if (obj.correctedVoteNew < prevVote) {
            rank = index + 1;
            prevVote = obj.correctedVoteNew;
          }
          return { ...obj, rank };
        });

        setDataSource(rankedData);
        toast.success("Leaderboard loaded!");
      } else {
        toast.success("Tournament not started yet");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAllUsers();
  }, [year]);

  return (
    <div >
      <h1 className="text-center ">
        {" "}
        <Button onClick={() => navigate('/register')} className="text-lg uppercase cursor-pointer ">
          Participate Now
        </Button>
      </h1>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Typography.Title level={3} align="center" style={{ margin: "10px 0" }}>
          IPL Predictor {year}
        </Typography.Title>
        <Typography.Title level={5} align="center" style={{ margin: "10px 0" }}>
          LEADERBOARD
        </Typography.Title>
        <Table
          loading={loading}
          columns={[
            {
              title: "Rank",
              dataIndex: "rank",
              width: "40px",
              align: "center",
              render: (value) => <span>{value}</span>,
            },
            {
              title: "Name",
              dataIndex: "name",
              align: "center",
              width: "200px",
              render: (value, record) => {
                console.log("record", record)
                return (
                  <div className="flex justify-between">
                    <Avatar src={record?.picturePath?.url} />
                    <h5 style={{ fontWeight: "500" }}>
                      {record?.instaUsername}
                    </h5>
                  </div>
                );
              },
            },
            {
              title: "Points",
              dataIndex: "totalVote",
              align: "center",
              render: (_, record) => (
                <span>
                  {record.correctedVoteNew}/{record.totalVoteNew}
                </span>
              ),
            },
          ]}
          dataSource={dataSource}
          pagination={false}
          loadingIndicator={<Spin />}
          onRow={(record) => {
            return {
              onClick: () => {
                if (isAuth) {
                  navigate(`/profile/${record._id}`);
                }
              },
            };
          }}
        ></Table>
      </ConfigProvider>
    </div>
  );
};

export default Leaderboard;
