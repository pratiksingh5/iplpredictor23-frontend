import React, { useState, useEffect } from "react";
import Navbar from "scenes/navbar";
import { Avatar, Table, Typography, ConfigProvider, theme, Spin } from "antd";
import { Box } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { url } from "helper/url";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";



const LandingPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isAuth = Boolean(useSelector((state) => state.token));



  const getAllUsers = async () => {
    const response = await fetch(`${url}/getAllUsers`, {
      method: "GET",
    });
    const data = await response.json();
    const sortedData = data.sort((a, b) => b.correctedVoteNew - a.correctedVoteNew);
    let rank = 1;
    let prevVote = sortedData[0].correctedVoteNew;
    const rankedData = sortedData.map((obj, index) => {
      if (obj.correctedVoteNew < prevVote) {
        rank = index + 1;
        prevVote = obj.correctedVoteNew;
      }
      return { ...obj, rank };
    });
    setDataSource(rankedData);
    toast.success("Leaderboard loaded!", { toastId: 'leaderboard-call' });
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getAllUsers();
  }, []);

  return (
    <Box>
      <Navbar />
      <Box width="100%" padding="10px 5%">
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Typography.Title
            level={3}
            align="center"
            style={{ margin: "10px 0" }}
          >
            IPL Predictor 2023
          </Typography.Title>
          <Typography.Title
            level={5}
            align="center"
            style={{ margin: "10px 0" }}
          >
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
                dataIndex: "title",
                align: "center",
                width: "200px",
                render: (value, record) => {
                  return (
                    <FlexBetween>
                      <Avatar src={record.picturePath.url} />
                      <h5 style={{ fontWeight: "500" }}>
                        {record.instaUsername}
                      </h5>
                    </FlexBetween>
                  );
                },
              },
              {
                title: "Points",
                dataIndex: "totalVote",
                align: "center",
                render: (value, record) => (
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
                onClick : () => {
                  if(isAuth){
                    navigate(`/profile/${record._id}`)
                  }
                }
              }
            }}
          ></Table>
        </ConfigProvider>
      </Box>
    </Box>
  );
};

export default LandingPage;
