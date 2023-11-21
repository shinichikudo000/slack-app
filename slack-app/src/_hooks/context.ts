
export interface User {
    'access-token': string | '';
    uid: string | '';
    expiry: number | '';
    client: string | '';
}
  
//   export interface CurrentUserAction {
//     type: 'currentUser';
//     accessToken: string;
//     uid: string;
//     expiry: number;
//     client: string;
// }

// export function reducer(user: User, action: CurrentUserAction): User {
//     switch (action.type) {
//       case 'currentUser':
//         return {
//           ...user,
//           accessToken: action.accessToken,
//           uid: action.uid,
//           expiry: action.expiry,
//           client: action.client,
//         };
//       default:
//         return user;
//     }
// }