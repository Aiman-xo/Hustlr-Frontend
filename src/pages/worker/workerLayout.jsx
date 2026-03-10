import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/workerSidebar'; // Adjust path as needed

const WorkerLayout = () => {
  return (
    <div className="flex bg-[#f7f8f5]">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

export default WorkerLayout;