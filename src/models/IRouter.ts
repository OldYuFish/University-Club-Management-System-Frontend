import { Component } from "vue";

export interface IRouterRecord {
  id: string
  name: string
  title: string
  icon: Component
  path: string
}
