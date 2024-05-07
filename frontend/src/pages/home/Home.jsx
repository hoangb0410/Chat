import MessageContainer from "../../components/messages/MessageContainer"
import SideBar from "../../components/sidebar/SideBar"

const Home = () => {
  return (
    <div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden shadow-md bg-blue-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 border border-gray-100'>
      <SideBar/>
      <MessageContainer/>
    </div>
  )
}

export default Home
