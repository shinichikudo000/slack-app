import React, { useContext } from 'react'
import { User } from '../SideBar'
import { Context } from './CreateChannel'

const UserCardCreateChannel = ({ userProp, onClick}: { userProp: User, onClick: () => void }) => {
  const context = useContext(Context)
  const dispatch = context ? context.dispatch : () => {};
  const handleClick = () => {
    onClick()
    if(dispatch) {
      dispatch({type: 'addMember', user: userProp})
    }
  }
  return (
        <button onClick={handleClick} className='flex gap-4 mb-4 hover:bg-slate-300 rounded-full'>
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