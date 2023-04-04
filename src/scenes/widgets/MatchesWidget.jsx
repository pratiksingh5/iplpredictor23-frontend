import React, { useState, useEffect } from "react";
import { Space, Table, Typography, ConfigProvider, theme, Spin } from "antd";
import axios from "axios";
import { url } from "helper/url";

import { setMatches } from "state";
import { useSelector, useDispatch } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";

const MatchesWidget = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.matches);
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);
  const [winnerTeam, setWinnerTeam] = React.useState("");

  const handleWinnerChange = (record, value) => {
    setWinnerTeam(value);
  };

  const handleUpdateWinner = async (data) => {
    const { matchId, winner } = data;
    try {
      const response = await axios.put(
        `${url}/matches/updateUserVote`,
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
      console.log(response.data); // log the response message
      getAllMacthes();
    } catch (error) {
      console.error(error);
    }
  };

  const getAllMacthes = async () => {
    const response = await fetch(
      `${url}/matches/${_id}/allmatches`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setMatches({ matches: data }));
    setLoading(false)
  };

  useEffect(() => {
    setLoading(true);
    getAllMacthes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Matches</h1>
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
                  <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={winner || winnerTeam || ""}
                      onChange={(event) =>
                        handleWinnerChange(record, event.target.value)
                      }
                      // value={winner}
                      defaultValue={winner}
                    >
                      <MenuItem value={record.team1}>{record.team1}</MenuItem>
                      <MenuItem value={record.team2}>{record.team2}</MenuItem>
                    </Select>
                  </FormControl>
                ),
              },

              {
                title: "Action",
                key: "operation",
                fixed: "right",
                width: 100,
                render: () => <Button>Update</Button>,
                onCell: (record, rowIndex) => {
                  return {
                    onClick: async (event) => {
                      const data = {
                        matchId: record._id,
                        winner: winnerTeam,
                      };
                      await handleUpdateWinner(data);
                    },
                  };
                },
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

export default MatchesWidget;
