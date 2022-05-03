/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2022-02-13 17:27:13
 * @LastEditors: hayato
 * @LastEditTime: 2022-04-30 18:39:31
 */
import { AnyAction, Reducer } from 'redux'
import { EffectsCommandMap } from 'dva'

export interface PhotoList {

}

export interface TagsType {
  name: string;
}

export interface CategoriesType {
  category_name: string;
  id: number;
}

export interface ImageSizesType {
  width: string;
  height: string;
  cdn_url: string;
  type: number;
  id: number;
}

export interface EquipmentsType {
  name: string;
  brand: string;
  type: string;
}

export interface PhotoListItemType {
  id: number;
  uid: string;
  name: string;
  des: string;
  location: string;
  iso: string;
  aperture: string;
  shutter: string;
  focal_length: string;
  tags: TagsType[];
  rate: number;
  categories: CategoriesType[];
  image_sizes: ImageSizesType[];
  add_time: string;
  modify_time: string;
  equipments: EquipmentsType[];
  shooting_date: string;
}


export interface TagsType {
  id: number;
  add_time: string;
  modify_time: string;
  tag_name: string;
}

export interface EquipmentsType {
  id: number;
  add_time: string;
  modify_time: string;
  name: string;
  brand: string;
  type: number;
  remark: string;
}

export interface CategoryType {
  id: number;
  add_time: string;
  modify_time: string;
  category_name: string;
}

export interface StateType {
  results?: PhotoListItemType[] | [];
  total: number;
  tagsResults?: TagsType[] | [];
  totalTags: number;
  equipmentsResults?: EquipmentsType[] | [];
  totalEquipments: number;
  categoryResults?: CategoryType[] | [];
  totalCategory: number;
  loading: boolean;
}


export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    patchPhoto: Effect;
    addPhoto: Effect;
    fetchTags: Effect;
    fetchCategory: Effect;
    fetchEquipments: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    queryTags: Reducer<StateType>;
    queryCategory: Reducer<StateType>;
    queryEquipments: Reducer<StateType>;
  }
}