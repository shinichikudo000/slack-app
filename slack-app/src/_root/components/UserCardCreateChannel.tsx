import React from 'react'
import { User } from '../SideBar'

const UserCardCreateChannel = ({ userProp, onClick, members}: { userProp: User, onClick: () => void, members: User[] }) => {

  const handleClick = () => {
    onClick()
    const userExistsInMembers = members.some((member) => member.id === userProp.id);

    if (!userExistsInMembers) {
      // Add the user to the members state
      // You should use setMembers to update the state
      // For example, setMembers([...members, userProp]);
    }
  }
  return (
        <button onClick={handleClick}>
            <div key={userProp.id} className='w-12 h-12 rounded-full bg-slate-500 flex justify-center items-center'>
            {userProp.email[0].toUpperCase()}
            </div>
            <div className='w-[15rem] h-12 flex items-center'>
                {userProp.email}
            </div>
        </button>
  )
}

export default UserCardCreateChannel