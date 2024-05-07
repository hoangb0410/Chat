import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../store/useConversation";

const Conversation = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === conversation.id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation.id);
  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
          isSelected ? "bg-sky-500" : ""
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-white">{conversation.fullName}</p>
            {/* <span className='text-xl'>Imoji</span> */}
          </div>
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;

// import React from 'react'

// const Conversation = () => {
//   return (
//     <>
//     <div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
//       <div className='avatar online'>
//         <div className='w-12 rounded-full'>
//             <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="user avatar" />
//         </div>
//       </div>
//       <div className='flex flex-col flex-1'>
//         <div className='flex gap-3 justify-between'>
//             <p className='font-bold text-gray-200'>Viet Hoang</p>
//             <span className='text-xl'>Imoji</span>
//         </div>
//       </div>
//     </div>
//     <div className='divider my-0 py-0 h-1' />
//     </>
//   )
// }

// export default Conversation