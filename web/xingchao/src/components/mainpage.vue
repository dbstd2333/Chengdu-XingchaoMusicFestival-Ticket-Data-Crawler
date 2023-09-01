<template>
    <div style="display: flex;">
        <div style=" margin-top: 50px;">
            <v-chart class="chart" id="main" :option="option" />
        </div>
    </div>
</template>

<script setup>
import { use } from "echarts/core";
import * as echarts from 'echarts/core';
import {
    TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from "echarts/renderers";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref } from "vue";
import axios from "axios";
use([
    CanvasRenderer,
    LineChart,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    DataZoomComponent,
    UniversalTransition
]);
let data = [];
let data2 = [];
let data3 = [];
let date = [];
var option1;

axios
  .post("/api/getlog")
  .then((res) => {
    console.log(res.data);
    for (let i = 0; i < Object.keys(res.data.yp102).length; i++) {
      data.push(res.data.yp102[i]);
      data2.push(res.data.yp103[i]);
      data3.push(res.data.yp23[i]);
      date.push(res.data.time[i]);
    }
    var myChart = echarts.init(document.getElementById("main"));
    option1 = {
      tooltip: {
        trigger: "axis",
        position: function (pt) {
          return [pt[0], "10%"];
        },
      },
      title: {
        left: "center",
        text: "历史余票数据大盘",
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: date,
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "20%"],
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: "10月2日余票",
          type: "line",
          symbol: "none",
          sampling: "lttb",
          areaStyle: {},
          data: data,
        },
        {
          name: "10月3日余票",
          type: "line",
          symbol: "none",
          sampling: "lttb",
          areaStyle: {},
          data: data2,
        },
        {
          name: "通票余票",
          type: "line",
          symbol: "none",
          sampling: "lttb",
          areaStyle: {},
          data: data3,
        },
      ],
    };
    myChart.setOption(option1);
    console.log("for end");
  })

</script>

<style scoped>
.chart {
    height: 300px;
    width: 100vw;
}
</style>