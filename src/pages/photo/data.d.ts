/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-13 17:27:13
 * @LastEditors: hayato
 * @LastEditTime: 2022-02-13 17:27:14
 */
import { AnyAction, Reducer } from 'redux'
import { EffectsCommandMap } from 'dva'

export interface PhotoList {

}

export interface TagsType {
  name: string;
}

export interface CategoriesType {
  name: string;
}

export interface ImageSizesType {
  width: string;
  height: string;
  cdn_url: string;
  type: number;
}

export interface EquipmentsType {
  name: string;
  brand: string;
  type: string;
}

export interface PhotoListItemType {
  id: string;
  uid: string;
  name: string;
  des: string;
  location: string;
  iso: string;
  aperture: string;
  shutter: string;
  focal_length: string;
  tas: TagsType[];
  rate: number;
  categories: CategoriesType[];
  image_sizes: ImageSizesType[];
  add_time: string;
  modify_time: string;
  equipments: EquipmentsType[];
  shooting_date: string;
}


export interface StateType {
  results?: PhotoListItemType[];
  total: number;
}


export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect
  };
  reducers: {
    queryList: Reducer<StateType>;
  }
}