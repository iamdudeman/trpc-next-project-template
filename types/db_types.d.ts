declare namespace DbTypes {
  namespace Tables {
    interface Users {
      id: string;
      email: string;
      password: string;
      refresh_token?: string;
    }
  }
}
