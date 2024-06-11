declare namespace DbTypes {
  namespace Tables {
    interface Users {
      id: number;
      email: string;
      password: string;
      refresh_token?: string;
    }
  }
}
