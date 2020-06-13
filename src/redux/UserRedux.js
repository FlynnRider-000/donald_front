const initialState = {
    signedIn: 0,
    fullName: "flynn rider",
    firstName: "flynn",
    lastName: "rider",
    userId: 0,
    userRole: 1,
};
  
export const reducer = (state = initialState, action) => {
    const { type, data } = action;
  
    switch (type) {
      case 'Set_UserData':
        return {
          ...state, 
          fullName: data.name,
          firstName: data.firstName,
          lastName: data.lastName,
          userId: data.id,
          userRole: data.role,
          signedIn: 1,
        };
      case 'Set_UserLogOut':
        return {
          ...state, 
          signedIn: 0,
        };
      default:
        return state;
    }
};
  