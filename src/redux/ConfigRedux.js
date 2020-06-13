const initialState = {
    language:"DE",
};
  
export const reducer = (state = initialState, action) => {
    const { type, data } = action;
  
    switch (type) {
      case 'Set_Language':
        return {...state, language: data };
      default:
        return state;
    }
};
  