export type RootStackParamList = {

  Login: undefined;
  HomePage: undefined;
  CameraScreen: { wastetype: string };
  SignUp: undefined;
  NewReport: { photo: string; text: string; wastetype: string; date: string }; // Parâmetros da rota NewReport
  NewRegistry: undefined;
  Reports: undefined; 
};