import React from 'react'
import { User } from '../SideBar'
import { Link } from 'react-router-dom'

const UserCard = ({ userProp, onClick}: { userProp: User, onClick: () => void }) => {
  const history = JSON.parse(localStorage.getItem('history') || '[]') || []
  const handleClick = () => {
    onClick()
    const userExistsInHistory = history.some((userHistory: User) => {
      return userHistory.id === userProp.id;
    });
  
    if (!userExistsInHistory) {
      history.push(userProp);
      localStorage.setItem('history', JSON.stringify(history));
    }
  }
  return (
    <Link to={`/User/${userProp.id}`} className='flex gap-4 mb-4 hover:bg-slate-300 rounded-full' key={userProp.id} onClick={handleClick}>
        <div className='w-12 h-12 rounded-full bg-slate-500 flex justify-center items-center'>
            {userProp.email[0].toUpperCase()}
        </div>
        <div className='w-[15rem] h-12 flex items-center'>
            {userProp.email}
        </div>
    </Link>
  )
}

export default UserCard