export interface User {
  email: string,
  password: string,
}

export interface Category {
  name: string,
  imageSrc?: string,
  user?: string,
  _id?: string,
}

export interface Message {
  message: string,
}

export interface Position {
  name: string,
  cost: number,
  category: string,
  _id?: string,
  user?: string,
  quantity?: number,
}

export interface Order {
  date?: Date,
  order?: number,
  user?: string,
  list: any[],
  _id?: string,
}

export interface OrderPosition {
  name: string,
  cost: number,
  quantity: number,
  _id?: string,
}

export interface Filter {
  start?: Date,
  end?: Date,
  order?: number,
}

export interface OverviewPageItem {
  percent: number,
  compare: number,
  yesterday: number,
  isHigher: boolean,
}

export interface OverviewPage {
  gain: OverviewPageItem,
  orders: OverviewPageItem,
}

export interface AnalyticsChartItem {
  label: string,
  gain: number,
  order: number
}

export interface AnalyticsPage {
  average: number,
  chart: AnalyticsChartItem[]
}
