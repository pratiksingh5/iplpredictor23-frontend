import React, { useState, useEffect } from "react";
import Navbar from "scenes/navbar";
import { Avatar, Table, Typography, ConfigProvider, theme } from "antd";
import { Box } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { url } from "helper/url";

const LandingPage = () => {
  const [dataSource, setDataSource] = useState([]);

  const getAllUsers = async () => {
    const response = await fetch(`${url}/getAllUsers`, {
      method: "GET",
    });
    const data = await response.json();
    const sortedData = data.sort((a, b) => b.correctedVote - a.correctedVote);
    let rank = 1;
    let prevVote = sortedData[0].correctedVote;
    const rankedData = sortedData.map((obj, index) => {
      if (obj.correctedVote < prevVote) {
        rank = index + 1;
        prevVote = obj.correctedVote;
      }
      return { ...obj, rank };
    });
    setDataSource(rankedData);
  };

  useEffect(() => {
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
            // loading={loading}
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
                    {record.correctedVote}/{record.totalVote}
                  </span>
                ),
              },
            ]}
            dataSource={dataSource}
            pagination={false}
          ></Table>
        </ConfigProvider>
      </Box>
    </Box>
  );
};

export default LandingPage;