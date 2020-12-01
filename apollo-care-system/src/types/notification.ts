export interface Notification {
  uuid: string;
  created_at: number;
  payload: Payload;
}

export interface Payload {
  data: string;
  type: string;
  user: NotificationUser;
}

export interface NotificationUser {
  name: string;
  uuid: string;
  place: string;
}
