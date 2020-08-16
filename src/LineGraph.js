import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          console.log(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && casesType==='recovered' && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "#98BEA2",
                borderColor: "#2A8C42",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
      {data?.length > 0 && casesType==='deaths' && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "#606878",
                borderColor: "#161625",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}

{data?.length > 0 && casesType==='cases' && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "#E395A1",
                borderColor: "rgb(204, 16, 52)",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;