import { type PermissionItem } from './PermissionsTable';

export const permissionDataCN: PermissionItem[] = [
  { name: '位置信息', scenario: '路线规划/导航', impact: '无法提供定位服务' },
  { name: '相册/相机', scenario: '分享行程图片', impact: '无法上传图片' },
  { name: '存储权限', scenario: '用于缓存离线地图;保存用户生成的行程计划;访问相册', impact: '无法访问文件，部分功能无法实现' },
];

export const permissionDataEU: PermissionItem[] = [
  { name: 'Location Information', scenario: 'Route Planning/Navigation', impact: 'Unable to provide location service' },
  { name: 'Photo Album/Camera', scenario: 'Sharing itinerary pictures', impact: 'Unable to upload pictures' },
  { name: 'Storage Permission', scenario: 'Caching offline maps; Saving user-generated plans; Accessing photo album', impact: 'Unable to access files, partial functionality unavailable' },
];

export const permissionDataEU_ZH: PermissionItem[] = [
  { name: '位置信息', scenario: '路线规划/导航', impact: '无法提供定位服务' },
  { name: '相册/相机', scenario: '分享行程图片', impact: '无法上传图片' },
  { name: '存储权限', scenario: '缓存离线地图;保存用户生成的行程计划;访问相册', impact: '无法访问文件，部分功能无法实现' },
];