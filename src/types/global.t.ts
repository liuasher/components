/*
 * @Author: your name
 * @Date: 2020-12-01 20:46:30
 * @LastEditTime: 2020-12-02 11:56:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gitlab\components\src\types\global.t.ts
 */
interface Project {
    startTime: number;
    endTime: number;
    projectName: string;
    projectId: string
}

enum CalendarViewType {
    ThisMonth,
    Today
}