export type RootStackParamList = {

  Login: undefined;
  HomePage: undefined;
  CameraScreen: { wastetype: string };
  SignUp: undefined;
  NewReport: { 
    photo: string; 
    text: string; 
    wastetype: string; 
    date: string };
  NewRegistry: undefined;
  Reports: { refresh?: boolean };
  ReportDetails: { 
    id: string;
    date: string;
    type: string;
    weight: string;
    photoUrl: string;
    creatorName: string; };
  FeedbackScreen: undefined;
};