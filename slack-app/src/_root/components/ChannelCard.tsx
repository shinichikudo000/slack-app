import React from 'react';
import { Link } from 'react-router-dom';
import { Channels } from '../SideBar';


const ChannelCard = ({ channelProp }: { channelProp: Channels }) => {

  return (
        <Link to={`/Channel/${channelProp.id}`} className='flex gap-4 mb-4 hover:bg-slate-300 rounded-full'>
            <div key={channelProp.id} className='w-12 h-12 rounded-full bg-slate-500 flex justify-center items-center'>
            {channelProp.name[0].toUpperCase()}
            </div>
            <div className='w-[15rem] h-12 flex items-center'>
                {channelProp.name}
            </div>
        </Link>
  )
}

export default ChannelCard