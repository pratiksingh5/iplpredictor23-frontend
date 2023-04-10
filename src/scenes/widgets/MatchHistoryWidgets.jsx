import React from "react";
import { Space, Table, Typography, ConfigProvider, theme, Spin } from "antd";

const MatchHistoryWidgets = ({userMatches, loading}) => {

//   useEffect(() => {

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

  return (
    <div>
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

                    return <div style={{ backgroundColor: "#27ae60", padding:"4px" , borderRadius:"3px"}}>{text}</div>;
                  } else {
                    return text;
                  }
                },
              },
            ]}
            dataSource={userMatches}
            pagination={{
                pageSize: 10
            }}
            loadingIndicator={<Spin />}
          ></Table>
        </Space>
      </ConfigProvider>
    </div>
  );
};

export default MatchHistoryWidgets;
