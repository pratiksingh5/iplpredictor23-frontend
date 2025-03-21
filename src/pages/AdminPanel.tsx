import { useState, useEffect } from "react";
import { Space, Table, Typography, ConfigProvider, theme, Spin } from "antd";
import axios from "axios";
import { url } from "@/utils/url";
import { setMatches } from "@/redux";
import { useSelector, useDispatch } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { RootState } from "@/main";

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const matches = useSelector((state: RootState) => state.matches);
  const token = useSelector((state: RootState) => state.token);
  const year = useSelector((state: RootState) => state.year);
  const [winners, setWinners] = useState({});

  const handleWinnerChange = (matchId, value) => {
    setWinners((prev) => ({
      ...prev,
      [matchId]: value, // Update only the specific match
    }));
  };

  const getAllMatches = async () => {
    try {
      const response = await fetch(`${url}/matches/allmatches?year=${year}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      dispatch(setMatches({ matches: data }));

      // 🔹 Initialize winners state from API response
      const initialWinners = {};
      data.forEach((match) => {
        initialWinners[match._id] = match.winner || ""; // Use existing winner if available
      });

      setWinners(initialWinners);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setLoading(false);
    }
  };

  const handleUpdateWinner = async (data) => {
    const { matchId, winner } = data;
    try {
      const response = await axios.put(
        `${url}/matches/update`,
        {
          matchId,
          winner,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Winner Updated");
      getAllMatches();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (url && year) {
      setLoading(true);
      getAllMatches();
    }
  }, [year]);

  return (
    <div className="flex justify-center">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Space size={20} direction="vertical">
          <Typography.Title level={4}>Update Winners</Typography.Title>
          <Table
            loading={loading}
            columns={[
              {
                title: "#",
                dataIndex: "matchNo",
                key: "index",
                sorter: (a, b) => a.matchNo - b.matchNo,
                defaultSortOrder: "ascend",
              },
              {
                title: "Team 1",
                dataIndex: "team1",
              },
              {
                title: "Team 2",
                dataIndex: "team2",
              },
              {
                title: "Wining Team",
                key: "teams",
                dataIndex: "winner",
                render: (winner, record, index) => (
                  <Select
                    value={winners[record._id] || ""}
                    onValueChange={(value) =>
                      handleWinnerChange(record._id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder = " Select Winner">
                        {winners[record._id] || "Select a team"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={record.team1}>
                        {record.team1}
                      </SelectItem>
                      <SelectItem value={record.team2}>
                        {record.team2}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ),
              },

              {
                title: "Action",
                key: "operation",
                fixed: "right",
                width: 100,
                // render: () => <Button>Update</Button>,
                // onCell: (record, rowIndex) => {
                //   return {
                //     onClick: async (event) => {
                //       const data = {
                //         matchId: record._id,
                //         winner: winners[record._id],
                //       };
                //       await handleUpdateWinner(data);
                //     },
                //   };
                // },
                render: (record) => (
                  <Button
                  className="cursor-pointer"
                    onClick={async () => {
                      const data = {
                        matchId: record._id,
                        winner: winners[record._id],
                      };
                      await handleUpdateWinner(data);
                    }}
                  >
                    Update
                  </Button>
                ),
              },
            ]}
            dataSource={matches}
            pagination={false}
            loadingIndicator={<Spin />}
          ></Table>
        </Space>
      </ConfigProvider>
    </div>
  );
};

export default AdminPanel;
