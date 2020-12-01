/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:03:08
 * @LastEditors: hayato
 * @LastEditTime: 2020-11-28 01:19:03
 */
export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface BasicListItemDataType {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
  content: string;
  author: string;
  add_time: string;
  modify_time: string;
  image_url: string;
}
