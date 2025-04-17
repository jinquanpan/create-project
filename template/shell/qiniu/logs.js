import chalk from "chalk";
import { stdout as slog } from "single-line-log";

// log 进度条输出
export class ProgressBar {
  constructor(description, bar_length) {
    this.description = description;
    this.bar_length = bar_length;
  }

  render = (opts, color = "#26afd6") => {
    const clk = chalk.hex(color);
    const percent = Number((opts.completed / opts.total).toFixed(4)); // 计算进度(子任务的 完成数 除以 总数)
    const cellNum = Math.floor(percent * this.bar_length); // 计算需要多少个 █ 符号来拼凑图案

    // 拼接黑色条
    let cell = "";
    for (let i = 0; i < cellNum; i += 1) {
      cell += "█";
    }

    // 拼接灰色条
    let empty = "";
    for (let i = 0; i < this.bar_length - cellNum; i += 1) {
      empty += "░";
    }

    // 拼接最终文本
    const cmdText = `${this.description}: ${(100 * percent).toFixed(
      2
    )}% ${cell}${empty} ${opts.completed}/${opts.total}`;

    // 在单行输出文本
    slog(clk(cmdText));
  };
}

export const outputLog = (logs, color) => {
  logs.forEach((log) => {
    console.log(chalk.hex(color)(log));
  });
};

export const color = {
  green: "#77dd80",
  blue: "#26afd6",
  red: "#e73a15",
};
